import React, { useState, useEffect } from 'react';
import { requestNotificationPermission } from '../services/notificationService';
import { FaBell, FaTimes } from 'react-icons/fa';
import './NotificationPrompt.css';

function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => setShow(true), 3000);
    }
  }, []);

  const handleEnable = () => {
    requestNotificationPermission();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="notification-prompt fade-in">
      <button className="close-btn" onClick={() => setShow(false)}>
        <FaTimes />
      </button>
      <div className="prompt-icon">
        <FaBell size={40} />
      </div>
      <h3>Включить уведомления?</h3>
      <p>Получайте напоминания о задачах и событиях семьи</p>
      <div className="prompt-actions">
        <button onClick={handleEnable} className="enable-btn">
          Включить
        </button>
        <button onClick={() => setShow(false)} className="later-btn">
          Позже
        </button>
      </div>
    </div>
  );
}

export default NotificationPrompt;
