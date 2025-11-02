import React, { useState } from 'react';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import { uploadAvatar } from '../services/storageService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './AvatarUpload.css';

function AvatarUpload({ userId, currentAvatar, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Выберите изображение');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Размер файла не должен превышать 2 МБ');
      return;
    }

    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(userId, file);
      await updateDoc(doc(db, 'profiles', userId), { avatar: avatarUrl });
      if (onUploadComplete) onUploadComplete(avatarUrl);
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      alert('Не удалось загрузить аватар');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        {currentAvatar ? (
          <img src={currentAvatar} alt="Avatar" />
        ) : (
          <div className="avatar-placeholder">👤</div>
        )}
      </div>
      <label className="avatar-upload-btn">
        {uploading ? <FaSpinner className="spin" /> : <FaCamera />}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
}

export default AvatarUpload;
