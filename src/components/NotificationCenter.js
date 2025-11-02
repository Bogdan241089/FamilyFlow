import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheck } from 'react-icons/fa';
import './NotificationCenter.css';

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('app-notifications') || '[]');
    setNotifications(stored);
    setUnreadCount(stored.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('app-notifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('app-notifications', '[]');
    setUnreadCount(0);
  };

  return (
    <>
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <FaBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Уведомления</h3>
            <div className="header-actions">
              {notifications.length > 0 && (
                <button onClick={clearAll} className="clear-all">Очистить</button>
              )}
              <button onClick={() => setIsOpen(false)}><FaTimes /></button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <FaBell size={48} />
                <p>Нет уведомлений</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notif-icon">{notif.icon}</div>
                  <div className="notif-content">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-time">{notif.time}</div>
                  </div>
                  {!notif.read && <FaCheck className="mark-read" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationCenter;

export function addNotification(notification) {
  const stored = JSON.parse(localStorage.getItem('app-notifications') || '[]');
  const newNotif = {
    id: Date.now(),
    read: false,
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    ...notification
  };
  const updated = [newNotif, ...stored].slice(0, 50);
  localStorage.setItem('app-notifications', JSON.stringify(updated));
}
