@echo off
echo ========================================
echo FamilyFlow - Сборка APK для Android
echo ========================================
echo.

echo [1/5] Установка зависимостей Capacitor...
call npm install @capacitor/core @capacitor/cli @capacitor/android
echo.

echo [2/5] Сборка React приложения...
call npm run build
echo.

echo [3/5] Добавление Android платформы...
if not exist "android" (
    call npx cap add android
) else (
    echo Android платформа уже добавлена
)
echo.

echo [4/5] Синхронизация с Android...
call npx cap sync
echo.

echo [5/5] Открытие Android Studio...
echo ВАЖНО: В Android Studio выберите Build - Build Bundle(s) / APK(s) - Build APK(s)
echo APK будет в: android\app\build\outputs\apk\debug\app-debug.apk
echo.
call npx cap open android

echo.
echo ========================================
echo Готово! Следуйте инструкциям в Android Studio
echo ========================================
pause
