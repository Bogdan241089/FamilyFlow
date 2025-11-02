@echo off
echo ========================================
echo Rebuilding FamilyFlow APK
echo ========================================
echo.

echo Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 exit /b 1

echo.
echo Step 2: Syncing with Capacitor...
if not exist android (
    echo Creating Android project...
    call npx cap add android
)
call npx cap sync
if %errorlevel% neq 0 exit /b 1

echo.
echo Step 3: Creating local.properties...
echo sdk.dir=C:\Users\bogda\AppData\Local\Android\Sdk > android\local.properties

echo.
echo Step 4: Building APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo SUCCESS! APK is ready!
echo ========================================
echo.
start explorer android\app\build\outputs\apk\debug
pause
