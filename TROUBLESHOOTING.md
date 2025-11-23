# Troubleshooting Guide

## "Unexpected token 'A', ... is not valid JSON" Error

This error occurs when the API returns plain text instead of JSON. Here's how to fix it:

### 1. Check Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and ensure these are set:

**Required:**
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `SESSION_SECRET` - Any random string (e.g., `your-secret-key-change-in-production`)

**Optional:**
- `ANTHROPIC_API_KEY` - For AI assistant features
- `STRIPE_SECRET_KEY` - For payment processing
- `VITE_STRIPE_PUBLIC_KEY` - For frontend Stripe integration

### 2. Verify Database Connection

Visit your health check endpoint:
```
https://YOUR-APP.vercel.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "SPU LMS API is running",
  "database": "connected",
  "env": {
    "hasDatabaseUrl": true,
    "hasSessionSecret": true
  }
}
```

If you see errors:
- `database: "disconnected"` → DATABASE_URL is not set
- `database: "error"` → Database connection failed (check Neon)
- `hasDatabaseUrl: false` → Add DATABASE_URL to Vercel

### 3. Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Runtime Logs" tab
4. Look for errors like:
   - `ERROR: DATABASE_URL environment variable is not set!`
   - `Database connection error: ...`
   - Any SQL errors

### 4. Common Issues & Solutions

#### Issue: DATABASE_URL not set
**Solution:**
1. Get your Neon connection string from https://console.neon.tech
2. Add it to Vercel: Settings → Environment Variables → Add
3. Redeploy your app

#### Issue: Users table doesn't exist
**Solution:**
1. Go to Neon SQL Editor
2. Run the setup script: `db/NEON_SETUP_COMPLETE.sql`
3. Then run seed data: `db/seed_data.sql` or `db/seed_test_users.sql`

#### Issue: Serverless function timeout
**Solution:**
- Check database connection settings (should have `max: 1` for serverless)
- Ensure Neon database is not sleeping (upgrade to paid plan if needed)

#### Issue: CORS errors
**Solution:**
- Environment variables need to be set in Vercel
- Redeploy after adding variables

### 5. Test Login Credentials

After fixing the database connection, try these test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@spulms.com | admin123 | Admin |
| teacher@example.com | teacher123 | Teacher |
| student@example.com | student123 | Student |
| john.doe@example.com | student123 | Student |

### 6. Quick Fix Checklist

- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] SESSION_SECRET is set in Vercel environment variables
- [ ] Latest code is deployed to Vercel
- [ ] Database tables exist (run setup SQL)
- [ ] Test users exist (run seed SQL)
- [ ] `/api/health` returns `status: "ok"`
- [ ] Vercel logs show no errors

### 7. Still Not Working?

1. **Check Neon Database:**
   - Is it active? (Not sleeping)
   - Can you connect from Neon SQL Editor?
   - Do the tables exist? Run `SELECT * FROM users;`

2. **Redeploy to Vercel:**
   ```bash
   git add .
   git commit -m "fix: add error handling and diagnostics"
   git push -u origin claude/review-test-suite-01Bqy9yf3FwjejAeBaSM3N9y
   ```

3. **Check build logs:**
   - Go to Vercel → Deployments → Click deployment
   - Look for build errors

4. **Force a fresh deployment:**
   - Go to Vercel → Deployments
   - Find latest → Three dots menu → Redeploy

### 8. Getting More Information

To see the exact error message:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Click on the failed request (`/api/auth/login`)
5. Look at the Response tab
6. Share the full error message

The error message will tell you exactly what's wrong:
- "Database not initialized" → DATABASE_URL missing
- "Database connection failed" → Can't connect to Neon
- "User not found" → Tables not seeded
- HTML error page → Vercel function crashed
