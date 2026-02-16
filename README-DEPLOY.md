# RoomSync - 2-Step Deployment Guide (Easiest Method)

I have fixed the code so you can deploy your project in two simple parts.

## Part 1: Backend & Database (on Railway)
1. Go to **[Railway.app](https://railway.app/)**.
2. Create a **New Project** → **GitHub Repo** → Select `RoomSyncc`.
3. Railway will now find the `Dockerfile` I added and build your **Backend**.
4. **Add Database**: 
   - Click **"New"** → **"Database"** → **"Add PostgreSQL"**.
   - Railway will automatically connect it.
5. **Add Environment Variables**:
   - Click on the **backend/service** → **Variables**.
   - Add `SECRET_KEY` = (any random text).
   - Add `DEBUG` = `False`.

## Part 2: Frontend (on Vercel)
1. Go to **[Vercel.com](https://vercel.com/)**.
2. Click **"Add New"** → **"Project"** → Select `RoomSyncc`.
3. **CRITICAL STEP**: On the "Import Project" screen, look for **"Root Directory"**.
4. Click **"Edit"** and select the `frontend` folder.
5. **Add API URL**:
   - Under **"Environment Variables"**, add:
     - `REACT_APP_API_URL` = (The URL Railway gave you for the backend).
6. Click **"Deploy"**.

---

### **Why this works?**
- **Railway** is great for Python/Django and Databases.
- **Vercel** is the fastest and easiest for React Frontends.
- I've already updated the code to make sure they talk to each other correctly!
