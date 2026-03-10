import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, Clock, Calendar } from 'lucide-react';
import api from '../utils/api';

const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await api.get('/api/settings/schedule');
                setSchedule(res.data);
                setLoadingSchedule(false);
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
                setLoadingSchedule(false);
            }
        };
        fetchSchedule();
    }, []);

    const formatTime = (timeStr) => {
        if (!timeStr) return '--h--';
        return timeStr.replace(':', 'h');
    };

    // Removed hardcoded dayNames array for localized version

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/messages', formData);

            // Success response simulation if needed, but api.post throws on error
            setStatus('success');
            setFormData({ name: '', phone: '', subject: '', message: '' });
            setTimeout(() => setStatus(null), 3000);

        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page-root">
            {/* Header Section */}
            <div className="page-header">
                <h1>{t('contact.title')}</h1>
                <p>{t('contact.subtitle')}</p>
            </div>

            <div className="container">
                <div className="contact-grid-layout">

                    {/* LEFT COLUMN: Form & Business Hours */}
                    <div className="contact-left-side">

                        {/* Contact Form */}
                        <div className="glass-panel form-panel">
                            <h2>{t('contact.title')}</h2>
                            <form onSubmit={handleSubmit} className="clean-form">
                                <div className="form-group floating-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                    />
                                    <label>{t('contact.form.name')}</label>
                                </div>

                                <div className="form-group floating-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                    />
                                    <label>{t('contact.form.phone')}</label>
                                </div>

                                <div className="form-group floating-group">
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                    />
                                    <label>{t('contact.form.subject')}</label>
                                </div>

                                <div className="form-group floating-group">
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder=" "
                                        required
                                    ></textarea>
                                    <label>{t('contact.form.message')}</label>
                                </div>

                                <button type="submit" className="btn-primary btn-block">
                                    <Send size={18} style={{ marginRight: '8px' }} />
                                    {t('contact.form.submit')}
                                </button>

                                {status === 'success' && <div className="success-message">{t('contact.form.success')}</div>}
                                {status === 'error' && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{t('contact.form.error')}</div>}
                            </form>
                        </div>

                        {/* Business Hours Section (Under Form) */}
                        <div className="glass-panel hours-panel">
                            <div className="panel-header">
                                <Clock className="panel-icon" />
                                <h3>{t('contact.hours.title')}</h3>
                            </div>
                            <div className="hours-list">
                                {loadingSchedule ? (
                                    <div className="loading-small">{t('contact.hours.loading')}</div>
                                ) : (
                                    schedule.map((slot) => (
                                        <div key={slot._id || slot.dayOfWeek} className={`hour-row ${!slot.isOpen ? 'closed' : ''}`}>
                                            <span>{t(`contact.hours.days.${slot.dayOfWeek}`)}</span>
                                            {!slot.isOpen ? (
                                                <span className="status-closed">{t('contact.hours.closed')}</span>
                                            ) : (
                                                <span className="time-badge">
                                                    {formatTime(slot.openTime)} - {formatTime(slot.closeTime)}
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Map & Contact Info */}
                    <div className="contact-right-side">

                        <div className="glass-panel map-panel">
                            <h3>{t('contact.map')}</h3>
                            <div className="map-frame-wrapper">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.583347895475!2d3.056020!3d36.752500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f767838527%3A0x62957790b797282b!2sAlger!5e0!3m2!1sen!2sdz!4v1713390000000!5m2!1sen!2sdz"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Samy Locks Location"
                                ></iframe>
                            </div>

                            <div className="contact-info-grid">
                                <div className="info-item">
                                    <div className="icon-circle"><Phone size={20} /></div>
                                    <div>
                                        <p className="label">{t('contact.info.phone')}</p>
                                        <p className="value">+213 555 123 456</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="icon-circle"><Mail size={20} /></div>
                                    <div>
                                        <p className="label">{t('contact.info.email')}</p>
                                        <p className="value">contact@samylocks.com</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="icon-circle"><MapPin size={20} /></div>
                                    <div>
                                        <p className="label">{t('contact.info.address')}</p>
                                        <p className="value">{t('contact.info.addressValue')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
