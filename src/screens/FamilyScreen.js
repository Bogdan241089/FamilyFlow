import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { createFamily, getFamily, getFamilyMembers, sendInvite, getInvites, acceptInvite, rejectInvite } from '../services/familyService';
import { FaUsers, FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import NavBar from '../components/NavBar';
import ThemeToggle from '../components/ThemeToggle';
import InviteQRCode from '../components/InviteQRCode';
import AvatarUpload from '../components/AvatarUpload';

// Простой Toast компонент
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'error' ? '#f44336' : '#4caf50',
      color: 'white',
      padding: '1rem',
      borderRadius: '4px',
      zIndex: 1000,
      cursor: 'pointer'
    }} onClick={onClose}>
      {message}
    </div>
  );
}

function FamilyScreen() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [familyId, setFamilyId] = useState(null);
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [toast, setToast] = useState(null);
  
  const [familyName, setFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    loadData();
  }, [currentUser]);

  async function loadData() {
    try {
      if (!currentUser) return;
      
      const profile = await getProfile(currentUser.uid);
      const fid = profile?.defaultFamilyId;
      
      if (fid) {
        setFamilyId(fid);
        const familyData = await getFamily(fid);
        setFamily(familyData);
        const membersData = await getFamilyMembers(fid);
        setMembers(membersData);
      }
      
      const invitesData = await getInvites(currentUser.email);
      setInvites(invitesData);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setToast({ message: 'Ошибка загрузки данных', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFamily(e) {
    e.preventDefault();
    if (!familyName.trim()) return;
    
    if (!currentUser) {
      setToast({ message: 'Войдите в систему', type: 'error' });
      return;
    }
    
    try {
      const fid = await createFamily(currentUser.uid, familyName);
      setToast({ message: 'Семья создана!', type: 'success' });
      setFamilyName('');
      await loadData();
    } catch (err) {
      console.error('Ошибка создания семьи:', err);
      setToast({ message: 'Ошибка создания семьи', type: 'error' });
    }
  }

  async function handleSendInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim() || !familyId || !currentUser) return;
    
    try {
      const inviteId = await sendInvite(familyId, inviteEmail, currentUser.uid);
      const inviteLink = `${window.location.origin}/invite/${inviteId}`;
      await navigator.clipboard.writeText(inviteLink);
      setToast({ message: 'Ссылка-приглашение скопирована! Отправьте её пользователю.', type: 'success' });
      setInviteEmail('');
    } catch (err) {
      console.error('Ошибка отправки приглашения:', err);
      setToast({ message: 'Ошибка отправки приглашения', type: 'error' });
    }
  }

  async function handleAcceptInvite(inviteId) {
    if (!currentUser) return;
    try {
      await acceptInvite(inviteId, currentUser.uid);
      setToast({ message: 'Приглашение принято!', type: 'success' });
      await loadData();
    } catch (err) {
      console.error('Ошибка принятия приглашения:', err);
      setToast({ message: 'Ошибка принятия приглашения', type: 'error' });
    }
  }

  async function handleRejectInvite(inviteId) {
    try {
      await rejectInvite(inviteId);
      setToast({ message: 'Приглашение отклонено', type: 'success' });
      await loadData();
    } catch (err) {
      console.error('Ошибка отклонения приглашения:', err);
      setToast({ message: 'Ошибка отклонения приглашения', type: 'error' });
    }
  }

  if (loading) return <Spinner />;

  return (
    <>
      <ThemeToggle />
      <NavBar />
      <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h2><FaUsers style={{ marginRight: '0.5rem', color: '#4caf50' }}/> Управление семьёй</h2>

      {invites.length > 0 && (
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Приглашения ({invites.length})</h3>
          {invites.map(invite => (
            <div key={invite.id} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{invite.familyName}</strong>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                  Приглашение в семью
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleAcceptInvite(invite.id)}
                  style={{ padding: '0.5rem 1rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  <FaCheck /> Принять
                </button>
                <button 
                  onClick={() => handleRejectInvite(invite.id)}
                  style={{ padding: '0.5rem 1rem', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  <FaTimes /> Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!familyId ? (
        <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>У вас ещё нет семьи</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Создайте семью, чтобы начать совместное планирование</p>
          <form onSubmit={handleCreateFamily} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <input 
              type="text"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              placeholder="Название семьи"
              style={{ width: '100%', padding: '0.7rem', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '1rem' }}
            />
            <button 
              type="submit"
              style={{ padding: '0.7rem 2rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
              Создать семью
            </button>
          </form>
        </div>
      ) : (
        <>
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>{family?.name}</h3>
            <p style={{ margin: 0, color: '#666' }}>Участников: {members.length}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <InviteQRCode familyId={familyId} role="child" />
            <InviteQRCode familyId={familyId} role="grandparent" />
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Члены семьи</h3>
            {members.length === 0 ? (
              <p style={{ color: '#999' }}>Нет участников</p>
            ) : (
              members.map(member => (
                <div key={member.id} style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {currentUser && member.id === currentUser.uid ? (
                    <AvatarUpload userId={member.id} currentAvatar={member.avatar} onUploadComplete={loadData} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {member.avatar ? <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem' }}>👤</span>}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong>{member.name || 'Пользователь'}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {member.role === 'parent' ? 'Родитель' : member.role === 'grandparent' ? 'Бабушка/Дедушка' : 'Ребёнок'}
                    </div>
                  </div>
                  {currentUser && member.id === currentUser.uid && (
                    <span style={{ fontSize: '0.85rem', color: '#4caf50', fontWeight: 'bold' }}>Вы</span>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
}

export default FamilyScreen;
