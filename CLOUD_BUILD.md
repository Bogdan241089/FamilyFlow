# Облачная сборка APK (без Android Studio)

## Вариант 1: EAS Build (Expo)

```bash
# Установка EAS CLI
npm install -g eas-cli

# Вход в аккаунт Expo (создайте на expo.dev)
eas login

# Инициализация
eas build:configure

# Сборка APK
eas build --platform android --profile preview
```

APK будет доступен для скачивания через веб-интерфейс.

## Вариант 2: GitHub Actions (бесплатно)

Создайте файл `.github/workflows/build-apk.yml`:

```yaml
name: Build APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npx cap sync
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd android && ./gradlew assembleDebug
      - uses: actions/upload-artifact@v3
        with:
          name: app-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

Загрузите код на GitHub, APK соберётся автоматически.

## Вариант 3: Appetize.io (тестирование в браузере)

1. Загрузите build на https://appetize.io
2. Тестируйте приложение прямо в браузере
3. Без установки на телефон

## Рекомендация

Для разработки лучше установить Android Studio один раз.
Для CI/CD используйте GitHub Actions.
