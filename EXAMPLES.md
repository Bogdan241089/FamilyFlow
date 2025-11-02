# Примеры использования улучшений

## 1. Toast уведомления в компоненте

```javascript
import React, { useState } from 'react';
import { useToast } from '../components/Toast';

function TaskForm() {
  const [title, setTitle] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Введите название задачи');
      return;
    }

    try {
      await saveTask({ title });
      toast.success('Задача создана!');
      setTitle('');
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название задачи"
      />
      <button type="submit">Создать</button>
    </form>
  );
}
```

## 2. Горячие клавиши в экране

```javascript
import React, { useState } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function TaskScreen() {
  const [showModal, setShowModal] = useState(false);

  useKeyboardShortcuts([
    { 
      keys: ['n'], 
      ctrl: true, 
      action: () => setShowModal(true) 
    },
    { 
      keys: ['escape'], 
      action: () => setShowModal(false) 
    }
  ]);

  return (
    <div>
      <h1>Задачи</h1>
      <p>Нажмите Ctrl+N для создания задачи</p>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
```

## 3. Мониторинг производительности

```javascript
import { performanceMonitor } from '../services/performanceMonitor';

async function loadTasks() {
  return await performanceMonitor.measureAsync('loadTasks', async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    return data;
  });
}

// Синхронная операция
function processData(data) {
  return performanceMonitor.measure('processData', () => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  });
}

// Получить статистику
console.log('Среднее время загрузки:', 
  performanceMonitor.getAverageTime('loadTasks'), 'ms');
```

## 4. Аналитика событий

```javascript
import { analyticsService } from '../services/analyticsService';

function TaskItem({ task, onComplete }) {
  const handleComplete = () => {
    onComplete(task.id);
    
    // Отслеживаем событие
    analyticsService.trackTaskCompleted(task.id);
    analyticsService.track('task_action', {
      action: 'complete',
      priority: task.priority,
      timeSpent: Date.now() - task.createdAt
    });
  };

  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={handleComplete}>Завершить</button>
    </div>
  );
}
```

## 5. Экспорт/Импорт в настройках

```javascript
import React from 'react';
import DataExportImport from '../components/DataExportImport';
import { useFamily } from '../contexts/FamilyContext';

function SettingsScreen() {
  const { family, members, tasks, events } = useFamily();

  const handleImport = async (importedData) => {
    // Обработка импортированных данных
    console.log('Импортировано:', importedData);
    // Обновить состояние приложения
  };

  return (
    <div className="settings">
      <h2>Настройки</h2>
      
      <section>
        <h3>Резервное копирование</h3>
        <DataExportImport
          familyData={{ family, members, tasks, events }}
          onImport={handleImport}
        />
      </section>
    </div>
  );
}
```

## 6. Loading состояния

```javascript
import React, { useState, useEffect } from 'react';
import { LoadingState, SkeletonList } from '../components/LoadingState';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonList count={5} />;
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

## 7. Accessibility

```javascript
import React, { useEffect, useRef } from 'react';
import { a11y } from '../utils/accessibility';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Ловушка фокуса
      const cleanup = a11y.trapFocus(modalRef.current);
      
      // Объявление для screen readers
      a11y.announce('Модальное окно открыто', 'polite');
      
      return () => {
        cleanup();
        a11y.announce('Модальное окно закрыто', 'polite');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
```

## 8. Комплексный пример

```javascript
import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { performanceMonitor } from '../services/performanceMonitor';
import { analyticsService } from '../services/analyticsService';
import { a11y } from '../utils/accessibility';
import { LoadingState } from '../components/LoadingState';

function SmartTaskForm() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Горячие клавиши
  useKeyboardShortcuts([
    { keys: ['s'], ctrl: true, action: handleSave },
    { keys: ['escape'], action: handleCancel }
  ]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Введите название');
      return;
    }

    setLoading(true);
    
    try {
      // Мониторинг производительности
      const task = await performanceMonitor.measureAsync('createTask', async () => {
        return await createTask({ title });
      });

      // Аналитика
      analyticsService.trackTaskCreated(task);

      // Уведомления
      toast.success('Задача создана!');
      a11y.announce('Задача успешно создана');

      // Очистка
      setTitle('');
    } catch (error) {
      toast.error('Ошибка создания задачи');
      analyticsService.track('error', { type: 'task_creation_failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    toast.info('Отменено');
  };

  if (loading) {
    return <LoadingState text="Создание задачи..." />;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название задачи"
        aria-label="Название задачи"
      />
      <button type="submit">
        Создать (Ctrl+S)
      </button>
      <button type="button" onClick={handleCancel}>
        Отмена (Esc)
      </button>
    </form>
  );
}
```

## Полезные советы

### 1. Комбинируйте улучшения
Используйте несколько улучшений вместе для лучшего UX

### 2. Отслеживайте производительность
Мониторьте критические операции

### 3. Информируйте пользователя
Используйте toast для обратной связи

### 4. Думайте о доступности
Всегда добавляйте aria-labels и announcements

### 5. Добавляйте горячие клавиши
Опытные пользователи оценят

---

**Больше примеров в коде проекта!** 🚀
