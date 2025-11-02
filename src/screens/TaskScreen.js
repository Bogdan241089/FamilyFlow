import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './TaskScreen.css';
import { FaTasks } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { completeTask, unlockAchievement, getUserStats } from '../services/gamificationService';
import AchievementNotification from '../components/AchievementNotification';
import { notifyTaskCompleted, notifyAchievement, scheduleTaskReminder } from '../services/notificationService';
import VoiceInput from '../components/VoiceInput';

function TaskScreen() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [datetime, setDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [showFor, setShowFor] = useState([]); // список uid для отображения задачи
  const [color, setColor] = useState('#4caf50');
  const [priority, setPriority] = useState('medium');
  const [recurring, setRecurring] = useState('none');
  const [category, setCategory] = useState('home');
  const [reminder, setReminder] = useState('none');
  const [photo, setPhoto] = useState('');
  const [editId, setEditId] = useState(null); // id задачи для переноса
  const [newDatetime, setNewDatetime] = useState('');
  const [assignee, setAssignee] = useState('');
  const [responsible, setResponsible] = useState('');
  const [members, setMembers] = useState([]);
  const [memberNames, setMemberNames] = useState({}); // uid -> name
  const [role, setRole] = useState('parent');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentTask, setCommentTask] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [subtaskTask, setSubtaskTask] = useState(null);
  const [subtaskText, setSubtaskText] = useState('');
  const [subtasks, setSubtasks] = useState({});
  const [achievementNotif, setAchievementNotif] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [taskPhotos, setTaskPhotos] = useState({});

  async function refreshTasks(familyId) {
    const tasksSnap = await getDocs(query(collection(db, `families/${familyId}/tasks`), orderBy('datetime', 'asc')));
    const tasksList = [];
    tasksSnap.forEach(doc => {
      tasksList.push({ id: doc.id, ...doc.data() });
    });
    setTasks(tasksList);
  }

  useEffect(() => {
    async function fetchRoleMembersTasks() {
      try {
        if (currentUser) {
          const profile = await getProfile(currentUser.uid);
          setRole(profile?.role || 'parent');
          const stats = await getUserStats(currentUser.uid);
          setUserStats(stats);
          const familyId = profile?.defaultFamilyId;
          if (familyId) {
            const membersSnap = await getDocs(collection(db, `families/${familyId}/members`));
            const membersList = [];
            const names = {};
            for (const doc of membersSnap.docs) {
              const memberData = doc.data();
              membersList.push({ uid: doc.id, ...memberData });
              const memberProfile = await getProfile(doc.id);
              names[doc.id] = memberProfile?.name || doc.id;
            }
            setMembers(membersList);
            setMemberNames(names);
            await refreshTasks(familyId);
            const tasksSnap = await getDocs(collection(db, `families/${familyId}/tasks`));
            const commentsData = {};
            for (const task of tasksSnap.docs) {
              const commentsSnap = await getDocs(collection(db, `families/${familyId}/tasks/${task.id}/comments`));
              commentsData[task.id] = [];
              commentsSnap.forEach(doc => {
                commentsData[task.id].push({ id: doc.id, ...doc.data() });
              });
            }
            setComments(commentsData);
            const subtasksData = {};
            for (const task of tasksSnap.docs) {
              const subtasksSnap = await getDocs(collection(db, `families/${familyId}/tasks/${task.id}/subtasks`));
              subtasksData[task.id] = [];
              subtasksSnap.forEach(doc => {
                subtasksData[task.id].push({ id: doc.id, ...doc.data() });
              });
            }
            setSubtasks(subtasksData);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        toast.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    }
    fetchRoleMembersTasks();
  }, [currentUser]);

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title || !datetime || !assignee || !responsible) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    if (!currentUser) return;
    setLoading(true);
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      const newTask = {
      title,
      desc,
      datetime,
      endDatetime: endDatetime || datetime,
      assignee,
      responsible,
      showFor: showFor.length ? showFor : [assignee],
      color,
      priority,
      recurring,
      category,
      reminder,
      photo,
      done: false,
      confirmed: false,
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString()
      };
      const taskRef = await addDoc(collection(db, `families/${familyId}/tasks`), newTask);
      for (const uid of newTask.showFor) {
        const newEvent = {
          title: `[Задача] ${title}`,
          date: datetime,
          description: desc,
          assignee,
          responsible,
          linkedTask: taskRef.id,
          forUser: uid,
          color,
          createdBy: currentUser.uid,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, `families/${familyId}/calendar`), newEvent);
      }
      await refreshTasks(familyId);
      setTitle('');
      setDesc('');
      setDatetime('');
      setEndDatetime('');
      setAssignee('');
      setResponsible('');
      setShowFor([]);
      setColor('#4caf50');
      setPriority('medium');
      setRecurring('none');
      setCategory('home');
      setReminder('none');
      setPhoto('');
      toast.success('Задача успешно добавлена');
    } catch (error) {
      console.error('Ошибка добавления задачи:', error);
      toast.error('Ошибка добавления задачи');
    } finally {
      setLoading(false);
    }
  }

  async function handleReschedule(task) {
    if (!currentUser) return;
    const profile = await getProfile(currentUser.uid);
    const familyId = profile?.defaultFamilyId;
    if (!familyId) return;
    if (currentUser.uid !== task.assignee && currentUser.uid !== task.responsible) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, `families/${familyId}/tasks`, task.id), { datetime: newDatetime });
      const eventsSnap = await getDocs(query(collection(db, `families/${familyId}/calendar`), orderBy('date', 'asc')));
      for (const ev of eventsSnap.docs) {
        if (ev.data().linkedTask === task.id) {
          await updateDoc(doc(db, `families/${familyId}/calendar`, ev.id), { date: newDatetime });
        }
      }
      await refreshTasks(familyId);
      setEditId(null);
      setNewDatetime('');
      toast.success('Задача перенесена');
    } catch (error) {
      console.error('Ошибка переноса задачи:', error);
      toast.error('Ошибка переноса задачи');
    } finally {
      setLoading(false);
    }
  }

  async function handleDone(task) {
    if (!currentUser) return;
    const profile = await getProfile(currentUser.uid);
    const familyId = profile?.defaultFamilyId;
    if (!familyId) return;
    if (currentUser.uid !== task.assignee) return;
    try {
      const newDoneState = !task.done;
      await updateDoc(doc(db, `families/${familyId}/tasks`, task.id), { done: newDoneState });
      
      if (newDoneState) {
        const result = await completeTask(currentUser.uid, task);
        const profile = await getProfile(currentUser.uid);
        notifyTaskCompleted(task, profile?.name || 'Пользователь');
        toast.success(`Задача выполнена! +${result.points} очков 🏆`);
        
        if (result.unlockedAchievements?.length > 0) {
          for (const ach of result.unlockedAchievements) {
            await unlockAchievement(currentUser.uid, ach.id);
            notifyAchievement(ach);
            setAchievementNotif(ach);
            await new Promise(resolve => setTimeout(resolve, 4500));
          }
        }
        
        const newStats = await getUserStats(currentUser.uid);
        setUserStats(newStats);
      } else {
        toast.success('Задача отмечена как невыполненная');
      }
      
      await refreshTasks(familyId);
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
      toast.error('Ошибка обновления задачи');
    }
  }

  async function handleConfirm(task) {
    if (!currentUser) return;
    const profile = await getProfile(currentUser.uid);
    const familyId = profile?.defaultFamilyId;
    if (!familyId) return;
    if (currentUser.uid !== task.responsible || !task.done) return;
    try {
      await updateDoc(doc(db, `families/${familyId}/tasks`, task.id), { confirmed: !task.confirmed });
      await refreshTasks(familyId);
      toast.success(task.confirmed ? 'Подтверждение отменено' : 'Задача подтверждена!');
    } catch (error) {
      console.error('Ошибка подтверждения задачи:', error);
      toast.error('Ошибка подтверждения задачи');
    }
  }

  async function handleDelete(task) {
    if (!currentUser) return;
    if (role !== 'parent') return;
    if (!window.confirm('Удалить задачу?')) return;
    const profile = await getProfile(currentUser.uid);
    const familyId = profile?.defaultFamilyId;
    if (!familyId) return;
    try {
      await deleteDoc(doc(db, `families/${familyId}/tasks`, task.id));
      const eventsSnap = await getDocs(collection(db, `families/${familyId}/calendar`));
      for (const ev of eventsSnap.docs) {
        if (ev.data().linkedTask === task.id) {
          await deleteDoc(doc(db, `families/${familyId}/calendar`, ev.id));
        }
      }
      await refreshTasks(familyId);
      toast.success('Задача удалена');
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
      toast.error('Ошибка удаления задачи');
    }
  }

  async function handleExportCSV() {
    const { exportToCSV } = await import('../services/exportService');
    exportToCSV(tasks, memberNames);
    toast.success('Экспорт CSV завершён');
  }

  async function handleExportPDF() {
    const { exportToPDF } = await import('../services/exportService');
    exportToPDF(tasks, memberNames, 'FamilyFlow');
    toast.success('Экспорт HTML завершён (откройте в браузере и сохраните как PDF)');
  }

  async function handleAddComment(taskId) {
    if (!commentText.trim() || !currentUser) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      await addDoc(collection(db, `families/${familyId}/tasks/${taskId}/comments`), {
        text: commentText,
        author: currentUser.uid,
        authorName: memberNames[currentUser.uid] || currentUser.uid,
        createdAt: new Date().toISOString()
      });
      const commentsSnap = await getDocs(collection(db, `families/${familyId}/tasks/${taskId}/comments`));
      const taskComments = [];
      commentsSnap.forEach(doc => {
        taskComments.push({ id: doc.id, ...doc.data() });
      });
      setComments({...comments, [taskId]: taskComments});
      setCommentText('');
      toast.success('Комментарий добавлен');
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      toast.error('Ошибка добавления комментария');
    }
  }

  async function handleAddSubtask(taskId) {
    if (!subtaskText.trim() || !currentUser) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      await addDoc(collection(db, `families/${familyId}/tasks/${taskId}/subtasks`), {
        text: subtaskText,
        done: false,
        createdAt: new Date().toISOString()
      });
      const subtasksSnap = await getDocs(collection(db, `families/${familyId}/tasks/${taskId}/subtasks`));
      const taskSubtasks = [];
      subtasksSnap.forEach(doc => {
        taskSubtasks.push({ id: doc.id, ...doc.data() });
      });
      setSubtasks({...subtasks, [taskId]: taskSubtasks});
      setSubtaskText('');
      toast.success('Подзадача добавлена');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка добавления подзадачи');
    }
  }

  async function handleToggleSubtask(taskId, subtaskId, done) {
    if (!currentUser) return;
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      await updateDoc(doc(db, `families/${familyId}/tasks/${taskId}/subtasks`, subtaskId), { done: !done });
      const subtasksSnap = await getDocs(collection(db, `families/${familyId}/tasks/${taskId}/subtasks`));
      const taskSubtasks = [];
      subtasksSnap.forEach(doc => {
        taskSubtasks.push({ id: doc.id, ...doc.data() });
      });
      setSubtasks({...subtasks, [taskId]: taskSubtasks});
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async function handleEditTask(task) {
    if (!currentUser) return;
    if (role !== 'parent') return;
    const profile = await getProfile(currentUser.uid);
    const familyId = profile?.defaultFamilyId;
    if (!familyId) return;
    try {
      await updateDoc(doc(db, `families/${familyId}/tasks`, task.id), {
        title: editingTask.title,
        desc: editingTask.desc,
        assignee: editingTask.assignee,
        responsible: editingTask.responsible,
        color: editingTask.color
      });
      await refreshTasks(familyId);
      setEditingTask(null);
      toast.success('Задача обновлена');
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
      toast.error('Ошибка обновления задачи');
    }
  }

  if (loading) return <div className="task-container"><Spinner /></div>;

  return (
    <div className="task-container">
      
      {achievementNotif && <AchievementNotification achievement={achievementNotif} onClose={() => setAchievementNotif(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2><FaTasks style={{ marginRight: '0.5rem', color: '#4caf50' }}/> Задачи семьи</h2>
        {userStats && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <span style={{ fontWeight: 'bold' }}>🏆 {userStats.points} очков</span>
            <span>🔥 {userStats.streak} дней</span>
          </div>
        )}
      </div>
      {(() => {
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.done).length;
        const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        return (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Прогресс выполнения</span>
              <span><strong>{doneTasks} / {totalTasks}</strong> ({progress}%)</span>
            </div>
            <div style={{ width: '100%', height: '20px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #4caf50, #8bc34a)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        );
      })()}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Поиск по названию или описанию..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1rem', fontSize: '14px' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')} style={{ padding: '0.5rem 1rem', background: filter === 'all' ? '#4caf50' : '#ddd', color: filter === 'all' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Все</button>
          <button onClick={() => setFilter('my')} style={{ padding: '0.5rem 1rem', background: filter === 'my' ? '#4caf50' : '#ddd', color: filter === 'my' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Мои</button>
          <button onClick={() => setFilter('done')} style={{ padding: '0.5rem 1rem', background: filter === 'done' ? '#4caf50' : '#ddd', color: filter === 'done' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Выполненные</button>
          <span style={{ marginLeft: 'auto', marginRight: '0.5rem' }}>Сортировка:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}>
            <option value="date">По дате</option>
            <option value="status">По статусу</option>
            <option value="priority">По приоритету</option>
          </select>
          <button onClick={handleExportCSV} style={{ padding: '0.5rem 1rem', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '0.5rem' }}>Экспорт CSV</button>
          <button onClick={handleExportPDF} style={{ padding: '0.5rem 1rem', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '0.5rem' }}>Экспорт PDF</button>
        </div>
      </div>
      {role === 'parent' ? (
  <form onSubmit={handleAddTask} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Название задачи"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <VoiceInput onResult={(text) => setTitle(text)} />
          </div>
          <input
            type="text"
            placeholder="Описание"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
            placeholder="Начало"
          />
          <input
            type="datetime-local"
            value={endDatetime}
            onChange={e => setEndDatetime(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
            placeholder="Окончание (необязательно)"
          />
          <select
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          >
            <option value="">Выберите исполнителя</option>
            {members.map(m => (
              <option key={m.uid} value={m.uid}>{memberNames[m.uid] || m.uid} ({m.role})</option>
            ))}
          </select>
          <select
            value={responsible}
            onChange={e => setResponsible(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          >
            <option value="">Выберите ответственного</option>
            {members.map(m => (
              <option key={m.uid} value={m.uid}>{memberNames[m.uid] || m.uid} ({m.role})</option>
            ))}
          </select>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>Показать в календаре:</label>
            <select multiple value={showFor} onChange={e => setShowFor(Array.from(e.target.selectedOptions, opt => opt.value))} style={{ minWidth: '180px', padding: '0.5rem' }}>
              {members.map(m => (
                <option key={m.uid} value={m.uid}>{memberNames[m.uid] || m.uid} ({m.role})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.9rem', color: '#888', marginLeft: '10px' }}>
              (Можно выбрать нескольких членов семьи)
            </span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>Цвет задачи:</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '40px', height: '30px', verticalAlign: 'middle' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>Приоритет:</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>Повторение:</label>
            <select value={recurring} onChange={e => setRecurring(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="none">Не повторяется</option>
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>Категория:</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="home">🏠 Дом</option>
              <option value="work">💼 Работа</option>
              <option value="study">📚 Учёба</option>
              <option value="sport">⚽ Спорт</option>
              <option value="health">❤️ Здоровье</option>
              <option value="other">📋 Другое</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>Напоминание:</label>
            <select value={reminder} onChange={e => setReminder(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="none">Нет</option>
              <option value="1h">За 1 час</option>
              <option value="3h">За 3 часа</option>
              <option value="1d">За 1 день</option>
              <option value="1w">За 1 неделю</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '10px' }}>📷 Фото:</label>
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setPhoto(reader.result);
                reader.readAsDataURL(file);
              }
            }} style={{ padding: '0.5rem' }} />
            {photo && <img src={photo} alt="preview" style={{ maxWidth: '200px', marginTop: '0.5rem', borderRadius: '8px' }} />}
          </div>
          <button type="submit" style={{ padding: '0.5rem 1.5rem', background: color, color: '#fff', border: 'none', borderRadius: '6px' }}>
            Добавить
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: '2rem', color: '#888' }}>
          <b>Ребёнок</b> не может создавать задачи
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.filter(task => {
          if (filter === 'my') return task.assignee === currentUser?.uid || task.responsible === currentUser?.uid;
          if (filter === 'done') return task.done;
          return true;
        }).filter(task => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return task.title.toLowerCase().includes(query) || task.desc?.toLowerCase().includes(query);
        }).sort((a, b) => {
          if (sortBy === 'date') return new Date(a.datetime) - new Date(b.datetime);
          if (sortBy === 'status') return (a.done ? 1 : 0) - (b.done ? 1 : 0);
          if (sortBy === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
          }
          return 0;
        }).length === 0 && <li>Нет задач</li>}
        {tasks.filter(task => {
          if (filter === 'my') return task.assignee === currentUser?.uid || task.responsible === currentUser?.uid;
          if (filter === 'done') return task.done;
          return true;
        }).filter(task => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return task.title.toLowerCase().includes(query) || task.desc?.toLowerCase().includes(query);
        }).sort((a, b) => {
          if (sortBy === 'date') return new Date(a.datetime) - new Date(b.datetime);
          if (sortBy === 'status') return (a.done ? 1 : 0) - (b.done ? 1 : 0);
          if (sortBy === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
          }
          return 0;
        }).map((task) => {
          const isOverdue = !task.done && new Date(task.datetime) < new Date();
          return (
          <li key={task.id} style={{ marginBottom: '1rem', background: isOverdue ? '#ffebee' : '#f7f8fa', padding: '1rem', borderRadius: '8px', borderLeft: `8px solid ${isOverdue ? '#f44336' : (task.color || '#4caf50')}` }}>
            <span style={{ display: 'inline-block', width: '16px', height: '16px', background: isOverdue ? '#f44336' : (task.color || '#4caf50'), borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' }}></span>
            <strong>{task.title}</strong> {isOverdue && <span style={{ color: '#f44336', fontWeight: 'bold', marginLeft: '0.5rem' }}>[ПРОСРОЧЕНО]</span>}<br />
            <span>{task.desc}</span><br />
            <span>Начало: {task.datetime}</span><br />
            {task.endDatetime && task.endDatetime !== task.datetime && <span>Окончание: {task.endDatetime}<br /></span>}
            {task.recurring && task.recurring !== 'none' && <span>Повторение: <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#e3f2fd', color: '#1976d2', fontSize: '0.85rem' }}>{task.recurring === 'daily' ? 'Ежедневно' : task.recurring === 'weekly' ? 'Еженедельно' : 'Ежемесячно'}</span><br /></span>}
            {task.category && <span>Категория: <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#f3e5f5', color: '#7b1fa2', fontSize: '0.85rem' }}>{task.category === 'home' ? '🏠 Дом' : task.category === 'work' ? '💼 Работа' : task.category === 'study' ? '📚 Учёба' : task.category === 'sport' ? '⚽ Спорт' : task.category === 'health' ? '❤️ Здоровье' : '📋 Другое'}</span><br /></span>}
            {task.reminder && task.reminder !== 'none' && <span>🔔 Напоминание: {task.reminder === '1h' ? 'За 1 час' : task.reminder === '3h' ? 'За 3 часа' : task.reminder === '1d' ? 'За 1 день' : 'За 1 неделю'}<br /></span>}
            {task.photo && <div style={{ marginTop: '0.5rem' }}><img src={task.photo} alt="task" style={{ maxWidth: '300px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.open(task.photo)} /></div>}
            {task.photos && task.photos.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Фото:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {task.photos.map((photo, idx) => (
                    <img key={idx} src={photo} alt={`photo-${idx}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.open(photo)} />
                  ))}
                </div>
              </div>
            )}
            <span>Исполнитель: {memberNames[task.assignee] || task.assignee}</span><br />
            <span>Ответственный: {memberNames[task.responsible] || task.responsible}</span><br />
            <span>Приоритет: <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: task.priority === 'high' ? '#ffebee' : task.priority === 'medium' ? '#fff3e0' : '#e8f5e9', color: task.priority === 'high' ? '#c62828' : task.priority === 'medium' ? '#ef6c00' : '#2e7d32', fontWeight: 'bold', fontSize: '0.85rem' }}>{task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}</span></span><br />
            <span>Видно в календаре: {task.showFor ? task.showFor.map(uid => memberNames[uid] || uid).join(', ') : (memberNames[task.assignee] || task.assignee)}</span><br />
            <span>Статус: {task.done ? 'Выполнено' : 'Не выполнено'}{task.confirmed ? ' (Подтверждено)' : ''}</span><br />
            {editingTask?.id === task.id ? (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '6px' }}>
                <input type="text" value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} style={{ marginRight: '0.5rem', padding: '0.5rem', width: '200px' }} placeholder="Название" />
                <input type="text" value={editingTask.desc} onChange={e => setEditingTask({...editingTask, desc: e.target.value})} style={{ marginRight: '0.5rem', padding: '0.5rem', width: '200px' }} placeholder="Описание" />
                <select value={editingTask.assignee} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} style={{ marginRight: '0.5rem', padding: '0.5rem' }}>
                  {members.map(m => <option key={m.uid} value={m.uid}>{memberNames[m.uid] || m.uid}</option>)}
                </select>
                <select value={editingTask.responsible} onChange={e => setEditingTask({...editingTask, responsible: e.target.value})} style={{ marginRight: '0.5rem', padding: '0.5rem' }}>
                  {members.map(m => <option key={m.uid} value={m.uid}>{memberNames[m.uid] || m.uid}</option>)}
                </select>
                <input type="color" value={editingTask.color} onChange={e => setEditingTask({...editingTask, color: e.target.value})} style={{ width: '40px', height: '30px', marginRight: '0.5rem' }} />
                <button onClick={() => handleEditTask(task)} style={{ padding: '0.3rem 1rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px', marginRight: '0.5rem' }}>Сохранить</button>
                <button onClick={() => setEditingTask(null)} style={{ padding: '0.3rem 1rem', background: '#999', color: '#fff', border: 'none', borderRadius: '6px' }}>Отмена</button>
              </div>
            ) : null}
            {currentUser && (currentUser.uid === task.assignee || currentUser.uid === task.responsible) && (
              <button onClick={() => { setEditId(task.id); setNewDatetime(task.datetime); }} style={{ marginRight: '1rem', padding: '0.3rem 1rem', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '6px' }}>
                Перенести
              </button>
            )}
            {editId === task.id && (
              <form onSubmit={e => { e.preventDefault(); handleReschedule(task); }} style={{ marginTop: '0.5rem' }}>
                <input type="datetime-local" value={newDatetime} onChange={e => setNewDatetime(e.target.value)} style={{ marginRight: '1rem', padding: '0.5rem' }} />
                <button type="submit" style={{ padding: '0.3rem 1rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px' }}>Сохранить</button>
                <button type="button" onClick={() => setEditId(null)} style={{ marginLeft: '0.5rem', padding: '0.3rem 1rem', background: '#f44336', color: '#fff', border: 'none', borderRadius: '6px' }}>Отмена</button>
              </form>
            )}
            {currentUser && currentUser.uid === task.assignee && (
              <label style={{ marginRight: '1rem' }}>
                <input type="checkbox" checked={!!task.done} onChange={() => handleDone(task)} /> Выполнено
              </label>
            )}
            {currentUser && currentUser.uid === task.responsible && task.done && (
              <button onClick={() => handleConfirm(task)} style={{ padding: '0.3rem 1rem', background: '#388e3c', color: '#fff', border: 'none', borderRadius: '6px', marginLeft: '1rem' }}>
                {task.confirmed ? 'Отменить подтверждение' : 'Подтвердить'}
              </button>
            )}
            {role === 'parent' && (
              <>
                <button onClick={() => setEditingTask({id: task.id, title: task.title, desc: task.desc, assignee: task.assignee, responsible: task.responsible, color: task.color})} style={{ padding: '0.3rem 1rem', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '6px', marginLeft: '1rem' }}>
                  Редактировать
                </button>
                <button onClick={() => handleDelete(task)} style={{ padding: '0.3rem 1rem', background: '#f44336', color: '#fff', border: 'none', borderRadius: '6px', marginLeft: '0.5rem' }}>
                  Удалить
                </button>
              </>
            )}
            <button onClick={() => setCommentTask(commentTask === task.id ? null : task.id)} style={{ padding: '0.3rem 1rem', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '6px', marginLeft: '0.5rem' }}>
              Комментарии ({comments[task.id]?.length || 0})
            </button>
            <button onClick={() => setSubtaskTask(subtaskTask === task.id ? null : task.id)} style={{ padding: '0.3rem 1rem', background: '#00bcd4', color: '#fff', border: 'none', borderRadius: '6px', marginLeft: '0.5rem' }}>
              Подзадачи ({subtasks[task.id]?.length || 0})
            </button>
            {commentTask === task.id && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '6px' }}>
                {comments[task.id]?.map(comment => (
                  <div key={comment.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>{comment.authorName}</strong>: {comment.text}
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem' }}>
                  <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Добавить комментарий..." style={{ width: '70%', padding: '0.5rem', marginRight: '0.5rem' }} />
                  <button onClick={() => handleAddComment(task.id)} style={{ padding: '0.5rem 1rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px' }}>Отправить</button>
                </div>
              </div>
            )}
            {subtaskTask === task.id && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '6px' }}>
                {subtasks[task.id]?.map(subtask => (
                  <div key={subtask.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={!!subtask.done} onChange={() => handleToggleSubtask(task.id, subtask.id, subtask.done)} style={{ width: '18px', height: '18px' }} />
                    <span style={{ textDecoration: subtask.done ? 'line-through' : 'none', opacity: subtask.done ? 0.6 : 1 }}>{subtask.text}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem' }}>
                  <input type="text" value={subtaskText} onChange={e => setSubtaskText(e.target.value)} placeholder="Добавить подзадачу..." style={{ width: '70%', padding: '0.5rem', marginRight: '0.5rem' }} />
                  <button onClick={() => handleAddSubtask(task.id)} style={{ padding: '0.5rem 1rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px' }}>Добавить</button>
                </div>
              </div>
            )}
          </li>
        );
        })}
      </ul>
    </div>
  );
}

export default TaskScreen;
