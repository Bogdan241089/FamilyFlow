import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/profileService';
import Spinner from './Spinner';
import ThemeToggle from './ThemeToggle';

function Main() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        const data = await getProfile(currentUser.uid);
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={styles.container}>
      <ThemeToggle />
      <header style={styles.header}>
        <h1>Главный экран</h1>
        <div style={styles.userInfo}>
          <span>Добро пожаловать, {profile?.name || currentUser?.email}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </header>
      
      <main style={styles.content}>
        <div style={styles.welcome}>
          <h2>Регистрация прошла успешно!</h2>
          <p>Вы успешно вошли в систему.</p>
          <div style={styles.userDetails}>
            <p><strong>Имя:</strong> {profile?.name || 'Не указано'}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Роль:</strong> {profile?.role || 'parent'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    background: 'white',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  welcome: {
    background: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  userDetails: {
    marginTop: '30px',
    textAlign: 'left',
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '4px'
  }
};

export default Main;