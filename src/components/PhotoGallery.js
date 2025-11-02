import React, { useState } from 'react';
import { FaPlus, FaTimes, FaExpand } from 'react-icons/fa';
import { uploadTaskPhoto, deletePhoto } from '../services/storageService';
import './PhotoGallery.css';

function PhotoGallery({ familyId, taskId, photos = [], onPhotosChange }) {
  const [uploading, setUploading] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ');
      return;
    }

    setUploading(true);
    try {
      const photoUrl = await uploadTaskPhoto(familyId, taskId, file);
      const newPhotos = [...photos, photoUrl];
      if (onPhotosChange) onPhotosChange(newPhotos);
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      alert('Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    if (!window.confirm('Удалить фото?')) return;
    
    try {
      await deletePhoto(photoUrl);
      const newPhotos = photos.filter(p => p !== photoUrl);
      if (onPhotosChange) onPhotosChange(newPhotos);
    } catch (error) {
      console.error('Ошибка удаления фото:', error);
    }
  };

  return (
    <>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`Photo ${index + 1}`} />
            <div className="photo-actions">
              <button onClick={() => setLightboxPhoto(photo)} title="Увеличить">
                <FaExpand />
              </button>
              <button onClick={() => handleDeletePhoto(photo)} title="Удалить">
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
        
        <label className="photo-add-btn">
          {uploading ? '...' : <FaPlus />}
          <input
            type="file"
            accept="image/*"
            onChange={handleAddPhoto}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {lightboxPhoto && (
        <div className="lightbox" onClick={() => setLightboxPhoto(null)}>
          <img src={lightboxPhoto} alt="Full size" />
          <button className="lightbox-close" onClick={() => setLightboxPhoto(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
