@echo off
echo Starting CoachKeith Development Server...
echo.
echo [1] Start Local Server (localhost:8081)
echo [2] Start Internet Tunnel (accessible anywhere)
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Starting local server...
    npx expo start --web
) else if "%choice%"=="2" (
    echo Starting tunnel server...
    npx expo start --tunnel
) else (
    echo Invalid choice.
    pause
)
