# 🎯 Быстрые команды FamilyFlow

## 🚀 Основные команды

### Запуск
```bash
npm start                    # Запустить dev сервер (http://localhost:3000)
npm run emulators           # Запустить Firebase эмуляторы
```

### Установка
```bash
npm install                 # Установить все зависимости
npm ci                      # Чистая установка (для CI/CD)
```

---

## 🧪 Тестирование

```bash
npm test                    # Запустить тесты в watch режиме
npm run test:coverage       # Тесты с покрытием кода
npm run test:ci             # Тесты для CI/CD
```

---

## 🎨 Качество кода

### Линтинг
```bash
npm run lint                # Проверить код на ошибки
npm run lint:fix            # Автоматически исправить ошибки
```

### Форматирование
```bash
npm run format              # Отформатировать весь код
```

---

## 🏗️ Сборка

### Production
```bash
npm run build               # Собрать production build
npm run analyze             # Анализ размера бандла
```

### Проверка сборки
```bash
npm run build && npx serve -s build
```

---

## 📱 Android

### Быстрая сборка
```bash
BUILD_APK_DIRECT.bat        # Быстрая сборка APK (Windows)
```

### Полная сборка
```bash
npm run cap:init            # Инициализация Capacitor
npm run cap:add:android     # Добавить Android платформу
npm run cap:sync            # Синхронизировать код
npm run cap:open:android    # Открыть в Android Studio
npm run android:build       # Собрать APK
```

---

## 🔥 Firebase

### Эмуляторы
```bash
npm run emulators           # Запустить эмуляторы
firebase emulators:start    # Альтернативный способ
```

### Деплой
```bash
npm run deploy:firebase     # Задеплоить на Firebase Hosting
firebase deploy             # Полный деплой
firebase deploy --only hosting  # Только hosting
```

---

## 📦 Версионирование

```bash
npm version patch           # 1.0.0 -> 1.0.1
npm version minor           # 1.0.0 -> 1.1.0
npm version major           # 1.0.0 -> 2.0.0
npm run version:bump        # Автоматически patch + push
```

---

## 🔧 Разработка

### Очистка
```bash
# Очистить node_modules и переустановить
rmdir /s /q node_modules    # Windows
rm -rf node_modules         # Linux/Mac
npm install
```

### Очистка кэша
```bash
npm cache clean --force
```

### Обновление зависимостей
```bash
npm update                  # Обновить все зависимости
npm outdated                # Показать устаревшие пакеты
```

---

## 🐛 Отладка

### Проверка ошибок
```bash
npm start 2>&1 | findstr /i "error"    # Windows
npm start 2>&1 | grep -i error         # Linux/Mac
```

### Verbose режим
```bash
npm start --verbose
```

---

## 📊 Анализ

### Размер бандла
```bash
npm run analyze
```

### Аудит безопасности
```bash
npm audit                   # Проверить уязвимости
npm audit fix               # Исправить уязвимости
```

---

## 🌐 Git команды

### Основные
```bash
git status                  # Статус изменений
git add .                   # Добавить все файлы
git commit -m "message"     # Коммит
git push                    # Отправить на сервер
```

### Ветки
```bash
git branch                  # Список веток
git checkout -b feature     # Создать новую ветку
git merge feature           # Слить ветку
```

### Теги
```bash
git tag v1.0.0             # Создать тег
git push --tags            # Отправить теги
```

---

## 🎯 Быстрые сценарии

### Первый запуск
```bash
npm install
npm start
```

### Полная проверка
```bash
npm run lint
npm run format
npm test
npm run build
```

### Подготовка к релизу
```bash
npm run lint:fix
npm run format
npm run test:coverage
npm run build
npm run version:bump
```

### Сборка APK
```bash
npm run build
npm run cap:sync
cd android && gradlew assembleDebug
```

---

## 🔍 Полезные команды

### Информация о проекте
```bash
npm list                    # Список зависимостей
npm list --depth=0          # Только прямые зависимости
npm info <package>          # Информация о пакете
```

### Поиск файлов
```bash
dir /s /b *.js             # Найти все JS файлы (Windows)
find . -name "*.js"        # Найти все JS файлы (Linux/Mac)
```

### Размер проекта
```bash
dir /s                     # Размер папки (Windows)
du -sh .                   # Размер папки (Linux/Mac)
```

---

## 📱 Capacitor команды

```bash
npx cap init               # Инициализация
npx cap add android        # Добавить Android
npx cap add ios            # Добавить iOS
npx cap sync               # Синхронизировать
npx cap open android       # Открыть Android Studio
npx cap open ios           # Открыть Xcode
npx cap copy               # Копировать web assets
npx cap update             # Обновить платформы
```

---

## 🔥 Firebase CLI

```bash
firebase login             # Войти в аккаунт
firebase logout            # Выйти
firebase projects:list     # Список проектов
firebase use <project>     # Выбрать проект
firebase init              # Инициализация
firebase deploy            # Деплой
firebase serve             # Локальный сервер
```

---

## 💡 Советы

### Быстрый рестарт
```bash
# Ctrl+C для остановки
npm start
```

### Открыть в браузере
```bash
start http://localhost:3000    # Windows
open http://localhost:3000     # Mac
xdg-open http://localhost:3000 # Linux
```

### Проверка портов
```bash
netstat -ano | findstr :3000   # Windows
lsof -ti:3000                  # Linux/Mac
```

### Убить процесс на порту
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 🎨 Кастомные скрипты

Добавьте в `package.json`:

```json
{
  "scripts": {
    "dev": "npm start",
    "prod": "npm run build && serve -s build",
    "clean": "rm -rf node_modules build",
    "fresh": "npm run clean && npm install",
    "check": "npm run lint && npm test",
    "release": "npm run check && npm run build"
  }
}
```

---

## 📚 Документация команд

### npm
- https://docs.npmjs.com/cli/v8/commands

### Firebase
- https://firebase.google.com/docs/cli

### Capacitor
- https://capacitorjs.com/docs/cli

### React Scripts
- https://create-react-app.dev/docs/available-scripts

---

## 🎯 Шпаргалка

### Ежедневная разработка
```bash
npm start                  # Запуск
npm run lint:fix          # Исправить код
npm test                  # Тесты
```

### Перед коммитом
```bash
npm run lint:fix
npm run format
npm test
git add .
git commit -m "message"
git push
```

### Перед релизом
```bash
npm run lint:fix
npm run format
npm run test:coverage
npm run build
npm run version:bump
```

---

**Сохраните этот файл для быстрого доступа к командам!** 📌
