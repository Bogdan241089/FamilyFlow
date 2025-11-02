import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './HomeScreen.css';
import { FaTasks, FaRegCalendarAlt, FaShoppingCart, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import ThemeToggle from '../components/ThemeToggle';
import NavBar from '../components/NavBar';
import NotificationPrompt from '../components/NotificationPrompt';
import InstallPrompt from '../components/InstallPrompt';
import GlobalSearch from '../components/GlobalSearch';
import { getUserStats, getLevel } from '../services/gamificationService';
import UpcomingTasks from '../components/UpcomingTasks';
import RecentAchievements from '../components/RecentAchievements';
import ThemeSelector from '../components/ThemeSelector';
import LanguageToggle from '../components/LanguageToggle';
import QuickActions from '../components/QuickActions';
import NotificationCenter from '../components/NotificationCenter';
import UserStats from '../components/UserStats';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import WelcomeTour from '../components/WelcomeTour';

function HomeScreen() {
  const { currentUser } = useAuth();
  const [role, setRole] = useState('parent');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, done: 0, myTasks: 0 });
  const [userStats, setUserStats] = useState(null);
  useKeyboardShortcuts();

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentUser) {
          const profile = await getProfile(currentUser.uid);
          setRole(profile?.role || 'parent');
          const gamificationStats = await getUserStats(currentUser.uid);
          setUserStats(gamificationStats);
          const familyId = profile?.defaultFamilyId;
          if (familyId) {
          const tasksSnap = await getDocs(collection(db, `families/${familyId}/tasks`));
          const total = tasksSnap.size;
          let done = 0;
          let myTasks = 0;
          tasksSnap.forEach(doc => {
            const task = doc.data();
            if (task.done) done++;
            if (task.assignee === currentUser.uid || task.responsible === currentUser.uid) myTasks++;
          });
          setStats({ total, done, myTasks });
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  if (loading) return <div className="home-container"><Spinner /></div>;

  const currentLevel = userStats ? getLevel(userStats.points) : null;

  return (
    <>
      <ThemeToggle />
      <ThemeSelector />
      <LanguageToggle />
      <QuickActions />
      <NotificationCenter />
      
      <WelcomeTour />
      <NavBar />
      <NotificationPrompt />
      <InstallPrompt />
      <div className="home-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <GlobalSearch />
      </div>
      <h2>Главная страница FamilyFlow</h2>
      <p>Добро пожаловать! Здесь появятся ваши семейные задачи, календарь и списки.</p>
      {userStats && currentLevel && (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{currentLevel.icon}</div>
          <h3 style={{ margin: '0.3rem 0' }}>{currentLevel.name} - Уровень {currentLevel.level}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '1.1rem' }}>
            <span>🏆 {userStats.points} очков</span>
            <span>🔥 {userStats.streak} дней</span>
            <span>🏅 {userStats.achievements?.length || 0} достижений</span>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ background: '#e3f2fd', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <FaTasks size={40} color="#2196f3" />
          <h3 style={{ margin: '0.5rem 0' }}>{stats.total}</h3>
          <p style={{ margin: 0, color: '#666' }}>Всего задач</p>
        </div>
        <div style={{ background: '#e8f5e9', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <FaCheckCircle size={40} color="#4caf50" />
          <h3 style={{ margin: '0.5rem 0' }}>{stats.done}</h3>
          <p style={{ margin: 0, color: '#666' }}>Выполнено</p>
        </div>
        <div style={{ background: '#fff3e0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <FaTasks size={40} color="#ff9800" />
          <h3 style={{ margin: '0.5rem 0' }}>{stats.myTasks}</h3>
          <p style={{ margin: 0, color: '#666' }}>Мои задачи</p>
        </div>
      </div>
      <UserStats />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <UpcomingTasks />
        <RecentAchievements />
      </div>
      <nav style={{ fontSize: '1.2rem', marginTop: '2rem' }}>
        <Link to="/tasks"><FaTasks style={{ verticalAlign: 'middle', color: '#4caf50' }}/> Задачи</Link> |{' '}
        <Link to="/calendar"><FaRegCalendarAlt style={{ verticalAlign: 'middle', color: '#4caf50' }}/> Календарь</Link> |{' '}
        <Link to="/shopping"><FaShoppingCart style={{ verticalAlign: 'middle', color: '#4caf50' }}/> Список покупок</Link>
      </nav>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/family" style={{ background: '#4caf50', color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none' }}>
          Управление семьёй
        </Link>
      </div>
    </div>
    </>
  );
}

export default HomeScreen;
