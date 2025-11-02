import React, { useEffect, useState } from 'react';
import './AchievementNotification.css';

function AchievementNotification({ achievement, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className={`achievement-notification ${visible ? 'visible' : ''}`}>
      <div className="achievement-notification-icon">{achievement.icon}</div>
      <div className="achievement-notification-content">
        <div className="achievement-notification-title">🎉 Достижение разблокировано!</div>
        <div className="achievement-notification-name">{achievement.name}</div>
        <div className="achievement-notification-points">+{achievement.points} очков 🏆</div>
      </div>
    </div>
  );
}

export default AchievementNotification;
