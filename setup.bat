@echo off
REM Event Photo Gallery - Windows Local Development Setup Script

echo.
echo ============================================
echo Event Photo Gallery - Development Setup
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found. Please install Python 3.8+
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo [OK] Python version:
python --version

REM Frontend setup
echo.
echo Setting up frontend...
cd event-gallery
call npm install
echo [OK] Frontend dependencies installed

REM Backend setup
echo.
echo Setting up backend...
cd ..\backend

if not exist "venv" (
    python -m venv venv
)

call venv\Scripts\activate.bat

python -m pip install --upgrade pip
pip install -r requirements.txt
echo [OK] Backend dependencies installed

echo.
echo ============================================
echo [SUCCESS] Setup complete!
echo ============================================
echo.
echo Next steps:
echo 1. Start backend:  cd backend ^&^& python main.py
echo 2. Index photos:   cd backend ^&^& python index_photos.py demo-event-1
echo 3. Start frontend: cd event-gallery ^&^& npm run dev
echo 4. Visit: http://localhost:3000
