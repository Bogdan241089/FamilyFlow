# Руководство по развёртыванию FamilyFlow

## 🚀 Развёртывание на Firebase Hosting

### 1. Установка Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Вход в Firebase
```bash
firebase login
```

### 3. Инициализация проекта
```bash
firebase init
```
Выберите:
- Hosting
- Firestore
- Storage
- Authentication

### 4. Настройка .env
Создайте `.env` из `.env.example` и заполните реальными данными Firebase

### 5. Сборка проекта
```bash
npm run build
```

### 6. Развёртывание
```bash
firebase deploy
```

## 📱 Сборка Android APK

См. `BUILD_APK.md`

## 🔐 Настройка безопасности

### Firestore Rules
Правила уже настроены в `firestore.rules`. Разверните их:
```bash
firebase deploy --only firestore:rules
```

### Storage Rules
```bash
firebase deploy --only storage
```

## 🌍 Настройка домена

1. В Firebase Console → Hosting → Add custom domain
2. Следуйте инструкциям для настройки DNS

## 📊 Мониторинг

### Firebase Performance
```bash
npm install firebase
```

Добавьте в код:
```javascript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

### Google Analytics
Уже интегрирован через Firebase

## 🔄 CI/CD с GitHub Actions

Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🐛 Отладка

### Локальная разработка
```bash
npm start
```

### Firebase Emulator
```bash
npm run emulators
```

### Проверка сборки
```bash
npm run build
npx serve -s build
```

## 📈 Оптимизация

### Анализ размера бандла
```bash
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Lighthouse аудит
1. Откройте DevTools
2. Lighthouse → Generate report

## 🔒 Checklist перед продакшеном

- [ ] Заменить тестовые Firebase credentials
- [ ] Настроить реальную базу данных
- [ ] Включить Firebase Authentication
- [ ] Настроить Storage правила
- [ ] Добавить custom домен
- [ ] Настроить SSL сертификат
- [ ] Включить Firebase Analytics
- [ ] Настроить резервное копирование
- [ ] Протестировать на разных устройствах
- [ ] Проверить PWA функциональность
- [ ] Настроить мониторинг ошибок

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `firebase functions:log`
2. Проверьте статус: https://status.firebase.google.com
3. Документация: https://firebase.google.com/docs
