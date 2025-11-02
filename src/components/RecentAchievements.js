import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats } from '../services/gamificationService';
import { FaTrophy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function RecentAchievements() {
  const { currentUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAchievements() {
      if (!currentUser) return;
      const stats = await getUserStats(currentUser.uid);
      setAchievements((stats.achievements || []).slice(-3).reverse());
    }
    loadAchievements();
  }, [currentUser]);

  if (achievements.length === 0) return null;

  return (
    <div className="widget recent-achievements">
      <h3><FaTrophy /> Последние достижения</h3>
      {achievements.map((ach, index) => (
        <div key={index} className="achievement-item" onClick={() => navigate('/achievements')}>
          <span className="achievement-icon">{ach.icon}</span>
          <div>
            <div className="achievement-title">{ach.title}</div>
            <div className="achievement-desc">{ach.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentAchievements;
