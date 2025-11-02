import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, saveProfile } from '../services/profileService';
import './ProfileScreen.css';
import Spinner from '../components/Spinner';

function ProfileScreen() {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('parent');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (currentUser) {
          const profile = await getProfile(currentUser.uid);
          setName(profile?.name || currentUser.displayName || '');
          setAvatar(profile?.avatar || '');
          setRole(profile?.role || 'parent');
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        setToast({ message: 'Ошибка загрузки профиля', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [currentUser]);

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (currentUser) {
        await saveProfile(currentUser.uid, { name, avatar, role });
        setToast({ message: 'Профиль обновлён', type: 'success' });
      }
      setEdit(false);
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      setToast({ message: 'Ошибка сохранения профиля', type: 'error' });
    }
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  }

  if (loading) return <div className="profile-container"><Spinner /></div>;

  return (
    <div className="profile-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2>Профиль пользователя</h2>
      <div className="profile-avatar">
        {avatar ? (
          <img src={avatar} alt="avatar" />
        ) : (
          <FaUserCircle size={80} color="#4caf50" />
        )}
      </div>
      {edit ? (
        <form onSubmit={handleSave} className="profile-form">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Имя пользователя"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <div style={{ marginBottom: '12px' }}>
            <label style={{ marginRight: '10px' }}>Роль:</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="parent">Родитель</option>
              <option value="child">Ребёнок</option>
            </select>
          </div>
          <button type="submit">Сохранить</button>
        </form>
      ) : (
        <>
          <div className="profile-name">{name}</div>
          <div style={{ marginBottom: '12px' }}>Роль: <b>{role === 'parent' ? 'Родитель' : 'Ребёнок'}</b></div>
          <button onClick={() => setEdit(true)} className="profile-edit-btn">Редактировать</button>
        </>
      )}
      <div style={{ marginTop: '3rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', borderTop: '2px solid #4caf50' }}>
        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Разработчик: <strong>Богдан Павел</strong></p>
        <p style={{ margin: '0.5rem 0', color: '#999', fontSize: '0.85rem' }}>FamilyFlow MVP v1.0</p>
      </div>
    </div>
  );
}

export default ProfileScreen;
