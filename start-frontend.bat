@echo off
echo ========================================
echo   RoomSync - Starting Frontend Server
echo ========================================
echo.

cd "c:\Users\Ovais\Downloads\RoomSync Frontend main\RoomSync..-main"

echo Checking for node_modules...
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    echo.
    echo Dependencies installed!
    echo.
)

echo Starting React development server on http://localhost:3000
echo.
echo The browser will open automatically
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
