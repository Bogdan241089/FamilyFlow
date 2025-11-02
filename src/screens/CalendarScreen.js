import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import './CalendarScreen.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import Spinner from '../components/Spinner';

function CalendarScreen() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('#4caf50');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all/self
  const [memberNames, setMemberNames] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        if (currentUser) {
          const profile = await getProfile(currentUser.uid);
          const familyId = profile?.defaultFamilyId;
          if (familyId) {
            const membersSnap = await getDocs(collection(db, `families/${familyId}/members`));
            const names = {};
            for (const doc of membersSnap.docs) {
              const memberProfile = await getProfile(doc.id);
              names[doc.id] = memberProfile?.name || doc.id;
            }
            setMemberNames(names);
            const eventsSnap = await getDocs(query(collection(db, `families/${familyId}/calendar`), orderBy('date', 'asc')));
            const eventsList = [];
            eventsSnap.forEach(doc => {
              eventsList.push({ id: doc.id, ...doc.data() });
            });
            setEvents(eventsList);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setToast({ message: 'Ошибка загрузки данных', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [currentUser]);

  async function handleAddEvent(e) {
    e.preventDefault();
    if (!title || !date) {
      setToast({ message: 'Заполните обязательные поля', type: 'error' });
      return;
    }
    if (!currentUser) return;
    setLoading(true);
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      const newEvent = {
        title,
        date,
        description: desc,
        color,
        forUser: filter === 'self' ? currentUser.uid : null,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, `families/${familyId}/calendar`), newEvent);
      const eventsSnap = await getDocs(query(collection(db, `families/${familyId}/calendar`), orderBy('date', 'asc')));
      const eventsList = [];
      eventsSnap.forEach(doc => {
        eventsList.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsList);
      setTitle('');
      setDate('');
      setDesc('');
      setColor('#4caf50');
      setToast({ message: 'Событие добавлено', type: 'success' });
    } catch (error) {
      console.error('Ошибка добавления события:', error);
      setToast({ message: 'Ошибка добавления события', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="calendar-container"><Spinner /></div>;

  // фильтрация событий
  const filteredEvents = filter === 'self'
    ? events.filter(ev => ev.forUser === currentUser.uid || (!ev.forUser && (ev.assignee === currentUser.uid || ev.responsible === currentUser.uid)))
    : events;

  const handleDragStart = (e, event) => {
    e.dataTransfer.setData('eventId', event.id);
    e.dataTransfer.setData('eventDate', event.date);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newDate) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('eventId');
    const oldDate = e.dataTransfer.getData('eventDate');
    
    if (oldDate === newDate) return;
    
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      
      await updateDoc(doc(db, `families/${familyId}/calendar`, eventId), { date: newDate });
      
      const eventsSnap = await getDocs(query(collection(db, `families/${familyId}/calendar`), orderBy('date', 'asc')));
      const eventsList = [];
      eventsSnap.forEach(doc => {
        eventsList.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsList);
      setToast({ message: 'Событие перенесено', type: 'success' });
    } catch (error) {
      console.error('Ошибка переноса:', error);
      setToast({ message: 'Ошибка переноса события', type: 'error' });
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="calendar-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2><FaRegCalendarAlt style={{ marginRight: '0.5rem', color: '#4caf50' }}/> Семейный календарь</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '10px' }}>Показывать:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="all">Все семейные события</option>
          <option value="self">Только мои события</option>
        </select>
      </div>
  <form onSubmit={handleAddEvent} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Название события"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Описание"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '10px' }}>Цвет события:</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '40px', height: '30px', verticalAlign: 'middle' }} />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1.5rem', background: color, color: '#fff', border: 'none', borderRadius: '6px' }}>
          Добавить
        </button>
      </form>
      <div className="calendar-grid">
        {calendarDays.map(day => {
          const dayEvents = filteredEvents.filter(ev => ev.date === day);
          const dateObj = new Date(day);
          const isToday = day === new Date().toISOString().split('T')[0];
          
          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? 'today' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div className="day-header">
                <div className="day-name">{dateObj.toLocaleDateString('ru-RU', { weekday: 'short' })}</div>
                <div className="day-number">{dateObj.getDate()}</div>
              </div>
              <div className="day-events">
                {dayEvents.map(ev => (
                  <div
                    key={ev.id}
                    className="calendar-event"
                    draggable
                    onDragStart={(e) => handleDragStart(e, ev)}
                    style={{ borderLeft: `4px solid ${ev.color || '#4caf50'}` }}
                  >
                    <div className="event-title">{ev.title}</div>
                    {ev.description && <div className="event-desc">{ev.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarScreen;
