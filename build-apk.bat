@echo off
echo ========================================
echo Building FamilyFlow APK
echo ========================================
echo.

echo Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: React build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Building APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: APK build failed! Make sure Java JDK is installed.
    echo Download Java from: https://adoptium.net/
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo SUCCESS! APK is ready!
echo ========================================
echo Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
start explorer android\app\build\outputs\apk\debug
pause
