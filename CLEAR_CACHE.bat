@echo off
echo ========================================
echo   FamilyFlow - Clear Cache
echo ========================================

echo [1/4] Stopping processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/4] Clearing build cache...
if exist "build" rmdir /s /q "build"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo [3/4] Clearing browser cache...
echo Please clear browser cache manually:
echo 1. Press Ctrl+Shift+Delete
echo 2. Select "Cached images and files"
echo 3. Click "Delete data"
echo.
echo Or use incognito mode: Ctrl+Shift+N

echo [4/4] Starting fresh...
npm start

pause