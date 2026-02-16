# RoomSync - Render + Vercel Deployment Guide

Since Render is working for your backend, here are the steps to finalize everything and get the frontend live on Vercel.

## Part 1: Finalize Render (Backend)
1. Ensure your **Render Web Service** is connected to your GitHub repo.
2. In Render, go to **Environment** and ensure these are set:
   - `SECRET_KEY` = (any random string)
   - `DEBUG` = `False`
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` (Get these from your Render PostgreSQL instance).
3. **Copy your Render URL**: It will look like `https://roomsync-backend.onrender.com`.

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
