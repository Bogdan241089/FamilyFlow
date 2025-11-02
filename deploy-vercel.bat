@echo off
echo ========================================
echo Deploying FamilyFlow to Vercel
echo ========================================
echo.

echo Step 1: Login to Vercel
echo Open the link in browser and confirm
echo.
vercel login
echo.

echo Step 2: Deploying to production...
vercel --prod --yes
echo.

echo ========================================
echo Deployment complete!
echo Your app is now live!
echo ========================================
pause
