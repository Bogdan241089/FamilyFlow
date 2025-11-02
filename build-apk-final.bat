@echo off
echo ========================================
echo Building FamilyFlow APK
echo ========================================
echo.

echo Checking Java version...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found!
    echo Please run: install-java21.bat
    pause
    exit /b 1
)

echo.
echo Step 1/3: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: React build failed!
    pause
    exit /b 1
)

echo.
echo Step 2/3: Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo Step 3/3: Building APK (this may take 2-5 minutes)...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo.
    echo ERROR: APK build failed!
    echo.
    echo Possible solutions:
    echo 1. Install Java 21: run install-java21.bat
    echo 2. Or use Vercel: run deploy-vercel.bat
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
echo Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Opening folder...
start explorer android\app\build\outputs\apk\debug
echo.
echo You can now:
echo 1. Copy app-debug.apk to your phone
echo 2. Install it (enable "Unknown sources" in settings)
echo 3. Enjoy FamilyFlow!
echo.
pause
