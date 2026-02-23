#!/bin/bash

# Event Photo Gallery - Local Development Setup Script
# Initializes both frontend and backend for local testing

set -e

echo "🚀 Event Photo Gallery - Development Setup"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python3 not found. Please install Python 3.8+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
echo -e "${GREEN}✓ Python version: $(python3 --version)${NC}"

# Frontend setup
echo -e "\n${BLUE}Setting up frontend...${NC}"
cd event-gallery
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Backend setup
echo -e "\n${BLUE}Setting up backend...${NC}"
cd ../backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Check GCS setup
echo -e "\n${BLUE}Checking GCS setup...${NC}"
if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    echo -e "${YELLOW}⚠ GOOGLE_APPLICATION_CREDENTIALS not set${NC}"
    echo "Set it with: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json"
else
    echo -e "${GREEN}✓ GCS credentials configured${NC}"
fi

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. (Optional) Set GCS credentials if needed"
echo "2. Start backend: cd backend && python main.py"
echo "3. Index photos: cd backend && python index_photos.py demo-event-1"
echo "4. Start frontend: cd event-gallery && npm run dev"
echo "5. Visit: http://localhost:3000"
