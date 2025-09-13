@echo off
echo ========================================
echo Student Productivity Dashboard Setup
echo Next.js Version
echo ========================================
echo.

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Next.js client dependencies...
cd nextjs-client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install Next.js client dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo Setting up environment files...
if not exist .env (
    copy .env.example .env
    echo Backend .env file created from example
)

if not exist nextjs-client\.env (
    copy nextjs-client\.env.example nextjs-client\.env
    echo Next.js client .env file created from example
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your .env files with your MongoDB URI and other settings
echo 2. Configure nextjs-client\.env with your API URL
echo 3. Start the application with: npm run dev-nextjs
echo.
echo Development URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo.
echo For production deployment, see NEXTJS_DEPLOYMENT_GUIDE.md
echo.
pause