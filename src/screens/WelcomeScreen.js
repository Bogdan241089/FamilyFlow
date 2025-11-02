import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomeScreen.css';
import { FaUsers } from 'react-icons/fa';

function WelcomeScreen() {
  return (
    <div className="welcome-container">
      <div className="welcome-illustration">
        <FaUsers size={80} color="#4caf50" />
      </div>
      <h1>FamilyFlow</h1>
      <p>Умный семейный органайзер для совместного планирования, задач и календаря.</p>
      <div className="welcome-actions">
        <Link to="/login" className="welcome-btn">Вход</Link>
        <Link to="/register" className="welcome-btn welcome-btn-secondary">Регистрация</Link>
      </div>
    </div>
  );
}

export default WelcomeScreen;