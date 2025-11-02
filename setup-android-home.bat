@echo off
echo ========================================
echo Setting up ANDROID_HOME
echo ========================================
echo.

echo Looking for Android SDK...
set SDK_PATH=

if exist "%LOCALAPPDATA%\Android\Sdk" (
    set SDK_PATH=%LOCALAPPDATA%\Android\Sdk
    echo Found SDK at: %LOCALAPPDATA%\Android\Sdk
) else if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk" (
    set SDK_PATH=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo Found SDK at: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
) else if exist "C:\Android\Sdk" (
    set SDK_PATH=C:\Android\Sdk
    echo Found SDK at: C:\Android\Sdk
) else (
    echo ERROR: Android SDK not found!
    echo.
    echo Please find your SDK location in Android Studio:
    echo Tools -^> SDK Manager -^> Android SDK Location
    echo.
    echo Then run: setx ANDROID_HOME "YOUR_SDK_PATH"
    pause
    exit /b 1
)

echo.
echo Setting ANDROID_HOME environment variable...
setx ANDROID_HOME "%SDK_PATH%"
setx PATH "%PATH%;%SDK_PATH%\platform-tools;%SDK_PATH%\tools"

echo.
echo ========================================
echo SUCCESS! ANDROID_HOME is set!
echo ========================================
echo.
echo IMPORTANT: Close this terminal and open a NEW one
echo Then run: rebuild-apk.bat
echo.
pause
