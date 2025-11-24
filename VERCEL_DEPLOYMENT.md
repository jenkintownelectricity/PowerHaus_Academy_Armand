# 🚀 PowerHaus Academy - Vercel Deployment Guide

## ⚠️ Current Issue: 500 Server Error

You're getting 500 errors because environment variables aren't set correctly in Vercel.

---

## ✅ Fix: Set Environment Variables (CRITICAL!)

### Step 1: Go to Vercel Dashboard

1. Open your project: https://vercel.com/your-username/power-haus-academy-armand
2. Click **Settings** tab
3. Click **Environment Variables** in the left sidebar

### Step 2: Add These Variables

Add **BOTH** of these variables:

#### Variable 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:**
  ```
  postgresql://postgres:admin123@db.aedmsxvhvroqvkobjkgr.supabase.co:5432/postgres
  ```
- **Environments:** Check **ALL THREE** boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 2: SESSION_SECRET
- **Key:** `SESSION_SECRET`
- **Value:**
  ```
  powerhaus_academy_secret_key_2024_change_this_in_production
  ```
- **Environments:** Check **ALL THREE** boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

### Step 3: Redeploy

**After saving both variables:**

1. Go to **Deployments** tab
2. Click your latest deployment
3. Click **"..."** menu (three dots)
4. Click **"Redeploy"**
5. **UNCHECK** "Use existing Build Cache"
6. Click **"Redeploy"** button
7. Wait 1-2 minutes

---

## 🧪 Test After Redeployment

### Test 1: Check API Health
Open this URL:
```
https://power-haus-academy-armand.vercel.app/api/auth/me
```

**Expected Response:**
```json
{"user":null}
```

If you see this ✅ - API is working!

### Test 2: Try Login
Go to: `https://power-haus-academy-armand.vercel.app/`

Login with:
- **Email:** `admin@powerhaus.com`
- **Password:** `admin123`

**Should redirect to dashboard!** 🎉

---

## 🐛 If Still Getting Errors

### Check Runtime Logs:
1. Go to Vercel **Deployments**
2. Click your latest deployment
3. Click **"Runtime Logs"** tab
4. Try to log in
5. **Screenshot any errors** and send them

### Common Issues:

**"Database connection error"**
- DATABASE_URL is wrong or not set
- Supabase might be paused (go to Supabase and check)

**"Session error"**
- SESSION_SECRET is not set
- Clear browser cookies and try again

**"CORS error"**
- This is normal, the backend handles it

---

## 📊 How Serverless Works on Vercel

Your backend runs as **serverless functions**:
- `/api/index.js` = Main API handler
- Runs on-demand (cold start ~1-2 seconds first time)
- No persistent memory between requests
- Sessions stored in cookies (signed with SESSION_SECRET)

**This is why environment variables are CRITICAL!**

---

## ✅ Final Checklist

- [ ] DATABASE_URL set in Vercel (Production + Preview + Development)
- [ ] SESSION_SECRET set in Vercel (Production + Preview + Development)
- [ ] Redeployed with cache cleared
- [ ] `/api/auth/me` returns `{"user":null}`
- [ ] Can log in successfully

Once all checked, PowerHaus Academy is LIVE! 🚀

---

## 🔐 Test Accounts

After successful deployment:

**Admin:**
- Email: `admin@powerhaus.com`
- Password: `admin123`

**Student:**
- Email: `user@powerhaus.com`
- Password: `user123`

**Coach:**
- Email: `coach@powerhaus.com`
- Password: `coach123`
