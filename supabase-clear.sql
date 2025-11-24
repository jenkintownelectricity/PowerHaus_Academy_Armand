-- ============================================
-- POWERHAUS ACADEMY - CLEAR DATABASE
-- ============================================
-- WARNING: This will DELETE ALL DATA and TABLES!
-- Run this to start fresh, then run:
--   1. supabase-schema.sql
--   2. supabase-setup.sql
-- ============================================

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS blog_comments CASCADE;
DROP TABLE IF EXISTS discussion_replies CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS grading_comments CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS pdf_annotations CASCADE;
DROP TABLE IF EXISTS rubric_criteria CASCADE;
DROP TABLE IF EXISTS rubrics CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS student_progress CASCADE;
DROP TABLE IF EXISTS media_submissions CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS pillar_progress CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS hands_on_stations CASCADE;
DROP TABLE IF EXISTS discount_codes CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS subscription_tiers CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS platform_branding CASCADE;
DROP TABLE IF EXISTS feature_toggles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all enums
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS submission_type CASCADE;
DROP TYPE IF EXISTS pillar CASCADE;
DROP TYPE IF EXISTS material_category CASCADE;
DROP TYPE IF EXISTS discussion_category CASCADE;
DROP TYPE IF EXISTS class_type CASCADE;
DROP TYPE IF EXISTS blog_category CASCADE;
DROP TYPE IF EXISTS badge_tier CASCADE;

-- ============================================
-- DATABASE CLEARED! ✅
-- ============================================
-- Now run these in order:
-- 1. supabase-schema.sql (creates tables)
-- 2. supabase-setup.sql (adds test data)
-- ============================================
