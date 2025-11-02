@echo off
echo ========================================
echo Android SDK Setup
echo ========================================
echo.
echo To build APK you need:
echo 1. Android Studio (5+ GB download)
echo 2. Android SDK (3+ GB)
echo 3. 2-3 hours setup time
echo.
echo RECOMMENDED: Use Vercel instead (2 minutes)
echo Run: deploy-vercel.bat
echo.
echo If you still want APK:
echo 1. Download Android Studio: https://developer.android.com/studio
echo 2. Install with default settings
echo 3. Open Android Studio
echo 4. Tools → SDK Manager → Install Android SDK
echo 5. Set ANDROID_HOME environment variable
echo 6. Run rebuild-apk.bat again
echo.
pause
start https://developer.android.com/studio
