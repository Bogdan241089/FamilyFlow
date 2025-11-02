# Установка FamilyFlow

## Системные требования

- Node.js 16+ 
- npm 8+
- Git
- Современный браузер (Chrome, Firefox, Safari, Edge)

## Быстрая установка

### 1. Клонировать репозиторий
```bash
git clone https://github.com/YOUR_USERNAME/FamilyFlow.git
cd FamilyFlow
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Настроить Firebase
Скопируйте `.env.example` в `.env` и заполните данными вашего Firebase проекта:
```bash
copy .env.example .env
```

Отредактируйте `.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 4. (Опционально) Настроить Gemini AI
Добавьте в `.env`:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_key
```
Получить ключ: https://makersuite.google.com/app/apikey

### 5. Запустить приложение
```bash
npm start
```

Откройте http://localhost:3000

## Режим разработки с Firebase Emulator

### 1. Установить Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Войти в Firebase
```bash
firebase login
```

### 3. Запустить эмуляторы
```bash
npm run emulators
```

### 4. Запустить приложение (в другом терминале)
```bash
npm start
```

## Сборка для продакшена

### Web (PWA)
```bash
npm run build
```
Файлы будут в папке `build/`

### Android APK
```bash
BUILD_APK_DIRECT.bat
```
или
```bash
npm run android:build
```

APK будет в `android/app/build/outputs/apk/debug/`

## Деплой

### Firebase Hosting
```bash
npm run deploy:firebase
```

### Другие платформы
- Vercel: подключите репозиторий
- Netlify: подключите репозиторий
- GitHub Pages: настройте в настройках репозитория

## Проверка установки

После запуска проверьте:
- ✅ Приложение открывается на http://localhost:3000
- ✅ Можно зарегистрироваться
- ✅ Можно создать семью
- ✅ Все функции работают

## Устранение проблем

### Ошибка "Module not found"
```bash
npm install
```

### Ошибка Firebase
Проверьте `.env` файл и настройки Firebase

### Ошибка порта 3000 занят
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Ошибка при сборке APK
Убедитесь что установлен:
- Android Studio
- Java JDK 11+
- Android SDK

## Обновление

```bash
git pull origin main
npm install
npm start
```

## Полезные команды

```bash
# Разработка
npm start                    # Запустить dev сервер
npm run emulators           # Запустить Firebase эмуляторы

# Тестирование
npm test                    # Запустить тесты
npm run test:coverage       # Тесты с покрытием

# Качество кода
npm run lint                # Проверить код
npm run lint:fix            # Исправить ошибки
npm run format              # Форматировать код

# Сборка
npm run build               # Собрать для продакшена
npm run analyze             # Анализ размера бандла

# Android
npm run cap:sync            # Синхронизировать с Capacitor
npm run cap:open:android    # Открыть в Android Studio
npm run android:build       # Собрать APK

# Версионирование
npm run version:bump        # Увеличить версию

# Деплой
npm run deploy:firebase     # Задеплоить на Firebase
```

## Структура проекта

```
FamilyFlow/
├── public/              # Статические файлы
├── src/
│   ├── components/      # React компоненты
│   ├── contexts/        # React контексты
│   ├── hooks/          # Кастомные хуки
│   ├── screens/        # Экраны приложения
│   ├── services/       # Сервисы (Firebase, API)
│   ├── utils/          # Утилиты
│   └── App.js          # Главный компонент
├── .env.example        # Пример конфигурации
├── package.json        # Зависимости
└── README.md          # Документация
```

## Документация

- 📖 [README.md](README.md) - Основная документация
- 🚀 [QUICK_START_IMPROVEMENTS.md](QUICK_START_IMPROVEMENTS.md) - Быстрый старт
- 📝 [IMPROVEMENTS.md](IMPROVEMENTS.md) - Описание улучшений
- 💡 [EXAMPLES.md](EXAMPLES.md) - Примеры кода
- 📦 [VERSION_MANAGEMENT.md](VERSION_MANAGEMENT.md) - Управление версиями
- 📱 [BUILD_APK.md](BUILD_APK.md) - Сборка Android
- 📋 [CHANGELOG.md](CHANGELOG.md) - История изменений

## Поддержка

Если возникли проблемы:
1. Проверьте документацию
2. Посмотрите Issues на GitHub
3. Создайте новый Issue

---

**Готово! Приятного использования FamilyFlow! 🎉**
