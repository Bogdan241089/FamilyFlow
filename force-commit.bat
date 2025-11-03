@echo off
echo Forcing commit of all AI changes...
git add -f src/services/aiService.js
git add -f src/components/Toast.js
git add -f src/screens/AIAssistantScreen.js
git add -f .env
git commit -m "fix: force update YandexGPT integration"
git push
echo Done!
pause
