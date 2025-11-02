@echo off
echo ========================================
echo Проверка геймификации FamilyFlow
echo ========================================
echo.

echo [1/3] Проверка зависимостей...
if not exist "node_modules\" (
    echo ОШИБКА: node_modules не найден!
    echo Запустите: npm install
    pause
    exit /b 1
)
echo ✓ Зависимости установлены

echo.
echo [2/3] Проверка файлов геймификации...
if not exist "src\services\gamificationService.js" (
    echo ОШИБКА: gamificationService.js не найден!
    pause
    exit /b 1
)
if not exist "src\components\AchievementNotification.js" (
    echo ОШИБКА: AchievementNotification.js не найден!
    pause
    exit /b 1
)
echo ✓ Все файлы на месте

echo.
echo [3/3] Проверка Firebase конфигурации...
if not exist "src\firebase\config.js" (
    echo ОШИБКА: Firebase config не найден!
    pause
    exit /b 1
)
echo ✓ Firebase настроен

echo.
echo ========================================
echo ✓ Всё готово к работе!
echo ========================================
echo.
echo Для запуска:
echo 1. Терминал 1: npm run emulators
echo 2. Терминал 2: npm start
echo.
pause
