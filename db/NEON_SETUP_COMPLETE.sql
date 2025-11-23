-- ============================================
-- COMPLETE NEON DATABASE SETUP
-- Run this entire file in Neon SQL Editor
-- ============================================
-- This combines all migrations into one file for easy setup
-- Copy and paste the ENTIRE file and click "Run"
-- ============================================

-- ============================================
-- STEP 1: CREATE ENUMS
-- ============================================

DO $$ BEGIN
  CREATE TYPE discussion_category AS ENUM ('general', 'questions', 'tips', 'alumni');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blog_category AS ENUM ('industry_news', 'tips', 'case_studies', 'student_work');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE class_type AS ENUM ('hybrid', 'online', 'hands_on');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE material_category AS ENUM ('book_materials', 'hands_on_station');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- STEP 2: CREATE PERMISSION SYSTEM TABLES
-- ============================================

-- Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  features_enabled JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Roles Table (multi-role support)
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  institution_id INTEGER REFERENCES institutions(id),
  permissions JSONB DEFAULT '{}',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role, institution_id)
);

-- Permissions Registry
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Institution Features (feature toggles at institution level)
CREATE TABLE IF NOT EXISTS institution_features (
  id SERIAL PRIMARY KEY,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  feature_id INTEGER REFERENCES feature_toggles(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(institution_id, feature_id)
);

-- Class Features (feature toggles at class level)
CREATE TABLE IF NOT EXISTS class_features (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  feature_id INTEGER REFERENCES feature_toggles(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, feature_id)
);

-- Flexible Data Items (infinitely scalable storage)
CREATE TABLE IF NOT EXISTS data_items (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  owner_id INTEGER REFERENCES users(id),
  institution_id INTEGER REFERENCES institutions(id),
  class_id INTEGER REFERENCES classes(id),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE CORE TABLES
-- ============================================

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type class_type NOT NULL,
  teacher_id INTEGER REFERENCES users(id),
  capacity INTEGER NOT NULL,
  enrolled INTEGER NOT NULL DEFAULT 0,
  schedule_date TIMESTAMP NOT NULL,
  schedule_time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  is_live BOOLEAN NOT NULL DEFAULT FALSE,
  video_url TEXT,
  student_count INTEGER NOT NULL DEFAULT 0,
  institution_id INTEGER REFERENCES institutions(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category material_category NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) NOT NULL,
  class_id INTEGER REFERENCES classes(id) NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) NOT NULL,
  class_id INTEGER REFERENCES classes(id),
  amount INTEGER NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Hands-On Stations Table
CREATE TABLE IF NOT EXISTS hands_on_stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions JSONB NOT NULL,
  questions JSONB NOT NULL,
  target_time INTEGER NOT NULL DEFAULT 15,
  passing_score INTEGER NOT NULL DEFAULT 80,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) NOT NULL,
  station_id INTEGER REFERENCES hands_on_stations(id) NOT NULL,
  score INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Discussions Table
CREATE TABLE IF NOT EXISTS discussions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category discussion_category NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author_id INTEGER REFERENCES users(id) NOT NULL,
  has_helpful_answer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Discussion Replies Table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER REFERENCES discussions(id) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  is_helpful BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category blog_category NOT NULL,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  extra_credit_awarded INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog_posts(id) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Platform Settings Table
CREATE TABLE IF NOT EXISTS platform_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 4: UPDATE EXISTING TABLES
-- ============================================

-- Add institution_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS institution_id INTEGER REFERENCES institutions(id);

-- Add global toggle to feature_toggles
ALTER TABLE feature_toggles ADD COLUMN IF NOT EXISTS enabled_globally BOOLEAN DEFAULT false;
ALTER TABLE feature_toggles ADD COLUMN IF NOT EXISTS enabled_by_default BOOLEAN DEFAULT false;

-- ============================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Permission system indexes
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

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_type ON classes(type);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_station_id ON student_progress(station_id);
CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);

-- ============================================
-- STEP 6: SEED DEFAULT DATA
-- ============================================

-- Default Permissions
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

-- Default Institution
INSERT INTO institutions (name, subscription_tier, settings)
VALUES ('Default Institution', 'pro', '{"auto_created": true}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next: Run db/seed_data.sql to populate with test data
-- ============================================
