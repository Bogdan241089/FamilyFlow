@echo off
echo Перезапуск FamilyFlow...

REM Останавливаем процессы Node.js
taskkill /f /im node.exe 2>nul

REM Ждем 2 секунды
timeout /t 2 /nobreak >nul

REM Очищаем кэш npm
npm start

echo.
echo Приложение запущено на http://localhost:3000
echo Откройте в режиме инкогнито: Ctrl+Shift+N
pause