import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Простая локальная авторизация
const LocalAuth = {
  users: JSON.parse(localStorage.getItem('familyflow_users') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('familyflow_current_user') || 'null'),
  
  register(email, password, name) {
    // Если email не указан, генерируем уникальный ID
    const userEmail = email || `user_${Date.now()}@familyflow.local`;
    
    if (this.users.find(u => u.email === userEmail)) {
      throw new Error('Пользователь уже существует');
    }
    const user = { id: Date.now(), email: userEmail, password, name, isGuest: !email };
    this.users.push(user);
    localStorage.setItem('familyflow_users', JSON.stringify(this.users));
    this.login(userEmail, password);
    return user;
  },
  
  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }
    this.currentUser = user;
    localStorage.setItem('familyflow_current_user', JSON.stringify(user));
    return user;
  },
  
  logout() {
    this.currentUser = null;
    localStorage.removeItem('familyflow_current_user');
  }
};

function WelcomePage() {
  const [inviteInfo, setInviteInfo] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get('invite');
    const familyName = urlParams.get('family');
    const role = urlParams.get('role');
    
    if (inviteId && familyName) {
      setInviteInfo({ inviteId, familyName, role });
    }
  }, []);
  
  return (
    <div className="page" style={{padding: '60px 20px', textAlign: 'center'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '10px'}}>🏠 FamilyFlow</h1>
      <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px'}}>
        Умный семейный органайзер
      </p>
      
      {inviteInfo && (
        <div style={{background: 'var(--success)', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px'}}>
          <h3>🎉 Вас приглашают в семью!</h3>
          <p>Семья: <strong>{decodeURIComponent(inviteInfo.familyName)}</strong></p>
          <p>Роль: <strong>
            {inviteInfo.role === 'parent' ? '👨 Родитель' : 
             inviteInfo.role === 'grandparent' ? '👴 Бабушка/Дедушка' : '👶 Ребёнок'}
          </strong></p>
          <p style={{fontSize: '14px', opacity: 0.9}}>Зарегистрируйтесь или войдите, чтобы присоединиться</p>
        </div>
      )}
      
      <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
        <Link to="/login" className="btn btn-primary" style={{width: 'auto', minWidth: '150px'}}>
          Вход
        </Link>
        <Link to="/register" className="btn btn-secondary" style={{width: 'auto', minWidth: '150px'}}>
          Регистрация
        </Link>
      </div>
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      LocalAuth.login(email, password);
      window.location.reload();
    } catch (error) {
      alert('Ошибка входа: ' + error.message);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2 className="text-center mb-20">Вход в FamilyFlow</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Пароль" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Войти</button>
          <div className="text-center mt-20">
            <Link to="/" className="link">← Назад</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteInfo, setInviteInfo] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get('invite');
    const familyName = urlParams.get('family');
    const role = urlParams.get('role');
    
    if (inviteId && familyName) {
      setInviteInfo({ inviteId, familyName, role });
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      LocalAuth.register(email, password, name);
      
      if (inviteInfo) {
        // Сохраняем информацию о приглашении
        localStorage.setItem('familyflow_pending_invite', JSON.stringify(inviteInfo));
      }
      
      window.location.reload();
    } catch (error) {
      alert('Ошибка регистрации: ' + error.message);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2 className="text-center mb-20">Регистрация</h2>
        
        {inviteInfo && (
          <div style={{background: 'var(--success)', color: 'white', padding: '15px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center'}}>
            <div style={{fontWeight: 'bold'}}>🎉 Приглашение в семью</div>
            <div style={{fontSize: '14px'}}>{decodeURIComponent(inviteInfo.familyName)}</div>
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Имя" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email (необязательно)" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Пароль" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary">Зарегистрироваться</button>
          <div className="text-center mt-20">
            <Link to="/" className="link">← Назад</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Проверяем отложенное приглашение
    const pendingInvite = localStorage.getItem('familyflow_pending_invite');
    if (pendingInvite) {
      const inviteInfo = JSON.parse(pendingInvite);
      const currentUser = LocalAuth.currentUser;
      
      // Присоединяем к семье
      localStorage.setItem('familyflow_family_name', decodeURIComponent(inviteInfo.familyName));
      const members = JSON.parse(localStorage.getItem('familyflow_members') || '[]');
      
      // Обновляем статус существующего участника или добавляем нового
      const existingMemberIndex = members.findIndex(m => m.id == inviteInfo.inviteId);
      
      if (existingMemberIndex !== -1) {
        // Обновляем существующего участника
        members[existingMemberIndex] = {
          ...members[existingMemberIndex],
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          status: 'active',
          joinedAt: new Date().toISOString()
        };
      } else {
        // Добавляем нового участника
        const newMember = {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: inviteInfo.role,
          joinedAt: new Date().toISOString(),
          status: 'active'
        };
        members.push(newMember);
      }
      
      localStorage.setItem('familyflow_members', JSON.stringify(members));
      localStorage.removeItem('familyflow_pending_invite');
      
      alert(`🎉 Вы успешно присоединились к семье "${decodeURIComponent(inviteInfo.familyName)}"!`);
    }
  }, []);

  useEffect(() => {
    // Получаем геолокацию и погоду
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          
          try {
            // Бесплатный API погоды
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
            const data = await response.json();
            setWeather({
              temperature: Math.round(data.current_weather.temperature),
              windspeed: data.current_weather.windspeed,
              weathercode: data.current_weather.weathercode
            });
          } catch (error) {
            console.log('Ошибка получения погоды:', error);
          }
        },
        (error) => {
          console.log('Ошибка геолокации:', error);
        }
      );
    }
  }, []);

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️'; // Ясно
    if (code <= 3) return '⛅'; // Облачно
    if (code <= 67) return '🌧️'; // Дождь
    if (code <= 77) return '❄️'; // Снег
    return '🌤️'; // Переменная облачность
  };

  const handleLogout = () => {
    LocalAuth.logout();
    window.location.reload();
  };

  const exportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('familyflow_tasks') || '[]'),
      messages: JSON.parse(localStorage.getItem('familyflow_messages') || '[]'),
      events: JSON.parse(localStorage.getItem('familyflow_events') || '[]'),
      achievements: JSON.parse(localStorage.getItem('familyflow_achievements') || '[]'),
      users: JSON.parse(localStorage.getItem('familyflow_users') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (confirm('Импортировать данные? Текущие данные будут заменены.')) {
              Object.keys(data).forEach(key => {
                if (key !== 'exportDate') {
                  localStorage.setItem(`familyflow_${key}`, JSON.stringify(data[key]));
                }
              });
              window.location.reload();
            }
          } catch (error) {
            alert('Ошибка импорта: неверный формат файла');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (confirm('Удалить все данные? Это действие нельзя отменить!')) {
      ['tasks', 'messages', 'events', 'achievements', 'users', 'current_user'].forEach(key => {
        localStorage.removeItem(`familyflow_${key}`);
      });
      window.location.reload();
    }
  };

  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <div>
          <h1>🏠 FamilyFlow Dashboard</h1>
          <p style={{margin: '5px 0 0 0', color: 'var(--text-secondary)'}}>
            Добро пожаловать, {LocalAuth.currentUser?.name || LocalAuth.currentUser?.email}!
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">Выйти</button>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
        <Link to="/tasks" className="card" style={{textDecoration: 'none', color: 'inherit'}}>
          <h3>📋 Задачи</h3>
          <p>Управление семейными задачами</p>
        </Link>
        <Link to="/calendar" className="card" style={{textDecoration: 'none', color: 'inherit'}}>
          <h3>📅 Календарь</h3>
          <p>Планирование событий</p>
        </Link>
        <Link to="/chat" className="card" style={{textDecoration: 'none', color: 'inherit'}}>
          <h3>💬 Чат</h3>
          <p>Общение семьи</p>
        </Link>
        <Link to="/analytics" className="card" style={{textDecoration: 'none', color: 'inherit'}}>
          <h3>📊 Аналитика</h3>
          <p>Статистика и прогресс</p>
        </Link>
        <Link to="/ai-assistant" className="card" style={{textDecoration: 'none', color: 'inherit'}}>
          <h3>🤖 AI Помощник</h3>
          <p>Умный помощник для задач</p>
        </Link>
        <Link to="/family" className="card" style={{textDecoration: 'none', color: 'inherit'}}>
          <h3>👨‍👩‍👧‍👦 Семья</h3>
          <p>Управление семьёй</p>
        </Link>
      </div>
      
      {/* Виджеты */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px'}}>
        {/* Погода */}
        <div className="card" style={{textAlign: 'center'}}>
          <h3>🌤️ Погода</h3>
          {weather ? (
            <>
              <div style={{fontSize: '2rem'}}>{getWeatherIcon(weather.weathercode)}</div>
              <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{weather.temperature}°C</div>
              <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Ветер: {weather.windspeed} км/ч</div>
            </>
          ) : (
            <div style={{color: 'var(--text-secondary)'}}>Загрузка...</div>
          )}
        </div>
        
        {/* Быстрая статистика */}
        <div className="card" style={{textAlign: 'center'}}>
          <h3>📊 Статистика</h3>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
            {JSON.parse(localStorage.getItem('familyflow_tasks') || '[]').filter(t => t.completed).length}
          </div>
          <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>выполнено задач</div>
        </div>
        
        {/* Сегодняшние задачи */}
        <div className="card" style={{textAlign: 'center'}}>
          <h3>🗓️ Сегодня</h3>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
            {JSON.parse(localStorage.getItem('familyflow_tasks') || '[]')
              .filter(t => !t.completed && (!t.startDate || new Date(t.startDate) <= new Date())).length}
          </div>
          <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>активных задач</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card" style={{marginTop: '20px'}}>
        <h3 style={{marginBottom: '15px'}}>⚡ Быстрые действия</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button onClick={exportData} className="btn btn-secondary" style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}>
            📤 Экспорт данных
          </button>
          <button onClick={importData} className="btn btn-secondary" style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}>
            📥 Импорт данных
          </button>
          <button onClick={clearAllData} className="btn btn-secondary" style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}>
            🗑️ Очистить всё
          </button>
        </div>
      </div>
    </div>
  );
}

function TasksPage() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('familyflow_tasks') || '[]'));
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hasTimeRange, setHasTimeRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasDateRange, setHasDateRange] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'ru-RU';
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewTask(transcript);
        setIsListening(false);
      };
      
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      
      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      alert('Голосовой ввод не поддерживается в вашем браузере');
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    if (editingTask) {
      // Редактирование существующей задачи
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? {
          ...task,
          text: newTask,
          priority: newPriority,
          startTime: hasTimeRange ? startTime : '',
          endTime: hasTimeRange ? endTime : '',
          hasTimeRange,
          startDate: hasDateRange ? startDate : '',
          endDate: hasDateRange ? endDate : '',
          hasDateRange
        } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('familyflow_tasks', JSON.stringify(updatedTasks));
      setEditingTask(null);
    } else {
      // Создание новой задачи
      const task = { 
        id: Date.now(), 
        text: newTask, 
        completed: false,
        priority: newPriority,
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        startTime: hasTimeRange ? startTime : '',
        endTime: hasTimeRange ? endTime : '',
        hasTimeRange,
        startDate: hasDateRange ? startDate : '',
        endDate: hasDateRange ? endDate : '',
        hasDateRange
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      localStorage.setItem('familyflow_tasks', JSON.stringify(updatedTasks));
    }
    
    // Очистка формы
    setNewTask('');
    setStartTime('');
    setEndTime('');
    setHasTimeRange(false);
    setStartDate('');
    setEndDate('');
    setHasDateRange(false);
  };

  const editTask = (task) => {
    setNewTask(task.text);
    setNewPriority(task.priority);
    setStartTime(task.startTime || '');
    setEndTime(task.endTime || '');
    setHasTimeRange(task.hasTimeRange || false);
    setStartDate(task.startDate || '');
    setEndDate(task.endDate || '');
    setHasDateRange(task.hasDateRange || false);
    setEditingTask(task);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask('');
    setStartTime('');
    setEndTime('');
    setHasTimeRange(false);
    setStartDate('');
    setEndDate('');
    setHasDateRange(false);
  };

  const deleteTask = (id) => {
    if (confirm('Удалить задачу?')) {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('familyflow_tasks', JSON.stringify(updatedTasks));
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('familyflow_tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>📋 Задачи</h1>
        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
      </div>
      
      <form onSubmit={addTask} style={{marginBottom: '30px'}}>
        <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
          <input 
            type="text" 
            placeholder="Новая задача..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="form-input"
            style={{flex: 1}}
          />
          <select 
            value={newPriority} 
            onChange={(e) => setNewPriority(e.target.value)}
            className="form-input"
            style={{width: '120px'}}
          >
            <option value="high">🔴 Высокий</option>
            <option value="medium">🟡 Средний</option>
            <option value="low">🟢 Низкий</option>
          </select>
          <button 
            type="button" 
            onClick={startListening}
            className="btn btn-secondary"
            style={{width: 'auto', padding: '12px 16px', background: isListening ? 'var(--error)' : 'var(--secondary)'}}
            disabled={isListening}
          >
            {isListening ? '🔴 Слушаю...' : '🎤'}
          </button>
          <button type="submit" className="btn btn-primary" style={{width: 'auto', padding: '12px 20px'}}>
            {editingTask ? 'Сохранить' : 'Добавить'}
          </button>
          {editingTask && (
            <button type="button" onClick={cancelEdit} className="btn btn-secondary" style={{width: 'auto', padding: '12px 20px'}}>
              Отмена
            </button>
          )}
        </div>
        
        {/* Даты */}
        <div style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            <input 
              type="checkbox" 
              checked={hasDateRange}
              onChange={(e) => setHasDateRange(e.target.checked)}
            />
            📅 Указать даты
          </label>
          
          {hasDateRange && (
            <>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
                style={{width: '150px'}}
              />
              <span>—</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
                style={{width: '150px'}}
              />
            </>
          )}
        </div>
        
        {/* Время */}
        <div style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            <input 
              type="checkbox" 
              checked={hasTimeRange}
              onChange={(e) => setHasTimeRange(e.target.checked)}
            />
            🕰️ Указать время
          </label>
          
          {hasTimeRange && (
            <>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-input"
                style={{width: '120px'}}
              />
              <span>—</span>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-input"
                style={{width: '120px'}}
              />
            </>
          )}
        </div>
        
        <div style={{display: 'flex', gap: '10px'}}>
          <button type="button" onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}>
            Все
          </button>
          <button type="button" onClick={() => setFilter('active')} 
            className={filter === 'active' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}>
            Активные
          </button>
          <button type="button" onClick={() => setFilter('completed')} 
            className={filter === 'completed' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}>
            Выполненные
          </button>
        </div>
      </form>

      <div style={{display: 'grid', gap: '10px'}}>
        {tasks
          .filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
          })
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
          })
          .map(task => (
          <div key={task.id} className={`card priority-${task.priority || 'medium'}`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              style={{width: '20px', height: '20px'}}
            />
            <div style={{flex: 1}}>
              <div style={{textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1}}>
                {task.text}
              </div>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px', flexWrap: 'wrap'}}>
                <small style={{color: 'var(--text-secondary)'}}>{task.date}</small>
                
                {task.hasDateRange && task.startDate && (
                  <span style={{fontSize: '12px', padding: '2px 6px', borderRadius: '4px', 
                    background: 'var(--secondary)', color: 'white'}}>
                    📅 {new Date(task.startDate).toLocaleDateString()}{task.endDate && task.endDate !== task.startDate ? ` - ${new Date(task.endDate).toLocaleDateString()}` : ''}
                  </span>
                )}
                
                {task.hasTimeRange && task.startTime && (
                  <span style={{fontSize: '12px', padding: '2px 6px', borderRadius: '4px', 
                    background: 'var(--primary)', color: 'white'}}>
                    🕰️ {task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}
                  </span>
                )}
                
                {task.priority && (
                  <span style={{fontSize: '12px', padding: '2px 6px', borderRadius: '4px', 
                    background: task.priority === 'high' ? 'var(--error)' : 
                               task.priority === 'medium' ? 'var(--warning)' : 'var(--success)',
                    color: 'white'}}>
                    {task.priority === 'high' ? 'Высокий' : 
                     task.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Кнопки действий */}
            <div style={{display: 'flex', gap: '5px'}}>
              <button 
                onClick={() => editTask(task)}
                className="btn btn-secondary"
                style={{width: 'auto', padding: '5px 10px', fontSize: '12px'}}
                title="Редактировать"
              >
                ✏️
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="btn btn-secondary"
                style={{width: 'auto', padding: '5px 10px', fontSize: '12px', background: 'var(--error)'}}
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
          }).length === 0 && (
          <div className="card" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
            Пока нет задач. Добавьте первую!
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarPage() {
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem('familyflow_events') || '[]'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventLocation, setEventLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  const tasks = JSON.parse(localStorage.getItem('familyflow_tasks') || '[]');
  
  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.trim()) return;
    
    const event = {
      id: Date.now(),
      title: newEvent,
      date: selectedDate.toDateString(),
      type: 'event',
      location: eventLocation
    };
    
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          event.coordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          const updatedEvents = [...events, event];
          setEvents(updatedEvents);
          localStorage.setItem('familyflow_events', JSON.stringify(updatedEvents));
        },
        () => {
          // Если не удалось получить координаты
          const updatedEvents = [...events, event];
          setEvents(updatedEvents);
          localStorage.setItem('familyflow_events', JSON.stringify(updatedEvents));
        }
      );
    } else {
      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      localStorage.setItem('familyflow_events', JSON.stringify(updatedEvents));
    }
    
    setNewEvent('');
    setEventLocation('');
    setUseCurrentLocation(false);
    setShowAddEvent(false);
  };
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return [
      ...events.filter(e => e.date === dateStr),
      ...tasks.filter(t => t.createdAt && new Date(t.createdAt).toDateString() === dateStr).map(t => ({...t, type: 'task'}))
    ];
  };
  
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>📅 Календарь</h1>
        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
      </div>
      
      <div className="card" style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <button 
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            className="btn btn-secondary" style={{width: 'auto', padding: '8px 12px'}}
          >←</button>
          
          <h3>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
          
          <button 
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            className="btn btn-secondary" style={{width: 'auto', padding: '8px 12px'}}
          >→</button>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '20px'}}>
          {dayNames.map(day => (
            <div key={day} style={{padding: '10px', textAlign: 'center', fontWeight: 'bold', background: 'var(--bg-secondary)'}}>
              {day}
            </div>
          ))}
          
          {getDaysInMonth(selectedDate).map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day && day.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index} 
                style={{
                  minHeight: '80px',
                  padding: '5px',
                  background: day ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                  border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                  cursor: day ? 'pointer' : 'default',
                  opacity: day ? 1 : 0.3
                }}
                onClick={() => day && (setSelectedDate(day), setShowAddEvent(true))}
              >
                {day && (
                  <>
                    <div style={{fontWeight: isToday ? 'bold' : 'normal', color: isToday ? 'var(--primary)' : 'inherit'}}>
                      {day.getDate()}
                    </div>
                    {dayEvents.slice(0, 2).map((event, i) => (
                      <div key={i} style={{
                        fontSize: '10px',
                        padding: '2px 4px',
                        margin: '2px 0',
                        borderRadius: '3px',
                        background: event.type === 'task' ? 'var(--warning)' : 'var(--primary)',
                        color: 'white',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {event.type === 'task' ? '📋' : '📅'} {event.title || event.text}
                        {event.location && <div style={{fontSize: '9px'}}>📍 {event.location}</div>}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{fontSize: '10px', color: 'var(--text-secondary)'}}>+{dayEvents.length - 2}</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={() => setShowAddEvent(true)}
          className="btn btn-primary"
          style={{width: 'auto', padding: '10px 20px'}}
        >
          + Добавить событие
        </button>
      </div>
      
      {showAddEvent && (
        <div className="search-overlay" onClick={() => setShowAddEvent(false)}>
          <div className="search-box" onClick={e => e.stopPropagation()}>
            <h3>Добавить событие</h3>
            <p>Дата: {selectedDate.toLocaleDateString()}</p>
            <form onSubmit={addEvent}>
              <input
                type="text"
                placeholder="Название события..."
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                className="form-input"
                autoFocus
                style={{marginBottom: '10px'}}
              />
              <input
                type="text"
                placeholder="Место (необязательно)..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="form-input"
                style={{marginBottom: '10px'}}
              />
              <label style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px'}}>
                <input 
                  type="checkbox" 
                  checked={useCurrentLocation}
                  onChange={(e) => setUseCurrentLocation(e.target.checked)}
                />
                📍 Использовать текущее местоположение
              </label>
              <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Добавить</button>
                <button type="button" onClick={() => setShowAddEvent(false)} className="btn btn-secondary" style={{flex: 1}}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('familyflow_messages') || '[]'));
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      text: newMessage,
      author: LocalAuth.currentUser?.name || LocalAuth.currentUser?.email,
      time: new Date().toLocaleTimeString()
    };
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('familyflow_messages', JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>💬 Чат семьи</h1>
        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
      </div>
      
      <div className="card" style={{height: '400px', display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: 1, overflowY: 'auto', padding: '10px', borderBottom: '1px solid var(--border)'}}>
          {messages.map(msg => (
            <div key={msg.id} style={{marginBottom: '15px'}}>
              <div style={{fontWeight: 'bold', fontSize: '14px'}}>{msg.author}</div>
              <div>{msg.text}</div>
              <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{msg.time}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <div style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px'}}>
              Начните общение с семьёй!
            </div>
          )}
        </div>
        
        <form onSubmit={sendMessage} style={{display: 'flex', gap: '10px', padding: '15px'}}>
          <input 
            type="text" 
            placeholder="Напишите сообщение..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-input"
            style={{flex: 1, margin: 0}}
          />
          <button type="submit" className="btn btn-primary" style={{width: 'auto', padding: '12px 20px'}}>
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}

// Achievements System
const ACHIEVEMENTS = [
  { id: 'first_task', name: 'Первая задача', icon: '🎆', desc: 'Создайте первую задачу', check: (data) => data.totalTasks >= 1 },
  { id: 'task_master', name: 'Мастер задач', icon: '🏆', desc: 'Выполните 10 задач', check: (data) => data.completedTasks >= 10 },
  { id: 'chat_starter', name: 'Общительный', icon: '💬', desc: 'Отправьте 5 сообщений', check: (data) => data.messages >= 5 },
  { id: 'perfectionist', name: 'Перфекционист', icon: '✨', desc: '100% выполнение', check: (data) => data.totalTasks > 0 && data.progress === 100 },
  { id: 'priority_master', name: 'Мастер приоритетов', icon: '🎯', desc: 'Создайте задачи с разными приоритетами', check: (data) => data.priorityTypes >= 3 }
];

function checkAchievements(data) {
  const unlocked = JSON.parse(localStorage.getItem('familyflow_achievements') || '[]');
  const newUnlocked = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    if (!unlocked.includes(achievement.id) && achievement.check(data)) {
      unlocked.push(achievement.id);
      newUnlocked.push(achievement);
    }
  });
  
  localStorage.setItem('familyflow_achievements', JSON.stringify(unlocked));
  return newUnlocked;
}

function AIAssistantPage() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const askAI = async (prompt) => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        setResponse('⚠️ Нужно настроить API ключ Gemini AI в .env файле');
        setLoading(false);
        return;
      }

      console.log('Отправляем запрос к Gemini API...');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Ты - помощник для семейного органайзера FamilyFlow. Отвечай коротко и полезно на русском языке. Вопрос: ${prompt}`
            }]
          }]
        })
      });

      console.log('Ответ от API:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка API:', errorText);
        setResponse(`Ошибка API (${response.status}): ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Данные от API:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setResponse(`Ошибка Gemini: ${data.error.message}`);
      } else {
        setResponse('Неожиданный формат ответа от API');
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
      
      // Если API не работает, показываем локальные советы
      const localTips = {
        'Как организовать семейные задачи?': '📋 Советы по организации:\n\n1. Используйте приоритеты: высокий для срочных дел\n2. Разбивайте большие задачи на маленькие\n3. Назначайте ответственных\n4. Устанавливайте сроки выполнения',
        'Посоветуй задачи на неделю': '🗓️ План на неделю:\n\nПонедельник: Планирование недели\nВторник: Покупки и закупки\nСреда: Уборка дома\nЧетверг: Семейные дела\nПятница: Подготовка к выходным\nСуббота: Отдых и развлечения\nВоскресенье: Подведение итогов',
        'Как мотивировать детей выполнять задачи?': '🎆 Мотивация детей:\n\n1. Система поощрений и баллов\n2. Наглядные достижения\n3. Совместное выполнение задач\n4. Похвала за старания\n5. Превращение задач в игру',
        'План уборки дома': '🏠 План уборки:\n\nЕжедневно:\n- Мытьё посуды\n- Уборка кроватей\n- Протирание поверхностей\n\nЕженедельно:\n- Пылесос\n- Мытьё полов\n- Смена постельного белья\n- Уборка ванной'
      };
      
      const localResponse = localTips[prompt] || `🤖 Локальный ответ:\n\nК сожалению, не удалось подключиться к Gemini AI.\n\nПопробуйте одну из быстрых команд выше или проверьте интернет-соединение.`;
      
      setResponse(localResponse);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      askAI(question);
    }
  };

  const quickSuggestions = [
    'Как организовать семейные задачи?',
    'Посоветуй задачи на неделю',
    'Как мотивировать детей выполнять задачи?',
    'План уборки дома'
  ];

  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>🤖 AI Помощник</h1>
        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
      </div>
      
      <div className="card" style={{marginBottom: '20px'}}>
        <h3>Задайте вопрос</h3>
        <form onSubmit={handleSubmit} style={{marginBottom: '15px'}}>
          <div style={{display: 'flex', gap: '10px'}}>
            <input
              type="text"
              placeholder="Например: Как организовать семейные задачи?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="form-input"
              style={{flex: 1}}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{width: 'auto', padding: '12px 20px'}}>
              {loading ? 'Обработка...' : 'Спросить'}
            </button>
          </div>
        </form>
        
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          {quickSuggestions.map((suggestion, i) => (
            <button 
              key={i}
              onClick={() => {setQuestion(suggestion); askAI(suggestion);}}
              className="btn btn-secondary"
              style={{width: 'auto', padding: '8px 12px', fontSize: '14px'}}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      {response && (
        <div className="card">
          <h3>Ответ AI</h3>
          <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
}

function FamilyPage() {
  const [familyName, setFamilyName] = useState(localStorage.getItem('familyflow_family_name') || '');
  const [members, setMembers] = useState(JSON.parse(localStorage.getItem('familyflow_members') || '[]'));
  const [newMemberName, setNewMemberName] = useState('');
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  
  const currentUser = LocalAuth.currentUser;
  const userInFamily = members.find(m => m.id === currentUser?.id || m.email === currentUser?.email);

  const createFamily = (e) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;
    
    // Создаём новую семью
    localStorage.setItem('familyflow_family_name', newFamilyName);
    const initialMembers = [{
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: 'parent',
      joinedAt: new Date().toISOString(),
      status: 'active'
    }];
    
    setFamilyName(newFamilyName);
    setMembers(initialMembers);
    localStorage.setItem('familyflow_members', JSON.stringify(initialMembers));
    setShowCreateFamily(false);
    setNewFamilyName('');
    alert(`🎉 Семья "${newFamilyName}" создана!`);
  };
  
  const leaveFamily = () => {
    if (confirm('Покинуть текущую семью? Вы потеряете доступ к общим данным.')) {
      localStorage.removeItem('familyflow_family_name');
      localStorage.removeItem('familyflow_members');
      setFamilyName('');
      setMembers([]);
      alert('Вы покинули семью');
    }
  };

  const addMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const selectedRole = document.getElementById('memberRole').value;
    const inviteId = Date.now();
    const newMember = {
      id: inviteId,
      name: newMemberName,
      role: selectedRole,
      joinedAt: new Date().toISOString(),
      inviteLink: `${window.location.origin}?invite=${inviteId}&family=${encodeURIComponent(familyName)}&role=${selectedRole}`,
      status: 'pending'
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem('familyflow_members', JSON.stringify(updatedMembers));
    setNewMemberName('');
  };

  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>👨‍👩‍👧‍👦 Управление семьёй</h1>
        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
      </div>
      
      {familyName && userInFamily ? (
        <>
          <div className="card" style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h3>🏠 Семья: {familyName}</h3>
                <p>Участников: {members.length} • Ваша роль: {userInFamily?.role === 'parent' ? '👨 Родитель' : userInFamily?.role === 'grandparent' ? '👴 Бабушка/Дедушка' : '👶 Ребёнок'}</p>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  onClick={() => setShowCreateFamily(true)}
                  className="btn btn-secondary"
                  style={{width: 'auto', padding: '8px 12px', fontSize: '14px'}}
                >
                  🎆 Создать новую
                </button>
                <button 
                  onClick={leaveFamily}
                  className="btn btn-secondary"
                  style={{width: 'auto', padding: '8px 12px', fontSize: '14px', background: 'var(--error)'}}
                >
                  🚪 Покинуть
                </button>
              </div>
            </div>
          </div>
          
          <div className="card" style={{marginBottom: '20px'}}>
            <h3>Добавить участника</h3>
            <form onSubmit={addMember}>
              <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                <input
                  type="text"
                  placeholder="Имя участника"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="form-input"
                  style={{flex: 1}}
                />
                <select className="form-input" style={{width: '120px'}} id="memberRole">
                  <option value="child">👶 Ребёнок</option>
                  <option value="parent">👨 Родитель</option>
                  <option value="grandparent">👴 Бабушка/Дедушка</option>
                </select>
                <button type="submit" className="btn btn-primary" style={{width: 'auto', padding: '12px 20px'}}>Добавить</button>
              </div>
            </form>
          </div>
          
          <div className="card">
            <h3>Участники семьи</h3>
            {members.length === 0 ? (
              <p style={{color: 'var(--text-secondary)'}}>Нет участников</p>
            ) : (
              members.map(member => (
                <div key={member.id} style={{
                  padding: '15px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '10px'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: member.inviteLink ? '10px' : '0'}}>
                    <div>
                      <div style={{fontWeight: 'bold'}}>{member.name}</div>
                      <div style={{fontSize: '14px', color: 'var(--text-secondary)'}}>
                        {member.role === 'parent' ? '👨 Родитель' : 
                         member.role === 'grandparent' ? '👴 Бабушка/Дедушка' : '👶 Ребёнок'}
                        {member.email && !member.email.includes('@familyflow.local') && ` • ${member.email}`}
                        {member.status === 'pending' && <span style={{color: 'var(--warning)', marginLeft: '10px'}}>⏳ Ожидает приглашения</span>}
                        {member.status === 'active' && member.email && member.email.includes('@familyflow.local') && <span style={{color: 'var(--success)', marginLeft: '10px'}}>👥 Гость</span>}
                      </div>
                    </div>
                    {member.id === LocalAuth.currentUser?.id && (
                      <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>Вы</span>
                    )}
                  </div>
                  
                  {member.inviteLink && (
                    <div style={{background: 'var(--bg-primary)', padding: '10px', borderRadius: '4px', fontSize: '12px'}}>
                      <div style={{marginBottom: '8px', fontWeight: 'bold'}}>🔗 Ссылка-приглашение:</div>
                      <div style={{display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '8px'}}>
                        <input 
                          type="text" 
                          value={member.inviteLink} 
                          readOnly 
                          style={{flex: 1, padding: '4px', fontSize: '11px', border: '1px solid var(--border)', borderRadius: '2px'}}
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(member.inviteLink);
                            alert('Ссылка скопирована!');
                          }}
                          style={{padding: '4px 8px', fontSize: '11px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer'}}
                        >
                          📋 Копировать
                        </button>
                      </div>
                      <div style={{textAlign: 'center'}}>
                        <div style={{marginBottom: '5px', fontWeight: 'bold'}}>📱 QR-код:</div>
                        <div style={{display: 'inline-block', padding: '10px', background: 'white', borderRadius: '4px'}}>
                          <div style={{width: '100px', height: '100px', background: `url('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(member.inviteLink)}')`, backgroundSize: 'contain'}}></div>
                        </div>
                        <div style={{fontSize: '10px', color: 'var(--text-secondary)', marginTop: '5px'}}>Отсканируйте для быстрого присоединения</div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="card" style={{textAlign: 'center', padding: '40px'}}>
          <h3>👥 У вас ещё нет семьи</h3>
          <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>
            Создайте семью или попросите приглашение
          </p>
          <button 
            onClick={() => setShowCreateFamily(true)}
            className="btn btn-primary"
            style={{width: 'auto', padding: '12px 24px'}}
          >
            🎆 Создать семью
          </button>
        </div>
      )}
      
      {/* Модальное окно создания семьи */}
      {showCreateFamily && (
        <div className="search-overlay" onClick={() => setShowCreateFamily(false)}>
          <div className="search-box" onClick={e => e.stopPropagation()}>
            <h3>🎆 Создать новую семью</h3>
            {familyName && (
              <p style={{color: 'var(--warning)', fontSize: '14px', marginBottom: '15px'}}>
                ⚠️ Вы покинете текущую семью "{familyName}"
              </p>
            )}
            <form onSubmit={createFamily}>
              <input
                type="text"
                placeholder="Название новой семьи"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                className="form-input"
                autoFocus
                style={{marginBottom: '15px'}}
              />
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                  Создать
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateFamily(false)} 
                  className="btn btn-secondary" 
                  style={{flex: 1}}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const tasks = JSON.parse(localStorage.getItem('familyflow_tasks') || '[]');
  const messages = JSON.parse(localStorage.getItem('familyflow_messages') || '[]');
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const unlockedAchievements = JSON.parse(localStorage.getItem('familyflow_achievements') || '[]');
  
  const priorityTypes = new Set(tasks.map(t => t.priority).filter(Boolean)).size;
  
  const analyticsData = {
    totalTasks,
    completedTasks,
    progress,
    messages: messages.length,
    priorityTypes
  };
  
  const newAchievements = checkAchievements(analyticsData);

  return (
    <div className="page" style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>📊 Аналитика</h1>
        <Link to="/dashboard" className="btn btn-secondary">← Назад</Link>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div className="card" style={{textAlign: 'center'}}>
          <h3>🎯 Прогресс</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)'}}>{progress}%</div>
          <p>выполнено задач</p>
        </div>
        
        <div className="card" style={{textAlign: 'center'}}>
          <h3>✅ Выполнено</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)'}}>{completedTasks}</div>
          <p>из {totalTasks} задач</p>
        </div>
        
        <div className="card" style={{textAlign: 'center'}}>
          <h3>💬 Сообщения</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)'}}>{messages.length}</div>
          <p>в чате семьи</p>
        </div>
        
        <div className="card" style={{textAlign: 'center'}}>
          <h3>🏆 Достижения</h3>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)'}}>{unlockedAchievements.length}</div>
          <p>из {ACHIEVEMENTS.length} открыто</p>
        </div>
      </div>
      
      {/* Достижения */}
      <div className="card">
        <h3 style={{marginBottom: '20px'}}>🏆 Достижения</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div key={achievement.id} style={{
                padding: '15px',
                borderRadius: 'var(--radius-sm)',
                background: isUnlocked ? 'var(--success)' : 'var(--bg-secondary)',
                color: isUnlocked ? 'white' : 'var(--text-secondary)',
                opacity: isUnlocked ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{fontSize: '24px'}}>{achievement.icon}</div>
                <div>
                  <div style={{fontWeight: 'bold'}}>{achievement.name}</div>
                  <div style={{fontSize: '12px'}}>{achievement.desc}</div>
                </div>
                {isUnlocked && <div style={{marginLeft: 'auto'}}>✓</div>}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Новые достижения */}
      {newAchievements.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          background: 'var(--success)',
          color: 'white',
          padding: '15px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1000,
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{fontWeight: 'bold'}}>🎉 Новое достижение!</div>
          {newAchievements.map(ach => (
            <div key={ach.id}>{ach.icon} {ach.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(LocalAuth.currentUser);
  const [theme, setTheme] = useState(localStorage.getItem('familyflow_theme') || 'light');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUser(LocalAuth.currentUser);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('familyflow_theme', newTheme);
  };

  const searchResults = () => {
    if (!searchQuery) return [];
    const tasks = JSON.parse(localStorage.getItem('familyflow_tasks') || '[]');
    const messages = JSON.parse(localStorage.getItem('familyflow_messages') || '[]');
    
    return [
      ...tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(t => ({type: 'task', text: t.text, id: t.id})),
      ...messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(m => ({type: 'message', text: m.text, author: m.author}))
    ];
  };

  return (
    <div className="app">
      {/* Theme Toggle */}
      <div className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </div>

      {/* Global Search */}
      {showSearch && (
        <div className="search-overlay" onClick={() => setShowSearch(false)}>
          <div className="search-box" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Поиск задач, сообщений... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              autoFocus
            />
            <div style={{marginTop: '15px', maxHeight: '300px', overflowY: 'auto'}}>
              {searchResults().map((result, i) => (
                <div key={i} className="card" style={{margin: '5px 0', padding: '10px'}}>
                  <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>
                    {result.type === 'task' ? '📋 Задача' : '💬 Сообщение'}
                  </div>
                  <div>{result.text}</div>
                  {result.author && <div style={{fontSize: '12px'}}>от {result.author}</div>}
                </div>
              ))}
              {searchQuery && searchResults().length === 0 && (
                <div style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '20px'}}>
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <WelcomePage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/tasks" element={user ? <TasksPage /> : <Navigate to="/" />} />
          <Route path="/calendar" element={user ? <CalendarPage /> : <Navigate to="/" />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/" />} />
          <Route path="/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/" />} />
          <Route path="/ai-assistant" element={user ? <AIAssistantPage /> : <Navigate to="/" />} />
          <Route path="/family" element={user ? <FamilyPage /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;