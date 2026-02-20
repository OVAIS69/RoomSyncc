FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copy requirements from the backend folder
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ .

# Move into the Django project directory where manage.py is
WORKDIR /app/room_booking_system

# Run the server on port 8000
# Run migrations, flush existing data (to avoid conflicts), load initial data, collect static files, then start the server
CMD sh -c "python manage.py migrate && python manage.py flush --no-input && python manage.py loaddata ../initial_data.json && python manage.py collectstatic --noinput && gunicorn --bind 0.0.0.0:8000 room_booking_system.wsgi:application"
