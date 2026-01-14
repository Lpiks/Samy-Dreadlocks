import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Booking = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceId: '',
        date: '',
        notes: ''
    });
    const [status, setStatus] = useState('');

    // Mock services list (normally strictly fetched)
    const services = [
        { id: '1', name: 'Traditional Locs' },
        { id: '2', name: 'Loc Retwist' },
        { id: '3', name: 'Interlocking' },
        { id: '4', name: 'Loc Extensions' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Logic to actually create appointment
            // await axios.post('http://localhost:5000/api/appointments', formData);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="page-container container">
            <div className="booking-wrapper">
                <header className="page-header">
                    <h1>{t('booking.title')}</h1>
                    <p>{t('booking.subtitle')}</p>
                </header>

                {status === 'success' ? (
                    <div className="alert success">{t('booking.success')}</div>
                ) : (
                    <form className="booking-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('booking.name')}</label>
                            <input type="text" name="name" required onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>{t('booking.email')}</label>
                            <input type="email" name="email" required onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>{t('booking.phone')}</label>
                            <input type="tel" name="phone" required onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>{t('booking.service')}</label>
                            <select name="serviceId" required onChange={handleChange}>
                                <option value="">Select a service</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('booking.date')}</label>
                            <input type="datetime-local" name="date" required onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>{t('booking.notes')}</label>
                            <textarea name="notes" rows="4" onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" className="btn-primary btn-block">{t('booking.submit')}</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Booking;
