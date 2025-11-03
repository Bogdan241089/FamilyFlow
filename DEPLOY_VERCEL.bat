@echo off
echo ========================================
echo   FamilyFlow - Deploy to Vercel
echo ========================================
echo.

echo [1/3] Installing Vercel CLI...
npm install -g vercel

echo.
echo [2/3] Building project...
npm run build

echo.
echo [3/3] Deploying to Vercel...
vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your app is now live on Vercel!
echo.
pause
