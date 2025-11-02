@echo off
echo ========================================
echo Installing Java 21 for APK build
echo ========================================
echo.

echo Downloading Java 21...
powershell -Command "Invoke-WebRequest -Uri 'https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe' -OutFile '%TEMP%\jdk-21-installer.exe'"

echo.
echo Installing Java 21...
echo Please follow the installer instructions
start /wait %TEMP%\jdk-21-installer.exe

echo.
echo Cleaning up...
del %TEMP%\jdk-21-installer.exe

echo.
echo ========================================
echo Java 21 installed!
echo Please restart your terminal
echo Then run: build-apk-final.bat
echo ========================================
pause
