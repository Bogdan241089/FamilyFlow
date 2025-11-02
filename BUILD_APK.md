# Создание APK для Android

## Шаг 1: Установка Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
```

При инициализации укажите:
- **App name**: FamilyFlow
- **App ID**: com.familyflow.app
- **Web directory**: build

## Шаг 2: Сборка React-приложения

```bash
npm run build
```

## Шаг 3: Добавление Android платформы

```bash
npx cap add android
```

## Шаг 4: Синхронизация

```bash
npx cap sync
```

## Шаг 5: Открытие в Android Studio

```bash
npx cap open android
```

## Шаг 6: Сборка APK в Android Studio

1. В Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Дождитесь завершения сборки
3. APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

## Альтернатива: Сборка через командную строку

Если установлен Android SDK:

```bash
cd android
gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Для production APK (подписанный)

1. Создайте keystore:
```bash
keytool -genkey -v -keystore familyflow.keystore -alias familyflow -keyalg RSA -keysize 2048 -validity 10000
```

2. В Android Studio: **Build → Generate Signed Bundle / APK**
3. Выберите keystore и создайте release APK

## Установка на телефон

1. Включите "Установка из неизвестных источников" на Android
2. Скопируйте APK на телефон
3. Откройте файл и установите

## Важно для Firebase

Перед сборкой production APK замените в `src/firebase/config.js`:
- Реальные Firebase credentials
- Уберите подключение к эмулятору для production

## Требования

- Node.js 16+
- Android Studio (для сборки APK)
- JDK 11+ (устанавливается с Android Studio)
- Android SDK (устанавливается с Android Studio)

## Размер APK

- Debug APK: ~50-70 МБ
- Release APK (минифицированный): ~20-30 МБ
