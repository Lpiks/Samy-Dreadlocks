import toast from 'react-hot-toast';
import React from 'react';

const confirmToast = (message, onConfirm) => {
    toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>{message}</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }}
                    style={{
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Confirm
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        padding: '5px 10px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    ), {
        duration: 5000,
        style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e1e1e1'
        }
    });
};

export default confirmToast;
