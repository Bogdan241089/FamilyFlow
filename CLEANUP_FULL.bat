@echo off
echo Полная очистка FamilyFlow...

REM Остановить все процессы Node.js
taskkill /f /im node.exe 2>nul

REM Очистить кэш npm
npm cache clean --force

REM Удалить node_modules и package-lock.json
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Переустановить зависимости
npm install

REM Очистить кэш браузера (инструкция)
echo.
echo ВАЖНО: Очистите кэш браузера:
echo 1. Ctrl+Shift+Delete
echo 2. Выберите "Все время"
echo 3. Отметьте все галочки
echo 4. Нажмите "Удалить данные"
echo.

REM Запустить приложение
echo Запуск приложения...
npm start

pause