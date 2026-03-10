import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, Clock } from 'lucide-react';
import Select from 'react-select';
import './Dashboard.css';
import './Settings.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, '0');
            const min = j.toString().padStart(2, '0');
            options.push(`${hour}:${min}`);
        }
    }
    return options;
};
const timeOptions = generateTimeOptions();
const timeSelectOptions = timeOptions.map(time => ({ value: time, label: time }));

const customSelectStyles = {
    control: (base) => ({
        ...base,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        minHeight: 'auto',
        width: '90px',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0',
        justifyContent: 'center',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '1rem',
        margin: 0,
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? 'var(--primary)' : '#666',
        padding: '2px',
        '&:hover': { color: 'var(--primary)' },
        display: 'flex',
        alignItems: 'center',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({
        ...base,
        background: '#222',
        border: '1px solid #444',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        width: '100px',
        marginTop: '8px',
        overflow: 'hidden',
    }),
    menuList: (base) => ({
        ...base,
        padding: '4px',
        maxHeight: '200px',
        '::-webkit-scrollbar': {
            width: '6px',
        },
        '::-webkit-scrollbar-track': {
            background: '#1a1a1a',
            borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb': {
            background: 'var(--primary)',
            borderRadius: '4px',
        },
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected ? 'var(--primary)' : isFocused ? '#333' : 'transparent',
        color: isSelected ? '#fff' : isFocused ? 'var(--primary)' : '#fff',
        cursor: 'pointer',
        padding: '8px 12px',
        textAlign: 'center',
        fontSize: '0.95rem',
        borderRadius: '4px',
        transition: 'all 0.2s',
        ':active': {
            backgroundColor: 'var(--primary)',
            color: '#fff'
        }
    })
};

const AdminSettings = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await api.get('/api/settings/schedule');
            setSchedule(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            toast.error('Failed to load schedule settings');
            setLoading(false);
        }
    };

    const handleToggleOpen = (dayIndex) => {
        const newSchedule = [...schedule];
        const daySetting = newSchedule.find(s => s.dayOfWeek === dayIndex);
        if (daySetting) {
            daySetting.isOpen = !daySetting.isOpen;
            setSchedule(newSchedule);
        }
    };

    const handleTimeChange = (dayIndex, field, value) => {
        const newSchedule = [...schedule];
        const daySetting = newSchedule.find(s => s.dayOfWeek === dayIndex);
        if (daySetting) {
            daySetting[field] = value;
            setSchedule(newSchedule);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // Save all days (could be optimized, but safe enough for 7 days)
            await Promise.all(schedule.map(daySetting => 
                api.put(`/api/settings/schedule/${daySetting.dayOfWeek}`, {
                    isOpen: daySetting.isOpen,
                    openTime: daySetting.openTime,
                    closeTime: daySetting.closeTime
                })
            ));
            toast.success('Schedule updated successfully!');
        } catch (error) {
            console.error('Error saving schedule:', error);
            toast.error('Failed to save some settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading settings...</div>;

    return (
        <div className="container admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Business Schedule</h1>
                <button 
                    className="btn-primary" 
                    onClick={saveSettings} 
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-container">
                <div className="settings-grid">
                    {daysOfWeek.map((dayName, index) => {
                        const dayData = schedule.find(s => s.dayOfWeek === index) || {
                            isOpen: false, openTime: '08:00', closeTime: '17:00'
                        };

                        return (
                            <div key={index} className={`day-card ${dayData.isOpen ? 'is-open' : 'is-closed'}`}>
                                <div className="day-header">
                                    <h3>{dayName}</h3>
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox" 
                                            checked={dayData.isOpen} 
                                            onChange={() => handleToggleOpen(index)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="status-text">{dayData.isOpen ? 'Open' : 'Closed'}</span>
                                </div>

                                <div className={`time-controls ${dayData.isOpen ? 'visible' : 'hidden'}`}>
                                    <div className="time-input-group">
                                        <Clock size={16} className="time-icon" />
                                        <Select
                                            value={{ value: dayData.openTime, label: dayData.openTime }}
                                            onChange={(option) => handleTimeChange(index, 'openTime', option.value)}
                                            options={timeSelectOptions}
                                            menuPortalTarget={document.body}
                                            styles={customSelectStyles}
                                            isSearchable={false}
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                    <span className="time-separator">util</span>
                                    <div className="time-input-group">
                                        <Clock size={16} className="time-icon" />
                                        <Select
                                            value={{ value: dayData.closeTime, label: dayData.closeTime }}
                                            onChange={(option) => handleTimeChange(index, 'closeTime', option.value)}
                                            options={timeSelectOptions}
                                            menuPortalTarget={document.body}
                                            styles={customSelectStyles}
                                            isSearchable={false}
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
