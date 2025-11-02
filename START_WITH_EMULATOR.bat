@echo off
echo ========================================
echo   FamilyFlow - Start with Firebase Emulator
echo ========================================

echo [1/2] Starting Firebase Emulator...
start "Firebase Emulator" cmd /k "cd /d %~dp0 && firebase emulators:start --only auth,firestore --import=./firebase_emulator_data --export-on-exit"

echo [2/2] Waiting 5 seconds for emulator to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting React app...
npm start

echo ========================================
echo   Open in browser:
echo   http://localhost:3000
echo ========================================