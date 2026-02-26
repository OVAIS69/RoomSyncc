# RoomSync - Render + Vercel Deployment Guide

Since Render is working for your backend, here are the steps to finalize everything and get the frontend live on Vercel.

## Part 1: Detailed Render Setup (Backend & Database)

### **Step A: Create the Database**
1. Log in to [Render.com](https://dashboard.render.com).
2. Click **"New +"** (top right) → **"Postgres"**.
3. Name it `roomsync-db`.
4. Click **"Create Database"**.
5. **Wait** for it to become "Available".
6. Scroll down to the **"Connections"** section and find these details (Keep this tab open):
   - **Internal Database URL** (e.g., `postgres://user:pass@host:port/db`)
   - Or the individual: `Database`, `User`, `Host`, `Password`.

### **Step B: Create the Web Service**
1. Click **"New +"** → **"Web Service"**.
2. Select your GitHub repository: `RoomSyncc`.
3. **Runtime**: Select **"Docker"**. (Render will automatically use the `Dockerfile` I added).
4. **Name**: `roomsync-backend`.
5. **Build Command**: (If requested) Use:
   ```bash
   pip install -r backend/requirements.txt && python backend/room_booking_system/manage.py migrate && python backend/room_booking_system/manage.py collectstatic --noinput
   ```
6. Scroll down to **"Advanced"** → **"Add Environment Variable"**.
7. **Add these Variables** (Copy values from your Database tab):
   - `DB_NAME` = (Your Database name)
   - `DB_USER` = (Your Database user)
   - `DB_PASSWORD` = (Your Database password)
   - `DB_HOST` = (Your Database host)
   - `DB_PORT` = `5432`
   - `SECRET_KEY` = (Type any random 30+ characters)
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `*`
7. Click **"Create Web Service"**.

### **Step C: Confirm Link**
1. Once it says "Live", copy your Web Service URL (e.g., `https://roomsync-backend.onrender.com`).
2. **This is your Backend URL** for Part 2!

## Part 2: Deploy Frontend (Vercel)
1. Go to **[Vercel.com](https://vercel.com/)**.
2. Click **"Add New"** → **"Project"** → Select `RoomSyncc`.
3. **Root Directory**: Click "Edit" and select the **`frontend`** folder.
4. **Environment Variables**: Add one variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: (Your Render Backend URL from Part 1)
5. Click **"Deploy"**.

## Part 3: Final Security (CORS)
Once Vercel gives you a link (e.g., `https://roomsync-frontend.vercel.app`):
1. Go back to your **Render Backend** settings.
2. In the **Environment** variables, add:
   - `CORS_ALLOWED_ORIGINS` = `https://roomsync-frontend.vercel.app`
   - `CSRF_TRUSTED_ORIGINS` = `https://roomsync-frontend.vercel.app`
3. Save and let Render redeploy.

---
### **Done!**
Your app will now be fully functional with the frontend on Vercel talking to the backend on Render.
