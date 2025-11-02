import React, { useState, useEffect } from 'react';
import { FaChartLine, FaClock, FaFire, FaTrophy } from 'react-icons/fa';
import './UserStats.css';

function UserStats() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    streak: 0,
    tasksCompleted: 0
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user-stats') || '{}');
    const lastVisit = localStorage.getItem('last-visit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      const newStreak = lastVisit === new Date(Date.now() - 86400000).toDateString() 
        ? (stored.streak || 0) + 1 
        : 1;
      
      const updated = {
        ...stored,
        totalSessions: (stored.totalSessions || 0) + 1,
        streak: newStreak
      };
      
      setStats(updated);
      localStorage.setItem('user-stats', JSON.stringify(updated));
      localStorage.setItem('last-visit', today);
    } else {
      setStats(stored);
    }
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}ч` : `${minutes}м`;
  };

  return (
    <div className="user-stats-widget">
      <h3><FaChartLine /> Ваша статистика</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <FaClock />
          <div>
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Сессий</div>
          </div>
        </div>
        <div className="stat-item">
          <FaFire />
          <div>
            <div className="stat-value">{stats.streak}</div>
            <div className="stat-label">Дней подряд</div>
          </div>
        </div>
        <div className="stat-item">
          <FaTrophy />
          <div>
            <div className="stat-value">{stats.tasksCompleted || 0}</div>
            <div className="stat-label">Задач</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
