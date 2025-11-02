import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import FormInput from '../components/FormInput';
import ThemeToggle from '../components/ThemeToggle';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import '../components/Auth.css';

function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setError('');
    
    if (!name || name.length < 2) {
      setNameError('Имя должно быть минимум 2 символа');
      return;
    }
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
      await signup(email, password, name);
      navigate('/home');
      
    } catch (error) {
      console.error('ОШИБКА РЕГИСТРАЦИИ:', error.code);
      console.error('СООБЩЕНИЕ ОШИБКИ:', error.message);

      if (error.code === 'auth/email-already-in-use') {
        setError('Этот email уже зарегистрирован');
      } else if (error.code === 'auth/weak-password') {
        setError('Пароль должен содержать минимум 6 символов');
      } else if (error.code === 'auth/invalid-email') {
        setError('Неверный формат email');
      } else {
        setError('Ошибка регистрации: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemeToggle />
      <div className="auth-container fade-in">
        <div className="auth-card">
          <h2>Регистрация в FamilyFlow</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleRegister}>
            <FormInput
              label="Имя"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              icon={<FaUser />}
              error={nameError}
              disabled={loading}
            />
            
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              icon={<FaEnvelope />}
              error={emailError}
              disabled={loading}
            />
            
            <FormInput
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              icon={<FaLock />}
              error={passwordError}
              helperText="Используйте буквы, цифры и спецсимволы"
              disabled={loading}
            />
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Spinner size="sm" inline /> : 'Зарегистрироваться'}
          </button>
        </form>
        
          <p className="auth-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterScreen;