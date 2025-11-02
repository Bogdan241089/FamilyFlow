@echo off
echo ========================================
echo Starting FamilyFlow Locally
echo ========================================
echo.
echo Your computer IP addresses:
ipconfig | findstr IPv4
echo.
echo Starting server...
echo.
echo Open on your phone:
echo http://192.168.43.241:3000
echo.
npm start
