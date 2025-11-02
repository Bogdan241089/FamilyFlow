@echo off
echo ========================================
echo Simple Deploy Options
echo ========================================
echo.
echo Choose deployment method:
echo.
echo 1. Netlify Drop (EASIEST - no commands)
echo    - Open: https://app.netlify.com/drop
echo    - Drag folder: c:\Users\bogda\FamilyFlow\build
echo    - Get link instantly!
echo.
echo 2. Vercel (2 minutes)
echo    - Run: deploy-vercel.bat
echo.
echo 3. Firebase Hosting (if you have Firebase)
echo    - Run: npm run deploy:firebase
echo.
echo Opening Netlify Drop...
start https://app.netlify.com/drop
echo.
echo Opening build folder...
start explorer c:\Users\bogda\FamilyFlow\build
echo.
echo Just drag the 'build' folder to the browser!
pause
