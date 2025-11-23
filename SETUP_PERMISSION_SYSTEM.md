# Setting Up the 4-Tier Permission System

## 🎯 Overview

This guide will help you set up the complete 4-tier role system with infinite scalability.

---

## Step 1: Run the SQL Migration

Go to your **Neon Database Dashboard** → **SQL Editor** and run the migration file:

```bash
# Location: db/migrations/001_add_permission_system.sql
```

Or copy and paste the entire contents of that file into the Neon SQL Editor and click "Run".

This will create:
- ✅ **6 new tables** (institutions, user_roles, permissions, institution_features, class_features, data_items)
- ✅ **20 default permissions**
- ✅ **1 default institution** (for existing data)
- ✅ **Performance indexes**

---

## Step 2: Assign Roles to Existing Users

After migration, assign roles to your test users:

```sql
-- Make admin@spulms.com a DEVELOPER (platform owner)
INSERT INTO user_roles (user_id, role, is_primary)
SELECT id, 'developer', true
FROM users
WHERE email = 'admin@spulms.com'
ON CONFLICT DO NOTHING;

-- Make teacher@spu.edu a TEACHER (with default institution)
INSERT INTO user_roles (user_id, role, institution_id, is_primary)
SELECT u.id, 'teacher', i.id, true
FROM users u, institutions i
WHERE u.email = 'teacher@spu.edu' AND i.name = 'Default Institution'
ON CONFLICT DO NOTHING;

-- Make students STUDENTS (with default institution)
INSERT INTO user_roles (user_id, role, institution_id, is_primary)
SELECT u.id, 'student', i.id, true
FROM users u, institutions i
WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com')
AND i.name = 'Default Institution'
ON CONFLICT DO NOTHING;
```

---

## Step 3: Enable Features Globally

Enable the 12 advanced features at the platform level:

```sql
-- Enable all features globally (Developer can toggle these)
UPDATE feature_toggles
SET enabled_globally = true, enabled_by_default = true
WHERE name IN (
  'spaced_repetition',
  'learning_streak',
  'progress_viz',
  'peer_learning',
  'ar_identification',
  'vr_simulations',
  'real_time_collab',
  'smart_assessment',
  'multi_tenant',
  'scorm_xapi',
  'advanced_analytics',
  'api_integration'
);
```

---

## Step 4: Test the Dashboards

After deployment, test each role:

### Developer
- **URL**: https://medicalknowledgeflower.vercel.app/developer
- **Login**: admin@spulms.com / admin123
- **Should see**: Platform analytics, subscription tier management, global feature toggles

### Admin
- **URL**: https://medicalknowledgeflower.vercel.app/admin
- **Login**: (create admin user or assign admin role to existing user)
- **Should see**: Student management, payment processing, institution feature toggles

### Teacher
- **URL**: https://medicalknowledgeflower.vercel.app/teacher
- **Login**: teacher@spu.edu / password123
- **Should see**: Class management, student progress, class feature toggles

### Student
- **URL**: https://medicalknowledgeflower.vercel.app/
- **Login**: john.doe@example.com / password123
- **Should see**: Learning dashboard, materials, progress tracking

---

## 📊 How the Permission System Works

### Hierarchical Feature Checking

Features are checked in this order:

1. **Global** - Is the feature enabled by the Developer?
2. **Tier** - Does the institution's subscription tier include this feature?
3. **Institution** - Did the Admin override this feature for their institution?
4. **Class** - Did the Teacher override this feature for their class?
5. **Default** - Fall back to the feature's default setting

### Example

If a teacher wants to use "AR Instrument Identification":
1. Developer must enable it globally ✅
2. Institution must be on "Enterprise" tier ✅
3. Admin must not have disabled it for the institution ✅
4. Teacher can enable/disable it for their specific class ✅

---

## ✅ Benefits

1. **No More Database Changes** - Add any data via `data_items` table with JSONB
2. **Flexible Permissions** - Override at any level
3. **Multi-Role Support** - Users can have multiple roles (teacher + admin)
4. **Scalable** - Handles unlimited institutions, classes, features
5. **Business Ready** - Built-in subscription tiers and payment tracking

---

## 🚀 Next Steps

After running this setup:
1. Build the 4 separate dashboard UIs
2. Add permission checking to all API endpoints
3. Test every button in every dashboard
4. Configure your institution's features
5. Invite teachers and students

---

**You now have an infinitely scalable, permission-based LMS!** 🎉
