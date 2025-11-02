# Решение проблем с геймификацией

## "An unexpected error occurred"

### Возможные причины:

1. **Firestore не инициализирован**
   - Убедитесь, что Firebase Emulator запущен: `npm run emulators`
   - Проверьте файл `.env` с настройками Firebase

2. **Отсутствует коллекция userStats**
   - Коллекция создаётся автоматически при первом использовании
   - Проверьте консоль браузера (F12) на наличие ошибок

3. **Проблемы с импортами**
   - Убедитесь, что все зависимости установлены: `npm install`
   - Перезапустите сервер: `npm start`

### Быстрое решение:

```bash
# 1. Остановите приложение (Ctrl+C)
# 2. Очистите кэш
npm cache clean --force

# 3. Переустановите зависимости
npm install

# 4. Запустите Firebase Emulator
npm run emulators

# 5. В новом терминале запустите приложение
npm start
```

### Проверка в консоли браузера:

1. Откройте DevTools (F12)
2. Перейдите на вкладку Console
3. Ищите ошибки красного цвета
4. Если видите ошибки Firebase - проверьте подключение к эмулятору

### Временное отключение геймификации:

Если нужно быстро отключить геймификацию:

1. Закомментируйте импорты в `TaskScreen.js`:
```javascript
// import { completeTask, unlockAchievement, getUserStats } from '../services/gamificationService';
// import AchievementNotification from '../components/AchievementNotification';
```

2. Закомментируйте вызовы в функции `handleDone`

### Логи для отладки:

Все функции геймификации теперь имеют обработку ошибок и выводят информацию в консоль:
- `Error getting user stats` - проблема с получением статистики
- `Error completing task` - проблема при завершении задачи
- `Error unlocking achievement` - проблема с разблокировкой достижения

## Контакты
Если проблема не решается - проверьте Issues в репозитории проекта
