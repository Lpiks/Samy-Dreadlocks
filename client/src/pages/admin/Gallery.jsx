import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import confirmToast from '../../utils/confirmToast';
import './Gallery.css';
import './Services.css'; // Reuse modal styles

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await api.get('/api/gallery');
            setImages(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load gallery images');
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        confirmToast('Are you sure you want to delete this image?', async () => {
            try {
                await api.delete(`/api/gallery/${id}`);
                setImages(images.filter(img => img._id !== id));
                toast.success('Image deleted');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete image');
            }
        });
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageUrl) {
            toast.error('Please upload an image first');
            return;
        }

        try {
            const res = await api.post('/api/gallery', { imageUrl: newImageUrl });
            setImages([res.data, ...images]);
            toast.success('Image added to gallery');
            handleCloseModal();
        } catch (err) {
            console.error(err);
            toast.error('Failed to add image');
        }
    };

    const handleCloseModal = () => {
        setNewImageUrl('');
        setShowModal(false);
    };

    return (
        <div className="container admin-container">
            <div className="services-header">
                <h1 className="title-no-margin">Manage Gallery</h1>
                <button
                    className="btn-primary btn-add-service"
                    onClick={() => setShowModal(true)}
                    title="Add Image"
                >
                    <Plus size={24} />
                </button>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="gallery-grid">
                    {images.length === 0 ? (
                        <div className="empty-state">
                            <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3>No images in gallery yet</h3>
                            <p>Click "Add Image" to start building your portfolio.</p>
                        </div>
                    ) : (
                        images.map(img => (
                            <div key={img._id} className="gallery-card">
                                <img src={img.imageUrl} alt="Gallery item" className="gallery-image" />
                                <div className="gallery-actions">
                                    <button
                                        className="btn-delete-image"
                                        onClick={() => handleDelete(img._id)}
                                        title="Delete Image"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '420px' }}>
                        <div className="modal-header">
                            <h2>Add New Image</h2>
                            <button className="btn-close" onClick={handleCloseModal}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddImage}>
                            <div className="form-group">
                                <label>Upload Image</label>
                                <ImageUpload
                                    imageUrl={newImageUrl}
                                    onImageUpload={setNewImageUrl}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-primary">Add to Gallery</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
