-- SPU LMS Permission System Migration
-- This adds the 4-tier role system with infinitely scalable permissions

-- ============================================
-- 1. INSTITUTIONS TABLE
-- ============================================
-- Represents hospitals, universities, companies using the platform
CREATE TABLE IF NOT EXISTS institutions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free',  -- 'free', 'pro', 'enterprise'
  features_enabled JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. USER ROLES TABLE
-- ============================================
-- Multi-role support: users can be student, teacher, admin, developer
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,  -- 'student', 'teacher', 'admin', 'developer'
  institution_id INTEGER REFERENCES institutions(id),  -- NULL for developers
  permissions JSONB DEFAULT '{}',  -- Custom permission overrides
  is_primary BOOLEAN DEFAULT false,  -- Primary role for this user
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role, institution_id)
);

-- ============================================
-- 3. PERMISSIONS REGISTRY
-- ============================================
-- Define all available permissions
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,  -- e.g., 'can_grade_tests', 'can_manage_students'
  description TEXT,
  category TEXT,  -- 'student', 'teacher', 'admin', 'developer', 'global'
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. INSTITUTION FEATURES
-- ============================================
-- Feature toggles at institution level
CREATE TABLE IF NOT EXISTS institution_features (
  id SERIAL PRIMARY KEY,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  feature_id INTEGER REFERENCES feature_toggles(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(institution_id, feature_id)
);

-- ============================================
-- 5. CLASS FEATURES
-- ============================================
-- Feature toggles at class level
CREATE TABLE IF NOT EXISTS class_features (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  feature_id INTEGER REFERENCES feature_toggles(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, feature_id)
);

-- ============================================
-- 6. FLEXIBLE DATA ITEMS
-- ============================================
-- Infinitely scalable data storage
CREATE TABLE IF NOT EXISTS data_items (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,  -- 'material', 'assessment', 'announcement', 'resource', etc.
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',  -- All properties stored as flexible JSON
  tags TEXT[] DEFAULT '{}',  -- For filtering and searching
  owner_id INTEGER REFERENCES users(id),
  institution_id INTEGER REFERENCES institutions(id),
  class_id INTEGER REFERENCES classes(id),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. UPDATE EXISTING TABLES
-- ============================================

-- Add institution_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS institution_id INTEGER REFERENCES institutions(id);

-- Add institution_id to classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS institution_id INTEGER REFERENCES institutions(id);

-- Add global toggle to feature_toggles
ALTER TABLE feature_toggles ADD COLUMN IF NOT EXISTS enabled_globally BOOLEAN DEFAULT false;
ALTER TABLE feature_toggles ADD COLUMN IF NOT EXISTS enabled_by_default BOOLEAN DEFAULT false;

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_institution_id ON user_roles(institution_id);

CREATE INDEX IF NOT EXISTS idx_institution_features_institution_id ON institution_features(institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_features_feature_id ON institution_features(feature_id);

CREATE INDEX IF NOT EXISTS idx_class_features_class_id ON class_features(class_id);
CREATE INDEX IF NOT EXISTS idx_class_features_feature_id ON class_features(feature_id);

CREATE INDEX IF NOT EXISTS idx_data_items_type ON data_items(type);
CREATE INDEX IF NOT EXISTS idx_data_items_owner_id ON data_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_data_items_institution_id ON data_items(institution_id);
CREATE INDEX IF NOT EXISTS idx_data_items_class_id ON data_items(class_id);
CREATE INDEX IF NOT EXISTS idx_data_items_tags ON data_items USING GIN(tags);

-- ============================================
-- 9. SEED DEFAULT PERMISSIONS
-- ============================================

INSERT INTO permissions (name, description, category) VALUES
-- Developer permissions
('manage_platform', 'Manage entire platform', 'developer'),
('manage_tiers', 'Manage subscription tiers and pricing', 'developer'),
('manage_global_features', 'Toggle features globally', 'developer'),
('view_platform_analytics', 'View platform-wide analytics', 'developer'),

-- Admin permissions
('manage_institution', 'Manage institution settings', 'admin'),
('manage_students', 'Add/remove/view students', 'admin'),
('manage_teachers', 'Add/remove/view teachers', 'admin'),
('process_payments', 'Process student payments', 'admin'),
('toggle_institution_features', 'Toggle features for institution', 'admin'),
('view_institution_analytics', 'View institution analytics', 'admin'),

-- Teacher permissions
('create_classes', 'Create new classes', 'teacher'),
('manage_own_classes', 'Manage own classes', 'teacher'),
('grade_assessments', 'Grade student assessments', 'teacher'),
('upload_materials', 'Upload teaching materials', 'teacher'),
('toggle_class_features', 'Toggle features for own classes', 'teacher'),
('view_class_analytics', 'View class analytics', 'teacher'),

-- Student permissions
('view_materials', 'View learning materials', 'student'),
('take_assessments', 'Take tests and quizzes', 'student'),
('view_own_progress', 'View own progress and grades', 'student'),
('participate_discussions', 'Participate in discussions', 'student'),
('earn_achievements', 'Earn achievements and badges', 'student')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 10. CREATE DEFAULT INSTITUTION (for existing data)
-- ============================================

INSERT INTO institutions (name, subscription_tier, settings)
VALUES ('Default Institution', 'pro', '{"auto_created": true}')
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Run this migration in your Neon database to add the complete permission system
