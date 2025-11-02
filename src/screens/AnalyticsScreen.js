import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
// Analytics functions will be implemented separately
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NavBar from '../components/NavBar';
import ThemeToggle from '../components/ThemeToggle';
import Spinner from '../components/Spinner';
import { FaChartBar, FaTrophy, FaFire } from 'react-icons/fa';
import './AnalyticsScreen.css';

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

function AnalyticsScreen() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [currentUser]);

  async function loadAnalytics() {
    try {
      if (!currentUser) return;
      
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      
      if (familyId) {
        // Placeholder data - implement these functions later
        const familyStats = { total: 0, completed: 0, pending: 0, overdue: 0, byPriority: { high: 0, medium: 0, low: 0 } };
        const weekly = [];
        const leaders = [];
        
        setStats(familyStats);
        setWeeklyData(weekly);
        setLeaderboard(leaders);
      }
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;
  if (!stats) return <div>Нет данных для анализа</div>;

  const priorityData = [
    { name: 'Высокий', value: stats.byPriority.high },
    { name: 'Средний', value: stats.byPriority.medium },
    { name: 'Низкий', value: stats.byPriority.low }
  ];

  const statusData = [
    { name: 'Выполнено', value: stats.completed },
    { name: 'В работе', value: stats.pending },
    { name: 'Просрочено', value: stats.overdue }
  ];

  return (
    <>
      <ThemeToggle />
      <NavBar />
      <div className="analytics-container">
        <h2><FaChartBar /> Аналитика семьи</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e3f2fd' }}>
              <FaChartBar size={30} color="#2196f3" />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Всего задач</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f5e9' }}>
              <FaTrophy size={30} color="#4caf50" />
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Выполнено</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fff3e0' }}>
              <FaFire size={30} color="#ff9800" />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>В работе</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ffebee' }}>
              <FaFire size={30} color="#f44336" />
            </div>
            <div className="stat-info">
              <h3>{stats.overdue}</h3>
              <p>Просрочено</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Прогресс за неделю</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#4caf50" strokeWidth={2} name="Выполнено" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>По приоритету</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>По статусу</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card leaderboard-card">
            <h3><FaTrophy /> Таблица лидеров</h3>
            <div className="leaderboard">
              {leaderboard.map((member, index) => (
                <div key={member.id} className="leader-item">
                  <div className="leader-rank">{index + 1}</div>
                  <div className="leader-info">
                    <strong>{member.name}</strong>
                    <div className="leader-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${member.percentage}%` }}></div>
                      </div>
                      <span>{member.completed}/{member.total}</span>
                    </div>
                  </div>
                  <div className="leader-percentage">{member.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalyticsScreen;
