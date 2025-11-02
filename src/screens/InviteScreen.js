import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { acceptInvite } from '../services/familyService';
import Spinner from '../components/Spinner';

function InviteScreen() {
  const { inviteId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInvite();
  }, [inviteId]);

  async function loadInvite() {
    try {
      const inviteSnap = await getDoc(doc(db, 'invites', inviteId));
      if (!inviteSnap.exists()) {
        setError('Приглашение не найдено');
        return;
      }
      const inviteData = inviteSnap.data();
      if (inviteData.status !== 'pending') {
        setError('Приглашение уже использовано');
        return;
      }
      setInvite({ id: inviteSnap.id, ...inviteData });
    } catch (err) {
      console.error('Ошибка загрузки приглашения:', err);
      setError('Ошибка загрузки приглашения');
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept() {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      await acceptInvite(inviteId, currentUser.uid);
      navigate('/family');
    } catch (err) {
      console.error('Ошибка принятия приглашения:', err);
      setError('Ошибка принятия приглашения');
    }
  }

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.7rem 2rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Приглашение в семью</h2>
      <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>
        Вы приглашены присоединиться к семье!
      </p>
      {!currentUser ? (
        <div>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Войдите или зарегистрируйтесь, чтобы принять приглашение</p>
          <button onClick={() => navigate('/login')} style={{ padding: '0.7rem 2rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
            Войти
          </button>
          <button onClick={() => navigate('/register')} style={{ padding: '0.7rem 2rem', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Регистрация
          </button>
        </div>
      ) : (
        <button onClick={handleAccept} style={{ padding: '0.7rem 2rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
          Принять приглашение
        </button>
      )}
    </div>
  );
}

export default InviteScreen;
