import React, { useState } from 'react';
import { FaRobot, FaMagic, FaLightbulb } from 'react-icons/fa';
import { generateTaskFromText, suggestTasks, analyzeProductivity } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

function AIAssistantScreen() {
  const { currentUser } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [mode, setMode] = useState('create'); // create, suggest, analyze

  async function handleGenerate() {
    if (!input.trim()) {
      setToast({ message: 'Введите текст', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const task = await generateTaskFromText(input);
      setResult(task);
      setToast({ message: 'Задача создана ИИ!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Ошибка ИИ', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggest() {
    setLoading(true);
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) {
        setToast({ message: 'Семья не найдена', type: 'error' });
        return;
      }
      const tasksSnap = await getDocs(collection(db, `families/${familyId}/tasks`));
      const tasks = [];
      tasksSnap.forEach(doc => tasks.push(doc.data()));
      const suggestions = await suggestTasks({ tasksCount: tasks.length, completedCount: tasks.filter(t => t.done).length });
      setResult(suggestions);
      setToast({ message: 'ИИ предложил задачи!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Ошибка ИИ', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    setLoading(true);
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) {
        setToast({ message: 'Семья не найдена', type: 'error' });
        return;
      }
      const tasksSnap = await getDocs(collection(db, `families/${familyId}/tasks`));
      const tasks = [];
      tasksSnap.forEach(doc => tasks.push(doc.data()));
      const analysis = await analyzeProductivity(tasks);
      setResult(analysis);
      setToast({ message: 'Анализ готов!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Ошибка ИИ', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask() {
    if (!result || !currentUser) return;
    setLoading(true);
    try {
      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      if (!familyId) return;
      
      await addDoc(collection(db, `families/${familyId}/tasks`), {
        title: result.title,
        desc: result.description,
        datetime: new Date().toISOString(),
        priority: result.priority || 'medium',
        category: result.category || 'other',
        assignee: currentUser.uid,
        responsible: currentUser.uid,
        showFor: [currentUser.uid],
        color: '#4caf50',
        done: false,
        confirmed: false,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString()
      });
      
      setToast({ message: 'Задача добавлена!', type: 'success' });
      setResult(null);
      setInput('');
    } catch (error) {
      setToast({ message: 'Ошибка добавления', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h2><FaRobot style={{ marginRight: '0.5rem', color: '#9c27b0' }}/> ИИ Помощник</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setMode('create')} style={{ padding: '0.7rem 1.5rem', background: mode === 'create' ? '#9c27b0' : '#ddd', color: mode === 'create' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <FaMagic /> Создать задачу
        </button>
        <button onClick={() => setMode('suggest')} style={{ padding: '0.7rem 1.5rem', background: mode === 'suggest' ? '#9c27b0' : '#ddd', color: mode === 'suggest' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <FaLightbulb /> Предложить задачи
        </button>
        <button onClick={() => setMode('analyze')} style={{ padding: '0.7rem 1.5rem', background: mode === 'analyze' ? '#9c27b0' : '#ddd', color: mode === 'analyze' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          📊 Анализ
        </button>
      </div>

      {mode === 'create' && (
        <div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Опишите задачу своими словами, например: 'Нужно купить продукты на неделю и приготовить ужин'"
            style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', marginBottom: '1rem' }}
          />
          <button onClick={handleGenerate} disabled={loading} style={{ padding: '0.7rem 2rem', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>
            {loading ? 'ИИ думает...' : '✨ Создать задачу с ИИ'}
          </button>
        </div>
      )}

      {mode === 'suggest' && (
        <div>
          <p>ИИ проанализирует ваши задачи и предложит новые полезные задачи</p>
          <button onClick={handleSuggest} disabled={loading} style={{ padding: '0.7rem 2rem', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>
            {loading ? 'ИИ думает...' : '💡 Получить предложения'}
          </button>
        </div>
      )}

      {mode === 'analyze' && (
        <div>
          <p>ИИ проанализирует вашу продуктивность и даст рекомендации</p>
          <button onClick={handleAnalyze} disabled={loading} style={{ padding: '0.7rem 2rem', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>
            {loading ? 'ИИ анализирует...' : '📊 Анализировать'}
          </button>
        </div>
      )}

      {loading && <Spinner />}

      {result && mode === 'create' && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f3e5f5', borderRadius: '8px', border: '2px solid #9c27b0' }}>
          <h3>✨ ИИ создал задачу:</h3>
          <p><strong>Название:</strong> {result.title}</p>
          <p><strong>Описание:</strong> {result.description}</p>
          <p><strong>Приоритет:</strong> {result.priority}</p>
          <p><strong>Категория:</strong> {result.category}</p>
          {result.estimatedTime && <p><strong>Время:</strong> {result.estimatedTime}</p>}
          <button onClick={handleAddTask} style={{ padding: '0.7rem 1.5rem', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '1rem' }}>
            ➕ Добавить задачу
          </button>
        </div>
      )}

      {result && mode === 'suggest' && Array.isArray(result) && (
        <div style={{ marginTop: '2rem' }}>
          <h3>💡 ИИ предлагает:</h3>
          {result.map((task, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Приоритет: {task.priority} | Категория: {task.category}</span>
            </div>
          ))}
        </div>
      )}

      {result && mode === 'analyze' && result.score && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h3>📊 Анализ продуктивности:</h3>
          <p><strong>Оценка:</strong> {result.score}/10</p>
          <h4>Инсайты:</h4>
          <ul>
            {result.insights?.map((insight, idx) => <li key={idx}>{insight}</li>)}
          </ul>
          <h4>Рекомендации:</h4>
          <ul>
            {result.recommendations?.map((rec, idx) => <li key={idx}>{rec}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AIAssistantScreen;
