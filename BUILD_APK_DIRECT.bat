@echo off
echo ========================================
echo Сборка APK напрямую (без Android Studio)
echo ========================================
echo.

cd android

echo Сборка debug APK...
call gradlew.bat assembleDebug

echo.
echo ========================================
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo УСПЕХ! APK создан:
    echo %cd%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Размер файла:
    dir "app\build\outputs\apk\debug\app-debug.apk" | find "app-debug.apk"
) else (
    echo ОШИБКА: APK не создан
)
echo ========================================
pause
