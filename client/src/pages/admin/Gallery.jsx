import React from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminGallery = () => {
    const handleAddImage = () => {
        toast.error("Add Gallery Image functionality coming soon!");
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', margin: 0 }}>Manage Gallery</h1>
                <button
                    className="btn-primary"
                    onClick={handleAddImage}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add Image
                </button>
            </div>

            <p style={{ textAlign: 'center', color: '#888' }}>Gallery management is under construction.</p>
        </div>
    );
};

export default AdminGallery;
