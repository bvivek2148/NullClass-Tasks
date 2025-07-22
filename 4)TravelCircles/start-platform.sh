#!/bin/bash

echo "Starting TravelCircles Platform..."
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install API dependencies
echo "📦 Installing API dependencies..."
cd apps/api
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install API dependencies"
    exit 1
fi

# Install Web dependencies
echo "📦 Installing Web dependencies..."
cd ../web
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Web dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Create environment files if they don't exist
echo "🔧 Setting up environment files..."

# API environment
if [ ! -f "../api/.env" ]; then
    echo "Creating API .env file..."
    cp ../api/.env.example ../api/.env
    echo "⚠️  Please update apps/api/.env with your actual configuration values"
fi

# Web environment
if [ ! -f ".env.local" ]; then
    echo "Creating Web .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please update apps/web/.env.local with your actual configuration values"
fi

echo ""
echo "🚀 Starting TravelCircles Platform..."
echo ""

# Start API server in background
echo "Starting API server..."
cd ../api
npm run dev &
API_PID=$!

# Wait a moment for API to start
sleep 3

# Start Web application in background
echo "Starting Web application..."
cd ../web
npm run dev &
WEB_PID=$!

echo ""
echo "========================================="
echo "🎉 TravelCircles Platform is running!"
echo "========================================="
echo ""
echo "🔗 API Server: http://localhost:3001"
echo "🔗 Web Application: http://localhost:3000"
echo ""
echo "📊 API Process ID: $API_PID"
echo "📊 Web Process ID: $WEB_PID"
echo ""
echo "To stop the platform:"
echo "  kill $API_PID $WEB_PID"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping TravelCircles Platform..."
    kill $API_PID $WEB_PID 2>/dev/null
    echo "✅ Platform stopped successfully"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for both processes
wait
