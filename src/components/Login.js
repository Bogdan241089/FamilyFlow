import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getProfile, saveProfile } from '../services/profileService';
import FormInput from './FormInput';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');
    
    if (!email) {
      setEmailError('Email обязателен');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Введите корректный email');
      return;
    }
    if (!password) {
      setPasswordError('Пароль обязателен');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profile = await getProfile(user.uid);
      if (!profile) {
        await saveProfile(user.uid, {
          email: user.email,
          name: user.email.split('@')[0],
          role: 'parent',
          createdAt: new Date().toISOString()
        });
      }
      navigate('/main');
    } catch (error) {
      console.error('Ошибка входа:', error.code);
      
      if (error.code === 'auth/user-not-found') {
        setError('Пользователь не найден');
      } else if (error.code === 'auth/wrong-password') {
        setError('Неверный пароль');
      } else {
        setError('Ошибка входа: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemeToggle />
      <div style={styles.container} className="fade-in">
        <div style={styles.form}>
          <h2 style={styles.title}>Вход в FamilyFlow</h2>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleLogin}>
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              icon={<FaEnvelope />}
              error={emailError}
              helperText="Введите ваш email адрес"
            />
            
            <FormInput
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              icon={<FaLock />}
              error={passwordError}
            />
          
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
          </form>
          
          <div style={styles.links}>
            <p>Нет аккаунта? <Link to="/register" style={styles.link}>Зарегистрироваться</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px'
  },
  form: {
    background: 'var(--bg-primary)',
    padding: '40px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '420px'
  },
  title: {
    color: 'var(--text-primary)',
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '1.8rem'
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  buttonDisabled: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--text-secondary)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '1rem',
    opacity: 0.6
  },
  error: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: 'var(--danger)',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '20px',
    border: '1px solid var(--danger)',
    fontSize: '0.9rem'
  },
  links: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'var(--text-secondary)'
  },
  link: {
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Login;