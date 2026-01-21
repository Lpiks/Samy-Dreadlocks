import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceId: '',
        date: null,
        notes: ''
    });
    const [status, setStatus] = useState('');

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/api/services');
                setServices(res.data);
                setLoadingServices(false);
            } catch (err) {
                console.error('Failed to fetch services', err);
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, date: date });
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
            <div className="booking-layout">
                <div className="booking-info">
                    <div className="info-content">
                        <h1>{t('booking.title')}</h1>
                        <p className="subtitle">{t('booking.subtitle')}</p>

                        <div className="info-details">
                            <div className="detail-item">
                                <h3>Expert Stylists</h3>
                                <p>Our team of professionals are dedicated to giving you the best look.</p>
                            </div>
                            <div className="detail-item">
                                <h3>Premium Products</h3>
                                <p>We only use high-quality, natural products for your hair.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="booking-form-container">
                    {status === 'success' ? (
                        <div className="alert success">
                            <h3>Booking Confirmed!</h3>
                            <p>{t('booking.success')}</p>
                            <button className="btn-primary" onClick={() => setStatus('')}>Book Another</button>
                        </div>
                    ) : (
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <h2>Book Appointment</h2>
                            <div className="form-group floating-group">
                                <input type="text" name="name" required onChange={handleChange} placeholder=" " />
                                <label>{t('booking.name')}</label>
                            </div>

                            <div className="form-group floating-group">
                                <input type="email" name="email" required onChange={handleChange} placeholder=" " />
                                <label>{t('booking.email')}</label>
                            </div>

                            <div className="form-group floating-group">
                                <input type="tel" name="phone" required onChange={handleChange} placeholder=" " />
                                <label>{t('booking.phone')}</label>
                            </div>

                            <div className="form-group floating-group">
                                <select name="serviceId" required onChange={handleChange}>
                                    <option value="">Select a service</option>
                                    {services.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                                <label className="static-label">{t('booking.service')}</label>
                            </div>

                            <div className="form-group floating-group">
                                <DatePicker
                                    selected={formData.date}
                                    onChange={handleDateChange}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    placeholderText=" "
                                    className="date-picker-input"
                                    wrapperClassName="date-picker-wrapper"
                                    minTime={new Date(new Date().setHours(8, 0, 0, 0))}
                                    maxTime={new Date(new Date().setHours(23, 0, 0, 0))}
                                    required
                                />
                                <label className="static-label date-label">{t('booking.date')}</label>
                            </div>

                            <div className="form-group floating-group">
                                <textarea name="notes" rows="3" onChange={handleChange} placeholder=" "></textarea>
                                <label>{t('booking.notes')}</label>
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
