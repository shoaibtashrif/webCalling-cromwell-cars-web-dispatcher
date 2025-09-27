#!/bin/bash

echo "🚀 Starting Cromwell Cars Web Interface..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your ULTRAVOX_API_KEY"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

echo "🔄 Checking ngrok URL..."
cd ../..
./update-ngrok-url.sh
cd web/nextjs-ts

echo ""
echo "🌐 Starting development server..."
echo "📍 Web interface will be available at: http://localhost:3000"
echo "🔍 For debugging, use: http://localhost:3000?showDebugMessages=true&showUserTranscripts=true"
echo "🎯 Make sure your backend server is running!"
echo ""

pnpm dev