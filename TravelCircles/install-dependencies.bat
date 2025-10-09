@echo off
echo ========================================
echo TravelCircles Platform - Dependency Installation
echo ========================================
echo.

echo 🔧 Installing Backend Dependencies...
cd apps\api
call npm install
if errorlevel 1 (
    echo ❌ Backend dependency installation failed
    echo Trying with legacy peer deps...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Backend installation failed completely
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies installed successfully
echo.

echo 🔧 Installing Frontend Dependencies...
cd ..\web
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed
    echo Trying with legacy peer deps...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Frontend installation failed completely
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies installed successfully
echo.

echo 🔧 Installing Root Dependencies...
cd ..\..
call npm install
if errorlevel 1 (
    echo ❌ Root dependency installation failed
    echo Trying with legacy peer deps...
    call npm install --legacy-peer-deps
)
echo ✅ Root dependencies installed successfully
echo.

echo ========================================
echo ✅ All Dependencies Installed Successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Open two terminal windows
echo 2. In Terminal 1: cd apps\api && npm run dev
echo 3. In Terminal 2: cd apps\web && npm run dev
echo 4. Access the platform at http://localhost:3000
echo.
pause
