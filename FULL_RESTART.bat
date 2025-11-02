@echo off
echo 🧹 Полная очистка и перезапуск FamilyFlow...

echo.
echo 1. Остановка процессов...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Очистка кэша сборки...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "build" rmdir /s /q "build"

echo 3. Очистка npm кэша...
npm cache clean --force

echo 4. Запуск приложения...
start /b npm start

echo.
echo ✅ Готово! Ждите запуска сервера...
echo.
echo 📋 Что делать дальше:
echo 1. Дождитесь сообщения "webpack compiled"
echo 2. Откройте браузер в режиме ИНКОГНИТО (Ctrl+Shift+N)
echo 3. Перейдите на http://localhost:3000
echo.
echo ⚠️  ВАЖНО: Используйте ТОЛЬКО режим инкогнито!
echo.
pause