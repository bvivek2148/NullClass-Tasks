@echo off
echo ========================================
echo TravelCircles Platform - Fix and Run
echo ========================================
echo.

echo 🔧 Cleaning up previous installations...
if exist "apps\api\node_modules" (
    echo Removing API node_modules...
    rmdir /s /q "apps\api\node_modules"
)
if exist "apps\web\node_modules" (
    echo Removing Web node_modules...
    rmdir /s /q "apps\web\node_modules"
)
if exist "node_modules" (
    echo Removing root node_modules...
    rmdir /s /q "node_modules"
)
echo ✅ Cleanup completed
echo.

echo 🔧 Clearing npm cache...
call npm cache clean --force
echo ✅ Cache cleared
echo.

echo 📦 Installing Backend Dependencies...
cd apps\api
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Backend installation failed
    echo Trying alternative method...
    call npm install --force
    if errorlevel 1 (
        echo ❌ Backend installation failed completely
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies installed
echo.

echo 📦 Installing Frontend Dependencies...
cd ..\web
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Frontend installation failed
    echo Trying alternative method...
    call npm install --force
    if errorlevel 1 (
        echo ❌ Frontend installation failed completely
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies installed
echo.

echo 🚀 Starting Backend Server...
start "TravelCircles API" cmd /k "cd /d %CD%\..\api && npm run dev"
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 🚀 Starting Frontend Server...
start "TravelCircles Web" cmd /k "npm run dev"

echo.
echo ========================================
echo 🎉 TravelCircles Platform Started!
echo ========================================
echo.
echo 🔗 Web Application: http://localhost:3000
echo 🔗 API Server: http://localhost:3001
echo.
echo Both applications are starting in separate windows.
echo Wait a few moments for them to fully load.
echo.
echo Test Accounts:
echo User: john@example.com / password123
echo Admin: admin@travelcircles.com / admin123
echo.
pause
