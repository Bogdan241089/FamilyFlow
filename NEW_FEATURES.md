# 🎉 Новые функции FamilyFlow

## ✅ Что добавлено

### 1. 🔔 Простые уведомления (SimpleToast)

**Использование:**
```javascript
import { showToast } from '../components/SimpleToast';

showToast('Успешно!', 'success');
showToast('Ошибка!', 'error');
showToast('Информация', 'info');
```

### 2. 🔄 Skeleton Loader

**Использование:**
```javascript
import { SkeletonList, SkeletonCard } from '../components/SkeletonLoader';

{loading ? <SkeletonList count={5} /> : <YourContent />}
```

### 3. ✨ Анимации

**Использование:**
```javascript
<div className="fade-in">Контент</div>
<div className="slide-in">Контент</div>
<div className="scale-in">Контент</div>
<div className="bounce">Контент</div>
<div className="pulse">Контент</div>
<div className="rotate">Иконка</div>
```

## 📦 Сервисы (готовы к использованию)

### Performance Monitor
```javascript
import { performanceMonitor } from './services/performanceMonitor';

await performanceMonitor.measureAsync('loadData', async () => {
  return await fetchData();
});
```

### Analytics
```javascript
import { analyticsService } from './services/analyticsService';

analyticsService.track('button_clicked', { button: 'save' });
```

### Export/Import
```javascript
import { dataExportService } from './services/dataExportService';

await dataExportService.exportToJSON(data);
const imported = await dataExportService.importFromJSON(file);
```

### Accessibility
```javascript
import { a11y } from './utils/accessibility';

a11y.announce('Задача создана');
```

## 🚀 Запуск

```bash
npm start
```

Всё работает! 🎊
