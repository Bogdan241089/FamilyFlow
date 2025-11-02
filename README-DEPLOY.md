# Как установить FamilyFlow на Android

## Вариант 1: Vercel (РЕКОМЕНДУЕТСЯ - 2 минуты)

1. Запустите: `deploy-vercel.bat`
2. Войдите через GitHub/Google
3. Получите ссылку: `https://family-flow-xxx.vercel.app`
4. Откройте на телефоне в Chrome
5. Меню → "Добавить на главный экран"
6. Готово! Работает как приложение

## Вариант 2: APK через Netlify

1. Зарегистрируйтесь на https://app.netlify.com
2. Перетащите папку `build` на сайт
3. Получите ссылку
4. Откройте на телефоне → "Добавить на главный экран"

## Вариант 3: APK через Android Studio

1. Установите Android Studio: https://developer.android.com/studio
2. Откройте проект: File → Open → выберите папку `android`
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

## Вариант 4: Локальная сеть (без интернета)

1. Запустите: `npm start`
2. Узнайте IP: `ipconfig` (например: 192.168.1.100)
3. На телефоне откройте: `http://192.168.1.100:3000`
4. Меню → "Добавить на главный экран"

---

**Рекомендация:** Используйте Vercel - это быстро, бесплатно и работает везде!
