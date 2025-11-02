import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { getUserStats, ACHIEVEMENTS, getLevel, getNextLevel } from '../services/gamificationService';
import { CHALLENGES, getActiveChallenges, createChallenge } from '../services/challengeService';
import ChallengeCard from '../components/ChallengeCard';
import Spinner from '../components/Spinner';
import './AchievementsScreen.css';

function AchievementsScreen() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (currentUser) {
          const userStats = await getUserStats(currentUser.uid);
          setStats(userStats);
          
          const profile = await getProfile(currentUser.uid);
          if (profile?.defaultFamilyId) {
            const activeChallenges = await getActiveChallenges(profile.defaultFamilyId);
            setChallenges(activeChallenges);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ points: 0, tasksCompleted: 0, streak: 0, achievements: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [currentUser]);

  async function handleAcceptChallenge(challengeId) {
    try {
      const profile = await getProfile(currentUser.uid);
      if (profile?.defaultFamilyId) {
        await createChallenge(profile.defaultFamilyId, challengeId);
        const activeChallenges = await getActiveChallenges(profile.defaultFamilyId);
        setChallenges(activeChallenges);
        setToast({ message: 'Вызов принят!', type: 'success' });
      }
    } catch (error) {
      console.error('Error accepting challenge:', error);
      setToast({ message: 'Ошибка принятия вызова', type: 'error' });
    }
  }

  if (loading) return <Spinner />;
  if (!stats) return <div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка данных...</div>;

  const currentLevel = getLevel(stats.points);
  const nextLevel = getNextLevel(stats.points);
  const progress = nextLevel ? ((stats.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

  return (
    <div className="achievements-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="level-card">
        <div className="level-icon">{currentLevel.icon}</div>
        <h2>Уровень {currentLevel.level}: {currentLevel.name}</h2>
        <h3>🏆 {stats.points} очков</h3>
        {nextLevel && (
          <>
            <p>До уровня {nextLevel.level} ({nextLevel.name}): {nextLevel.minPoints - stats.points} очков</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                {Math.round(progress)}%
              </div>
            </div>
          </>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.tasksCompleted || 0}</div>
          <div className="stat-label">Задач выполнено</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.streak || 0} 🔥</div>
          <div className="stat-label">Дней подряд</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.achievements?.length || 0}</div>
          <div className="stat-label">Достижений</div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>🎯 Вызовы</h2>
      <div className="challenges-grid">
        {CHALLENGES.map(challenge => {
          const activeChallenge = challenges.find(c => c.id === challenge.id);
          return (
            <ChallengeCard 
              key={challenge.id} 
              challenge={activeChallenge || challenge}
              onAccept={!activeChallenge ? handleAcceptChallenge : null}
            />
          );
        })}
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>🏅 Достижения</h2>
      <div className="achievements-grid">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = stats.achievements?.includes(ach.id);
          let progressText = '';
          
          if (ach.id.startsWith('task_')) {
            progressText = `${stats.tasksCompleted}/${ach.requirement}`;
          } else if (ach.id.startsWith('streak_')) {
            progressText = `${stats.streak}/${ach.requirement}`;
          }

          return (
            <div key={ach.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              {isUnlocked && <div className="achievement-badge">+{ach.points} 🏆</div>}
              <div className="achievement-icon">{ach.icon}</div>
              <h3>{ach.name}</h3>
              <p>{ach.desc}</p>
              {!isUnlocked && progressText && (
                <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                  Прогресс: {progressText}
                </div>
              )}
              {isUnlocked && (
                <div style={{ color: '#4caf50', fontWeight: 'bold', marginTop: '0.5rem' }}>✓ Получено</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementsScreen;
