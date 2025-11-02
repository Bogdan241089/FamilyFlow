import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { FaTasks, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './UpcomingTasks.css';

function UpcomingTasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTasks() {
      if (!currentUser) return;
      
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      
      if (familyId) {
        const tasksSnap = await getDocs(
          query(
            collection(db, `families/${familyId}/tasks`),
            orderBy('datetime', 'asc'),
            limit(5)
          )
        );
        
        const tasksList = [];
        tasksSnap.forEach(doc => {
          const task = doc.data();
          if (!task.done && (task.assignee === currentUser.uid || task.responsible === currentUser.uid)) {
            tasksList.push({ id: doc.id, ...task });
          }
        });
        setTasks(tasksList.slice(0, 3));
      }
    }
    loadTasks();
  }, [currentUser]);

  if (tasks.length === 0) return null;

  return (
    <div className="widget upcoming-tasks">
      <h3><FaTasks /> Ближайшие задачи</h3>
      {tasks.map(task => (
        <div key={task.id} className="task-item" onClick={() => navigate('/tasks')}>
          <div className="task-title">{task.title}</div>
          <div className="task-time">
            <FaClock /> {new Date(task.datetime).toLocaleString('ru-RU', { 
              day: 'numeric', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UpcomingTasks;
