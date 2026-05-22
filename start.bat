@echo off
title Bank Simulator Server
echo Starting Bank Simulator...
call npm install
call npm run build
echo.
echo Server started! Open http://localhost:3000
echo Press Ctrl+C to stop
echo.
node server.cjs
pause
