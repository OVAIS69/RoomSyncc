# RoomSync Deployment Guide

This guide will help you deploy the RoomSync application to a production server (VPS) using Docker Compose.

## Prerequisites
- A VPS (e.g., DigitalOcean, AWS EC2, Linode) running Ubuntu 22.04 or later.
- Docker and Docker Compose installed on the server.
- A domain name (optional but recommended for SSL).

## Step 1: Prepare the Server
Update your server and install Docker:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
```

## Step 2: Clone the Repository
```bash
git clone https://github.com/OVAIS69/RoomSyncc.git
cd RoomSyncc
```

## Step 3: Create Environment Variables
Create a `.env` file in the root directory to store your production secrets:
```bash
nano .env
```
Add the following content (customize as needed):
```env
# Backend Settings
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,your-vps-ip
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,http://your-vps-ip:8000
CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://your-vps-ip

# Database Settings
DB_NAME=roomsync_db
DB_USER=roomsync_user
DB_PASSWORD=your-secure-db-password

# Frontend Settings
REACT_APP_API_URL=https://yourdomain.com
```

## Step 4: Deploy
Run the application using Docker Compose:
```bash
docker-compose up -d --build
```
This will:
1. Start the PostgreSQL database.
2. Build and start the Django backend (running migrations automatically).
3. Build and start the React frontend (served via Nginx).

## Step 5: Access the Application
- Frontend: `http://your-vps-ip`
- Backend API: `http://your-vps-ip:8000/api`

## Step 6: SSL (Recommended)
Use **Certbot** with Nginx to enable HTTPS. You can modify the `nginx.conf` in the frontend folder or set up a reverse proxy on the host machine.

---
**Note**: If you want a simpler deployment, you can use [Railway.app](https://railway.app/). Just link your GitHub repo, and it will automatically detect the `docker-compose.yml` and deploy everything for you!
