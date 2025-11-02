# Быстрый старт - Новые улучшения

## Установка зависимостей

```bash
npm install
```

## Использование улучшений

### 1. Toast уведомления (самое простое!)

```javascript
import { useToast } from './components/Toast';

function MyComponent() {
  const toast = useToast();
  
  const handleClick = () => {
    toast.success('Успешно!');
    toast.error('Ошибка!');
    toast.info('Информация');
  };
  
  return <button onClick={handleClick}>Показать уведомление</button>;
}
```

### 2. Горячие клавиши

```javascript
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function MyComponent() {
  useKeyboardShortcuts([
    { keys: ['s'], ctrl: true, action: () => console.log('Save!') }
  ]);
  
  return <div>Нажмите Ctrl+S</div>;
}
```

### 3. Экспорт/Импорт данных

```javascript
import DataExportImport from './components/DataExportImport';

<DataExportImport 
  familyData={{ family, members, tasks }}
  onImport={(data) => console.log(data)}
/>
```

### 4. Loading состояния

```javascript
import { LoadingState, SkeletonList } from './components/LoadingState';

{loading ? <LoadingState /> : <YourContent />}
{loading ? <SkeletonList count={3} /> : <YourList />}
```

### 5. Мониторинг производительности

```javascript
import { performanceMonitor } from './services/performanceMonitor';

await performanceMonitor.measureAsync('loadData', async () => {
  const data = await fetchData();
  return data;
});
```

### 6. Аналитика событий

```javascript
import { analyticsService } from './services/analyticsService';

analyticsService.track('button_clicked', { button: 'save' });
analyticsService.trackTaskCreated(taskData);
```

### 7. Accessibility

```javascript
import { a11y } from './utils/accessibility';

// Объявить для screen readers
a11y.announce('Задача создана');

// Проверить настройки
if (a11y.prefersReducedMotion()) {
  // Отключить анимации
}
```

## Уже интегрировано в App.js

✅ ErrorBoundary - автоматически ловит ошибки  
✅ ToastProvider - доступен через useToast()  
✅ UpdateNotification - проверяет обновления  
✅ KeyboardShortcutsHelp - нажмите Shift+?  

## Горячие клавиши по умолчанию

- **Ctrl + K** - Поиск
- **Ctrl + N** - Новая задача
- **Ctrl + S** - Сохранить
- **Esc** - Закрыть
- **Shift + ?** - Помощь

## Запуск

```bash
npm start
```

Все улучшения работают автоматически! 🎉
