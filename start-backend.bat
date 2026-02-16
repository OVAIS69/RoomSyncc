@echo off
echo ========================================
echo   RoomSync - Starting Backend Server
echo ========================================
echo.

cd "c:\Users\Ovais\Downloads\RoomSync Frontend main\backend\room_booking_system"

echo Starting Django server on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver

pause
