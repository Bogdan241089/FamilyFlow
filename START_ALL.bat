@echo off
echo Starting FamilyFlow with Firebase Emulator...

REM Start Firebase Emulator in background
start "Firebase Emulator" cmd /c "firebase emulators:start --only auth,firestore"

REM Wait for emulator to start
timeout /t 5 /nobreak > nul

REM Start React app
echo Starting React app...
npm start

pause