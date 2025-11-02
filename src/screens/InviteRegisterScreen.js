import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateInviteCode, useInviteCode } from '../services/inviteService';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import FormInput from '../components/FormInput';
import ThemeToggle from '../components/ThemeToggle';
import { FaUser, FaLock, FaQrcode } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import '../components/Auth.css';

function InviteRegisterScreen() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkInvite() {
      try {
        const inviteData = await validateInviteCode(code);
        if (!inviteData) {
          setError('Код приглашения недействителен или уже использован');
        } else {
          setInvite(inviteData);
        }
      } catch (error) {
        console.error('Ошибка проверки кода:', error);
        setError('Ошибка проверки кода приглашения');
      } finally {
        setLoading(false);
      }
    }
    checkInvite();
  }, [code]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setNameError('');
    setPasswordError('');
    setError('');

    if (!name || name.length < 2) {
      setNameError('Имя должно быть минимум 2 символа');
      return;
    }
    if (!password || password.length < 6) {
      setPasswordError('Пароль должен быть минимум 6 символов');
      return;
    }

    setSubmitting(true);
    try {
      const email = `${code.toLowerCase()}_${Date.now()}@familyflow.local`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        role: invite.role,
        defaultFamilyId: invite.familyId,
        createdAt: new Date().toISOString(),
        registeredViaInvite: true
      });

      const familyRef = doc(db, 'families', invite.familyId);
      const familySnap = await getDoc(familyRef);
      
      if (familySnap.exists()) {
        await updateDoc(familyRef, {
          members: arrayUnion(uid)
        });
      }

      await setDoc(doc(db, `families/${invite.familyId}/members`, uid), {
        role: invite.role,
        joinedAt: new Date().toISOString()
      });

      await useInviteCode(invite.id);

      navigate('/home');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setError('Ошибка регистрации: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <Spinner />
      </div>
    );
  }

  if (!invite) {
    return (
      <>
        <ThemeToggle />
        <div className="auth-container fade-in">
          <div className="auth-card">
            <h2>❌ Недействительное приглашение</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              {error || 'Код приглашения недействителен или уже использован'}
            </p>
            <button onClick={() => navigate('/login')} className="auth-button" style={{ marginTop: '1rem' }}>
              Перейти ко входу
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      <div className="auth-container fade-in">
        <div className="auth-card">
          <div style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '1rem' }}>
            <FaQrcode color="var(--primary)" />
          </div>
          <h2>Регистрация по приглашению</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Вы приглашены как <strong>{invite.role === 'child' ? 'ребёнок' : invite.role === 'grandparent' ? 'бабушка/дедушка' : 'член семьи'}</strong>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleRegister}>
            <FormInput
              label="Ваше имя"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как вас зовут?"
              icon={<FaUser />}
              error={nameError}
              disabled={submitting}
            />

            <FormInput
              label="Придумайте пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              icon={<FaLock />}
              error={passwordError}
              helperText="Запомните пароль для входа"
              disabled={submitting}
            />

            <button type="submit" className="auth-button" disabled={submitting}>
              {submitting ? <Spinner size="sm" inline /> : 'Присоединиться к семье'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default InviteRegisterScreen;
