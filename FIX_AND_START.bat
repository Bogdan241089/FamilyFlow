@echo off
echo 🔧 Исправление проблем с чанками и запуск FamilyFlow...

echo.
echo 1. Остановка процессов...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Установка CRACO (если нужно)...
npm install --save-dev @craco/craco

echo 3. Очистка кэша...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "build" rmdir /s /q "build"

echo 4. Запуск с новой конфигурацией...
start /b npm start

echo.
echo ✅ Готово! Теперь приложение запускается без code splitting.
echo.
echo 📋 Что делать дальше:
echo 1. Дождитесь "webpack compiled successfully"
echo 2. Откройте http://localhost:3000/clear-cache.html
echo 3. Дождитесь "Кэш очищен!"
echo 4. Откройте http://localhost:3000
echo.
echo ⚠️  Если проблемы остались - используйте режим инкогнито
echo.
pause