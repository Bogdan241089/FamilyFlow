# Управление версиями FamilyFlow

## Текущая версия: 1.0.0

## Система проверки обновлений

### Автоматическая проверка
- Проверка каждые 24 часа
- Уведомление о новых версиях
- Критические обновления нельзя отклонить

### Файл version.json
Обновите `public/version.json` при новом релизе:
```json
{
  "version": "1.0.1",
  "releaseNotes": "Исправлены ошибки и улучшена производительность",
  "downloadUrl": "https://github.com/YOUR_USERNAME/FamilyFlow/releases/latest",
  "critical": false,
  "releaseDate": "2024-01-15"
}
```

### Параметры
- **version**: Номер версии (semver)
- **releaseNotes**: Краткое описание изменений
- **downloadUrl**: Ссылка на скачивание
- **critical**: true = обязательное обновление
- **releaseDate**: Дата релиза

## Создание нового релиза

### 1. Обновите версию
```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### 2. Обновите version.json
Измените файл `public/version.json` с новой версией

### 3. Обновите versionService.js
Измените `CURRENT_VERSION` в `src/services/versionService.js`

### 4. Создайте git tag
```bash
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main --tags
```

### 5. Соберите релиз
```bash
npm run build
# или для Android
BUILD_APK_DIRECT.bat
```

## Semantic Versioning

- **MAJOR** (1.x.x): Несовместимые изменения API
- **MINOR** (x.1.x): Новые функции (обратно совместимые)
- **PATCH** (x.x.1): Исправления ошибок

## История версий

### v1.0.0 (2024-01-01)
- Первый релиз
- Все основные функции MVP
- PWA поддержка
- Android APK

## Быстрая команда
```bash
npm run version:bump
```
Автоматически увеличивает patch версию и пушит в git
