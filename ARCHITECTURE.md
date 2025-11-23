# SPU LMS - Complete Architecture & Permission System

## 🎯 Vision

A scalable, infinitely flexible LMS with 4 distinct role dashboards and toggle-based permissions that never requires database schema changes.

---

## 👥 Four-Tier Role System

### 1. **Developer** (Platform Owner)
**Who:** You, the platform creator
**Access:** `/developer`
**Capabilities:**
- Manage subscription tiers (Free, Pro, Enterprise)
- Set global pricing
- Toggle features globally (enable/disable for all)
- View platform-wide analytics
- Configure system settings
- Manage feature categories

### 2. **Admin** (Business Owner)
**Who:** Institution running the training (hospital, university, company)
**Access:** `/admin`
**Capabilities:**
- Manage students (add, remove, view progress)
- Process payments from students
- Toggle features for their institution
- View institution analytics
- Manage teachers/instructors
- Configure institution settings
- View revenue reports

### 3. **Teacher** (Instructor)
**Who:** Person teaching the classes
**Access:** `/teacher`
**Capabilities:**
- Create and manage classes
- Toggle features per class
- View student progress in their classes
- Grade assessments
- Upload materials for their classes
- Host live sessions
- Manage class enrollment
- Configure class-specific settings

### 4. **Student** (Learner)
**Who:** Person taking the course
**Access:** `/` (home dashboard)
**Capabilities:**
- View assigned materials
- Take tests and quizzes
- Track own progress
- Participate in discussions
- Earn achievements
- View certifications
- Access enabled features only

---

## 🗄️ Scalable Database Architecture

### Core Principle: **Toggle Everything**

Instead of hardcoded columns, we use flexible JSONB fields and toggle tables.

### New Tables

```sql
-- Permissions are toggleable at multiple levels
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,  -- e.g., 'can_grade_tests', 'can_upload_materials'
  description TEXT,
  category TEXT,              -- 'student', 'teacher', 'admin', 'developer'
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Role assignments with toggle-based permissions
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  role TEXT NOT NULL,         -- 'student', 'teacher', 'admin', 'developer'
  institution_id INTEGER,     -- NULL for developers, required for admin/teacher
  permissions JSONB DEFAULT '{}',  -- Custom permissions override
  created_at TIMESTAMP DEFAULT NOW()
);

-- Institutions (hospitals, universities, companies)
CREATE TABLE institutions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subscription_tier TEXT,     -- 'free', 'pro', 'enterprise'
  features_enabled JSONB DEFAULT '{}',  -- Toggle features per institution
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feature toggles at multiple levels
CREATE TABLE feature_toggles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,              -- 'learning', 'immersive', 'enterprise', 'core'
  tier TEXT,                  -- 'free', 'pro', 'enterprise'
  impact TEXT,
  enabled_globally BOOLEAN DEFAULT false,  -- Developer toggle
  enabled_by_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feature overrides per institution
CREATE TABLE institution_features (
  id SERIAL PRIMARY KEY,
  institution_id INTEGER REFERENCES institutions(id),
  feature_id INTEGER REFERENCES feature_toggles(id),
  enabled BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(institution_id, feature_id)
);

-- Feature overrides per class
CREATE TABLE class_features (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id),
  feature_id INTEGER REFERENCES feature_toggles(id),
  enabled BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, feature_id)
);

-- Flexible data rows (for infinite scalability)
CREATE TABLE data_items (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,         -- 'material', 'assessment', 'announcement', etc.
  name TEXT NOT NULL,
  data JSONB NOT NULL,        -- All properties stored as JSON
  tags TEXT[],                -- For filtering
  owner_id INTEGER REFERENCES users(id),
  institution_id INTEGER REFERENCES institutions(id),
  class_id INTEGER,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Permission Checking Logic

### Hierarchical Permission System

```typescript
// Check if user can access a feature
function canAccess(user, feature, context?) {
  // 1. Check if feature is enabled globally (Developer level)
  if (!feature.enabled_globally) return false;

  // 2. Check subscription tier
  if (context?.institution) {
    const tier = context.institution.subscription_tier;
    if (!tierIncludes(tier, feature.tier)) return false;
  }

  // 3. Check institution override
  if (context?.institution) {
    const override = getInstitutionFeature(context.institution.id, feature.id);
    if (override !== null) return override.enabled;
  }

  // 4. Check class override
  if (context?.class) {
    const override = getClassFeature(context.class.id, feature.id);
    if (override !== null) return override.enabled;
  }

  // 5. Default to feature setting
  return feature.enabled_by_default;
}
```

---

## 🎨 Dashboard Structure

### Developer Dashboard (`/developer`)
**Components:**
- Global Feature Toggles (enable/disable for entire platform)
- Subscription Tier Management (pricing, limits)
- Platform Analytics (total users, revenue, usage)
- System Configuration
- Institution Management

### Admin Dashboard (`/admin`)
**Components:**
- Student Management (add, remove, view progress)
- Payment Processing (Stripe integration)
- Institution Feature Toggles (override global settings)
- Teacher Management
- Institution Analytics
- Revenue Reports

### Teacher Dashboard (`/teacher`)
**Components:**
- My Classes (create, edit, manage)
- Student Progress (for my classes)
- Class Feature Toggles (override institution settings)
- Material Upload (for my classes)
- Grade Management
- Class Analytics

### Student Dashboard (`/`)
**Components:**
- My Progress (tests, scores, achievements)
- Materials (only enabled features visible)
- Classes (enrolled classes)
- Certifications
- Community/Discussions (if enabled)

---

## 🚀 Implementation Plan

### Phase 1: Database & API (Priority)
1. Create new tables (permissions, user_roles, institutions, etc.)
2. Update API endpoints to check permissions
3. Add institution and feature toggle endpoints

### Phase 2: Developer Dashboard
1. Build global feature toggle UI
2. Build subscription tier management
3. Add platform analytics

### Phase 3: Admin Dashboard
1. Build student management UI
2. Build payment processing UI
3. Build institution feature toggles
4. Add teacher management

### Phase 4: Teacher Dashboard
1. Build class management UI
2. Build student progress views
3. Build class feature toggles
4. Add grading interface

### Phase 5: Student Dashboard Updates
1. Filter features based on permissions
2. Show only enabled content
3. Update navigation based on access

### Phase 6: Testing
1. Test every button as each role
2. Verify permission cascading
3. Test feature toggling at all levels
4. Verify payment flows

---

## ✅ Benefits of This Architecture

1. **Infinitely Scalable** - Add any data type via `data_items` table
2. **No Schema Changes** - Everything is toggleable via JSON
3. **Flexible Permissions** - Override at any level (global → institution → class)
4. **Clear Separation** - 4 distinct dashboards for 4 distinct roles
5. **Business Model Ready** - Built-in subscription tiers and payment tracking

---

Built for infinite scalability and flexibility! 🚀
