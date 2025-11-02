import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import '../components/Auth.css';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Ошибка входа:', error);
      
      let errorMessage = 'Произошла ошибка при входе';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Некорректный email';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Пользователь не найден';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Неверный пароль';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Слишком много попыток. Попробуйте позже';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Вход в FamilyFlow</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Spinner size="sm" inline /> : 'Войти'}
          </button>
        </form>
        
        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
