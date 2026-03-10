import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Calendar, Scissors, MessageSquare } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fr, ar } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';

registerLocale('fr', fr);
registerLocale('ar', ar);

const Booking = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceId: '',
        date: null,
        notes: ''
    });
    const [status, setStatus] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showServices, setShowServices] = useState(false);

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    
    // New state for availability
    const [schedule, setSchedule] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableTimes, setAvailableTimes] = useState({ 
        minTime: new Date(new Date().setHours(8, 0, 0, 0)), 
        maxTime: new Date(new Date().setHours(23, 0, 0, 0)) 
    });

    const location = useLocation();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [servicesRes, scheduleRes] = await Promise.all([
                    api.get('/api/services'),
                    api.get('/api/settings/schedule')
                ]);
                setServices(servicesRes.data);
                setSchedule(scheduleRes.data);
                setLoadingServices(false);

                // Check for serviceId in URL and auto-select
                const params = new URLSearchParams(location.search);
                const serviceIdFromUrl = params.get('serviceId');
                if (serviceIdFromUrl && servicesRes.data.some(s => s._id === serviceIdFromUrl)) {
                    setFormData(prev => ({ ...prev, serviceId: serviceIdFromUrl }));
                }
            } catch (err) {
                console.error('Failed to fetch initial data', err);
                setLoadingServices(false);
            }
        };
        fetchInitialData();
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = async (date) => {
        setFormData({ ...formData, date: date });
        
        if (!date) return;

        // 1. Set Min/Max Time based on Admin Schedule for that day
        const dayOfWeek = date.getDay();
        const daySchedule = schedule.find(s => s.dayOfWeek === dayOfWeek);
        
        let newMinTime = new Date(date).setHours(8, 0, 0, 0);
        let newMaxTime = new Date(date).setHours(23, 0, 0, 0);

        if (daySchedule && daySchedule.isOpen) {
            const [openHour, openMin] = daySchedule.openTime.split(':');
            const [closeHour, closeMin] = daySchedule.closeTime.split(':');
            newMinTime = new Date(date).setHours(parseInt(openHour), parseInt(openMin), 0, 0);
            newMaxTime = new Date(date).setHours(parseInt(closeHour), parseInt(closeMin), 0, 0);
        }
        
        setAvailableTimes({ minTime: newMinTime, maxTime: newMaxTime });

        // 2. Fetch specific booked slots for that day to exclude them
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const res = await api.get(`/api/appointments/availability?date=${formattedDate}`);
            
            // Convert start/end strings into an array of excluded specific Dates (every 30 mins)
            const getExcludedTimes = (slots) => {
                let excluded = [];
                slots.forEach(slot => {
                    let start = new Date(slot.start);
                    let end = new Date(slot.end);
                    while (start < end) {
                        excluded.push(new Date(start));
                        start = new Date(start.getTime() + 30 * 60000); // 30 min intervals
                    }
                });
                return excluded;
            };

            setBookedSlots(getExcludedTimes(res.data.bookedSlots));
        } catch (err) {
            console.error('Failed to fetch availability', err);
        }
    };

    // Generate available time pills for the selected date
    const [availableTimePills, setAvailableTimePills] = useState([]);

    useEffect(() => {
        if (!formData.date) return;
        
        const pills = [];
        let currentTime = new Date(availableTimes.minTime);
        const endTime = new Date(availableTimes.maxTime);

        while (currentTime < endTime) {
            const timeToCheck = new Date(currentTime);
            // Check if this specific time is in the bookedSlots
            const isBooked = bookedSlots.some(b => b.getTime() === timeToCheck.getTime());
            
            if (!isBooked) {
                pills.push(new Date(timeToCheck));
            }
            currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 mins
        }
        setAvailableTimePills(pills);
    }, [formData.date, availableTimes, bookedSlots]);

    const handleTimeSelect = (timeStr) => {
        // timeStr is a Date object from the pills
        setFormData({ ...formData, date: timeStr });
        setShowCalendar(false); // Close calendar after full selection
    };

    // Helper for react-datepicker to disable visually closed days
    const isWeekday = (date) => {
        const day = date.getDay();
        const daySetting = schedule.find(s => s.dayOfWeek === day);
        return daySetting ? daySetting.isOpen : true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/appointments', formData);
            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                serviceId: '',
                date: null,
                notes: ''
            });
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="page-container container">
            <Helmet>
                <title>{t('metadata.booking.title')}</title>
                <meta name="description" content={t('metadata.booking.description')} />
            </Helmet>
            <div className="booking-layout">
                <div className="booking-info">
                    <div className="info-content">
                        <h1>{t('booking.title')}</h1>
                        <p className="subtitle">{t('booking.subtitle')}</p>

                        <div className="info-details">
                            <div className="detail-item">
                                <h3>{t('booking.expertStylists')}</h3>
                                <p>{t('booking.expertStylistsDesc')}</p>
                            </div>
                            <div className="detail-item">
                                <h3>{t('booking.premiumProducts')}</h3>
                                <p>{t('booking.premiumProductsDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="booking-form-container">
                    {status === 'success' ? (
                        <div className="alert success">
                            <h3>{t('booking.confirmed')}</h3>
                            <p>{t('booking.success')}</p>
                            <button className="btn-primary" onClick={() => setStatus('')}>{t('booking.bookAnother')}</button>
                        </div>
                    ) : (
                        <form className="booking-form modern-form" onSubmit={handleSubmit}>
                            <h2>{t('booking.formTitle')}</h2>

                            <div className="form-group">
                                <label>{t('booking.name')}</label>
                                <div className="input-with-icon">
                                    <User className="icon" size={20} />
                                    <input type="text" name="name" required onChange={handleChange} placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('booking.email')}</label>
                                <div className="input-with-icon">
                                    <Mail className="icon" size={20} />
                                    <input type="email" name="email" required onChange={handleChange} placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('booking.phone')}</label>
                                <div className="input-with-icon">
                                    <Phone className="icon" size={20} />
                                    <input type="tel" name="phone" required onChange={handleChange} placeholder="+1 234 567 890" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('booking.service')}</label>
                                
                                <button 
                                    type="button" 
                                    className="service-trigger-btn"
                                    onClick={() => setShowServices(!showServices)}
                                >
                                    <Scissors size={20} className="icon" />
                                    <span>
                                        {formData.serviceId 
                                            ? services.find(s => s._id === formData.serviceId)?.name 
                                            : t('booking.selectService')}
                                    </span>
                                </button>

                                {showServices && (
                                    <div className="services-selection-grid-container">
                                        <div className="services-selection-grid">
                                            {services.map(s => (
                                                <div 
                                                    key={s._id} 
                                                    className={`service-selection-card ${formData.serviceId === s._id ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setFormData({ ...formData, serviceId: s._id });
                                                        setShowServices(false); // Auto-close after selection
                                                    }}
                                                >
                                                    <div className="card-header">
                                                        <span className="service-name">{s.name}</span>
                                                        <Scissors size={16} className="card-icon" />
                                                    </div>
                                                    <div className="card-details">
                                                        <span className="service-price">{s.price} DZD</span>
                                                        <span className="service-duration">{s.duration}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <input type="hidden" name="serviceId" value={formData.serviceId} required />
                            </div>

                            <div className="form-group">
                                <label>{t('booking.date')}</label>
                                
                                <button 
                                    type="button" 
                                    className="date-trigger-btn"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                >
                                    <Calendar size={20} className="icon" />
                                    <span>
                                        {formData.date 
                                            ? formData.date.toLocaleString(i18n.language, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                                            : t('booking.selectDateTime')}
                                    </span>
                                </button>

                                {showCalendar && (
                                    <div className="custom-schedule-container">
                                        <div className="calendar-section">
                                            <DatePicker
                                                selected={formData.date}
                                                onChange={(date) => {
                                                    // Preserve the time if already selected, otherwise set to 8am or minTime
                                                    const newDate = new Date(date);
                                                    if (formData.date) {
                                                        newDate.setHours(formData.date.getHours(), formData.date.getMinutes());
                                                    } else {
                                                        newDate.setHours(new Date(availableTimes.minTime).getHours(), new Date(availableTimes.minTime).getMinutes());
                                                    }
                                                    handleDateChange(newDate);
                                                }}
                                                inline
                                                filterDate={isWeekday}
                                                minDate={new Date()}
                                                locale={i18n.language}
                                            />
                                        </div>
                                        
                                        {formData.date && (
                                            <div className="time-pills-section">
                                                <h4>{t('booking.availableTimes')}</h4>
                                                <div className="time-pills-grid">
                                                    {availableTimePills.length > 0 ? (
                                                        availableTimePills.map((time, idx) => (
                                                            <button 
                                                                key={idx} 
                                                                type="button"
                                                                className={`time-pill ${formData.date.getTime() === time.getTime() ? 'selected' : ''}`}
                                                                onClick={() => handleTimeSelect(time)}
                                                            >
                                                                {time.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <p className="no-times">{t('booking.noSlots')}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>{t('booking.notes')}</label>
                                <div className="input-with-icon textarea-container">
                                    <MessageSquare className="icon" size={20} />
                                    <textarea name="notes" rows="3" onChange={handleChange} placeholder="Any specific requirements?"></textarea>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary btn-block">{t('booking.submit')}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;
