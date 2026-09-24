# 🚀 Gym Management Platform - Production Deployment Guide for Render.com

This guide provides end-to-end instructions for deploying this Freelance-Ready MERN Gym Management System to **Render.com** with **Google Sign-In**, **Real-Time Gmail OTP Password Reset**, and **Cloud MongoDB Atlas**.

---

## 🏗️ Deployment Architecture
- **Unified Single-Service Deployment**: Express backend directly builds and serves the optimized React production bundle from `gms-frontened/build`.
- **Zero CORS Issues**: Frontend and backend share the exact same origin URL (`/api`), eliminating cross-origin errors.
- **Cost Effective**: Runs completely within Render's free tier.

---

## 📋 Required Environment Variables on Render
Set these in your **Render Web Service Dashboard** under **Environment** (or automatically via `render.yaml`):

| Variable Name | Value / Format | Purpose |
| :--- | :--- | :--- |
| `NODE_VERSION` | `20.18.0` | Node.js runtime version |
| `NODE_ENV` | `production` | Production environment flag |
| `CI` | `false` | Prevents lint warnings from stopping build |
| `MONGODB_URI` (or `MONGO_URI`) | `mongodb+srv://sadhanamarendra12_db_user:UjUvcauHIlr9k3WO@cluster0.b96elmj.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0` | Cloud MongoDB Atlas connection string (auto-namespaced to `gym_management`) |
| `EMAIL_USER` | `sadhanamarendra12@gmail.com` | Gmail account used for dispatching OTPs |
| `EMAIL_PASS` | `ooer pznc ydfz iwvr` | 16-character Google App Password |

---

## 🛠️ Step 1: Verified MongoDB Atlas Cloud Database
Your MongoDB Atlas cluster has already been verified and connected:
```
mongodb+srv://sadhanamarendra12_db_user:UjUvcauHIlr9k3WO@cluster0.b96elmj.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0
```
> **Note on Database Isolation:** Notice `/gym_management` is specified in the URI. This ensures that this Gym Management System operates within its own dedicated database (`gym_management`) and never interferes with your other projects (e.g. `grs`) hosted on the same cluster!


---

## 🛠️ Step 2: Push Project to GitHub
Open your terminal in the project root directory (`f:\dp\gym management`) and run:

```bash
# 1. Initialize git
git init

# 2. Add all files (our root .gitignore will automatically protect your .env and node_modules)
git add .

# 3. Commit files
git commit -m "feat: complete freelance-ready gym management with Google sign-in, email OTP, and Render config"

# 4. Set default branch to main
git branch -M main

# 5. Connect to your GitHub repository
git remote add origin https://github.com/arpitrai38/gms-frontened.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🛠️ Step 3: Deploy on Render.com

### Option A: Using the Render Blueprint (`render.yaml`) - Recommended
1. Log in to [Render.com](https://render.com).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will read `render.yaml` automatically and configure:
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
5. Fill in the values for `MONGODB_URI`, `EMAIL_USER`, and `EMAIL_PASS` when prompted.
6. Click **Apply**.

### Option B: Manual Web Service
1. Click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name**: `gym-management-platform`
   - **Runtime**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `NODE_VERSION`: `20.18.0`
   - `CI`: `false`
   - `NODE_ENV`: `production`
   - `MONGODB_URI` (or `MONGO_URI`): `mongodb+srv://sadhanamarendra12_db_user:UjUvcauHIlr9k3WO@cluster0.b96elmj.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0`
   - `EMAIL_USER`: `sadhanamarendra12@gmail.com`
   - `EMAIL_PASS`: `ooer pznc ydfz iwvr`
5. Click **Create Web Service**.

---

## 🔐 Google Sign-In & OTP Features for Real-World Clients

### 1. Universal Google Sign-In / Auto-Registration
- **Admin**: Signing in with a new Google email provisions a fresh gym workspace with 4 membership starter packages.
- **Trainer**: Signing in with a Google email registers them as a Coach/Trainer linked to the gym.
- **Member**: Signing in with a Google email registers them as an Active Member with membership plan and profile.

### 2. Forgot Password / OTP Flow
- Users can click **Forgot Password?** on the login screen, enter their Google email, and choose their role.
- An authentic 6-digit OTP code is sent in real-time to their Google inbox via Gmail SMTP.
- Entering the OTP allows the user to set a custom password.
- Once set, they can log in via Google One-Click OR using their Google email and new password.

### 3. Change Password from Profile
- Any logged-in Admin, Trainer, or Member can open their Profile settings.
- Select the **Password** tab → choose **📧 Google / Email OTP**.
- Click **Send OTP to my Email**, enter the 6-digit code from their inbox, and update their password instantly.
