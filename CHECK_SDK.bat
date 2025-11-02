@echo off
echo Проверка Android SDK...
echo.

set SDK_PATH=C:\Users\bogda\AppData\Local\Android\Sdk

if exist "%SDK_PATH%" (
    echo [OK] Android SDK найден: %SDK_PATH%
    echo.
    echo Содержимое:
    dir "%SDK_PATH%" /B
) else (
    echo [ОШИБКА] Android SDK не найден!
    echo.
    echo Установите Android Studio:
    echo https://developer.android.com/studio
    echo.
    echo Или укажите правильный путь в android\local.properties
)

echo.
pause
