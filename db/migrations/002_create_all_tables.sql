-- Complete Database Schema for SPU LMS
-- Run this in your Neon SQL Editor to create all missing tables

-- ============================================
-- 1. CREATE ENUMS (if not exists)
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
-- 2. CREATE TABLES
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

-- Platform Settings Table (if not exists from earlier)
CREATE TABLE IF NOT EXISTS platform_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================

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
-- MIGRATION COMPLETE
-- ============================================
-- All tables and indexes created successfully!
