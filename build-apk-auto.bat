@echo off
echo Building FamilyFlow APK...
echo.

call npm run build
if %errorlevel% neq 0 exit /b 1

call npx cap sync
if %errorlevel% neq 0 exit /b 1

cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 exit /b 1
cd ..

echo.
echo APK ready at: android\app\build\outputs\apk\debug\app-debug.apk
start explorer android\app\build\outputs\apk\debug
