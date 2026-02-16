@echo off
echo ========================================
echo   RoomSync - Starting Full Application
echo ========================================
echo.
echo This will start both Backend and Frontend servers
echo.

echo Starting Backend Server...
start "RoomSync Backend" cmd /k "cd /d "c:\Users\Ovais\Downloads\RoomSync Frontend main\RoomSync Backend main\room_booking_system" && python manage.py runserver"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "RoomSync Frontend" cmd /k "cd /d "c:\Users\Ovais\Downloads\RoomSync Frontend main\RoomSync..-main" && (if not exist node_modules\ npm install) && npm start"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Two command windows will open:
echo   1. Backend Server (Django)
echo   2. Frontend Server (React)
echo.
echo Close those windows to stop the servers
echo.

pause
