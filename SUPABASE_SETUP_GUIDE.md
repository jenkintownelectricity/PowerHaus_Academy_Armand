# 🚀 PowerHaus Academy - Supabase Setup Guide

## Quick Setup (5 minutes)

### Step 1: Run Database Schema

1. Open your **Supabase Dashboard** → Your Project
2. Click **SQL Editor** in the left sidebar
3. Click **"+ New Query"**
4. Copy the **entire contents** of `drizzle/0000_fantastic_spencer_smythe.sql`
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. ✅ You should see: "Success. No rows returned"

### Step 2: Seed Test Data

1. In the same **SQL Editor**, click **"+ New Query"** again
2. Copy the **entire contents** of `supabase-setup.sql`
3. Paste into the SQL Editor
4. Click **"Run"**
5. ✅ You should see: "Success" with row counts

### Step 3: Start Your App Locally

```bash
npm run dev
```

### Step 4: Log In! 🎉

Open `http://localhost:5000` and log in with:

**Admin Account:**
- Email: `admin@powerhaus.com`
- Password: `admin123`

**Student Account:**
- Email: `user@powerhaus.com`
- Password: `user123`

**Coach Account:**
- Email: `coach@powerhaus.com`
- Password: `coach123`

---

## What You Get

✅ **6 Pillars Dashboard** - Track progress across Digital Media curriculum
✅ **Video Library** - Educational content for each pillar
✅ **Programs** - Structured learning paths
✅ **Admin Panel** - Manage submissions and students
✅ **Badge System** - Gamified achievements
✅ **Portfolio Building** - Showcase student work
✅ **Community** - Discussions and blog posts
✅ **Custom Logo** - Your PowerHaus logo in the sidebar

---

## Troubleshooting

**"Error: relation does not exist"**
- Make sure you ran Step 1 (schema creation) first

**"Duplicate key value"**
- This is normal if re-running seed data - it's ignoring duplicates

**Can't connect to database**
- Check your `.env` file has the correct `DATABASE_URL`
- Make sure your Supabase project is active (not paused)

---

## Deploy to Vercel (Optional)

Once everything works locally:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables (copy from `.env`)
4. Deploy! 🚀

Your database is already set up - Vercel will connect to the same Supabase instance.

---

**Need help?** Check the main README.md for full documentation.
