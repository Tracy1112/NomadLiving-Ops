#!/bin/bash

echo "🚀 Nomad Ops Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Server dependencies installed"
else
    echo "✅ Server dependencies already installed"
fi

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Client dependencies installed"
else
    echo "✅ Client dependencies already installed"
fi

# Check for .env file
echo ""
cd ../server
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env file from template..."
    cat > .env << 'ENVEOF'
NODE_ENV=development
PORT=5100
MONGO_URL=mongodb://localhost:27017/nomadops
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ENVEOF
    echo "✅ .env file created"
    echo "⚠️  Please update MONGO_URL in server/.env with your MongoDB connection string"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your MongoDB connection string"
echo "2. Start MongoDB (if using local)"
echo "3. Run: cd server && npm run dev"
echo ""
