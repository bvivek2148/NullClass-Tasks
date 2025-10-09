# TravelCircles Platform Startup Script (PowerShell)
Write-Host "🚀 Starting TravelCircles Platform..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Function to install dependencies
function Install-Dependencies {
    param($Path, $Name)
    
    Write-Host "📦 Installing $Name dependencies..." -ForegroundColor Blue
    Push-Location $Path
    
    try {
        npm install
        Write-Host "✅ $Name dependencies installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install $Name dependencies" -ForegroundColor Red
        Pop-Location
        return $false
    }
    
    Pop-Location
    return $true
}

# Install API dependencies
if (-not (Install-Dependencies "apps\api" "API")) {
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Web dependencies
if (-not (Install-Dependencies "apps\web" "Web")) {
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up environment files..." -ForegroundColor Blue

# Check and create environment files
if (-not (Test-Path "apps\api\.env")) {
    Copy-Item "apps\api\.env.example" "apps\api\.env"
    Write-Host "✅ Created API .env file" -ForegroundColor Green
}

if (-not (Test-Path "apps\web\.env.local")) {
    Copy-Item "apps\web\.env.example" "apps\web\.env.local"
    Write-Host "✅ Created Web .env.local file" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting TravelCircles Platform..." -ForegroundColor Green
Write-Host ""

# Start API server
Write-Host "Starting API server..." -ForegroundColor Blue
$apiJob = Start-Job -ScriptBlock {
    Set-Location "apps\api"
    npm run dev
}

# Wait a moment for API to start
Start-Sleep -Seconds 3

# Start Web application
Write-Host "Starting Web application..." -ForegroundColor Blue
$webJob = Start-Job -ScriptBlock {
    Set-Location "apps\web"
    npm run dev
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🎉 TravelCircles Platform is starting!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 API Server: http://localhost:3001" -ForegroundColor Yellow
Write-Host "🔗 Web Application: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 API Job ID: $($apiJob.Id)" -ForegroundColor Gray
Write-Host "📊 Web Job ID: $($webJob.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop the platform, close this window or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Function to cleanup jobs on exit
function Stop-Platform {
    Write-Host ""
    Write-Host "🛑 Stopping TravelCircles Platform..." -ForegroundColor Red
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    Stop-Job $webJob -ErrorAction SilentlyContinue
    Remove-Job $apiJob -ErrorAction SilentlyContinue
    Remove-Job $webJob -ErrorAction SilentlyContinue
    Write-Host "✅ Platform stopped successfully" -ForegroundColor Green
}

# Set up cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action { Stop-Platform }

# Monitor jobs and wait
try {
    while ($true) {
        # Check if jobs are still running
        if ($apiJob.State -eq "Failed") {
            Write-Host "❌ API server failed to start" -ForegroundColor Red
            Receive-Job $apiJob
            break
        }
        
        if ($webJob.State -eq "Failed") {
            Write-Host "❌ Web application failed to start" -ForegroundColor Red
            Receive-Job $webJob
            break
        }
        
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host "Interrupted by user" -ForegroundColor Yellow
} finally {
    Stop-Platform
}
