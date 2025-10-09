@echo off
echo Starting TravelCircles Platform...
echo.

echo Installing dependencies...
cd apps\api
call npm install
if errorlevel 1 (
    echo Failed to install API dependencies
    pause
    exit /b 1
)

cd ..\web
call npm install
if errorlevel 1 (
    echo Failed to install Web dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.

echo Starting API server...
cd ..\api
start "TravelCircles API" cmd /k "npm run dev"

echo Waiting for API to start...
timeout /t 5 /nobreak > nul

echo Starting Web application...
cd ..\web
start "TravelCircles Web" cmd /k "npm run dev"

echo.
echo ========================================
echo TravelCircles Platform is starting...
echo ========================================
echo.
echo API Server: http://localhost:3001
echo Web Application: http://localhost:3000
echo.
echo Both applications will open in separate windows.
echo Wait a few moments for them to fully start.
echo.
pause
