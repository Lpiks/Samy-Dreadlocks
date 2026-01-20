import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './ImageUpload.css';

const ImageUpload = ({ imageUrl, onImageUpload }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation (max 5MB, images only)
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            onImageUpload(res.data.url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        onImageUpload('');
    };

    return (
        <div className="image-upload-container">
            <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={uploading}
            />

            <label
                htmlFor="file-upload"
                className={`image-preview-area ${uploading ? 'uploading' : ''}`}
            >
                {uploading ? (
                    <div className="upload-placeholder">
                        <div className="spinner"></div>
                        <span className="upload-text">Uploading...</span>
                    </div>
                ) : imageUrl ? (
                    <>
                        <img src={imageUrl} alt="Preview" className="preview-image" />
                        <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <div className="upload-placeholder">
                        <Upload className="upload-icon" />
                        <span className="upload-text">Click to upload image</span>
                    </div>
                )}
            </label>
        </div>
    );
};

export default ImageUpload;
