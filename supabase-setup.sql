-- ============================================
-- POWERHAUS ACADEMY - SUPABASE SETUP
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will create all tables and seed test data
-- ============================================

-- Step 1: Create all tables and enums
-- (Copy the contents of drizzle/0000_fantastic_spencer_smythe.sql here)
-- OR run that file first, then run the seed data below

-- ============================================
-- STEP 2: SEED DATA (Test Accounts & Content)
-- ============================================

-- Insert PowerHaus Academy Users
INSERT INTO users (email, password, first_name, last_name, role, bio, points_earned)
VALUES
  ('admin@powerhaus.com', 'admin123', 'Admin', 'PowerHaus', 'admin', 'PowerHaus Academy Administrator', 0),
  ('coach@powerhaus.com', 'coach123', 'Marcus', 'Steel', 'instructor', 'Digital Media Coach | 10+ years experience', 0),
  ('user@powerhaus.com', 'user123', 'John', 'Creator', 'student', 'On a journey to master digital media 🎥', 1250),
  ('user2@powerhaus.com', 'user123', 'Emily', 'Vision', 'student', 'Content creator | Storyteller', 850),
  ('user3@powerhaus.com', 'user123', 'Mike', 'Digital', 'student', 'Aspiring filmmaker | Creative entrepreneur', 2100)
ON CONFLICT (email) DO NOTHING;

-- Get user IDs (we'll need these for foreign keys)
DO $$
DECLARE
  admin_id INT;
  coach_id INT;
  user1_id INT;
  user2_id INT;
  user3_id INT;
  program1_id INT;
  program2_id INT;
BEGIN
  -- Get user IDs
  SELECT id INTO admin_id FROM users WHERE email = 'admin@powerhaus.com';
  SELECT id INTO coach_id FROM users WHERE email = 'coach@powerhaus.com';
  SELECT id INTO user1_id FROM users WHERE email = 'user@powerhaus.com';
  SELECT id INTO user2_id FROM users WHERE email = 'user2@powerhaus.com';
  SELECT id INTO user3_id FROM users WHERE email = 'user3@powerhaus.com';

  -- Insert Programs
  INSERT INTO programs (title, description, pillar, duration_weeks, difficulty_level, instructor_id, is_published, total_sessions)
  VALUES
    ('Content Creation Foundations', 'Master the basics of digital content creation across platforms', 'media_skills', 8, 'beginner', coach_id, true, 16),
    ('Creative Leadership Bootcamp', 'Lead creative teams and projects with confidence', 'creative_leadership', 6, 'intermediate', coach_id, true, 12)
  ON CONFLICT DO NOTHING
  RETURNING id INTO program1_id;

  -- Insert Video Materials
  INSERT INTO materials (title, description, category, file_url, pillar, duration_minutes, difficulty_level, instructor_id, is_published)
  VALUES
    ('Introduction to Digital Confidence', 'Build your confidence in the digital world', 'video_tutorial', 'https://example.com/video1.mp4', 'digital_confidence', 15, 'beginner', coach_id, true),
    ('Camera Basics for Content Creators', 'Essential camera techniques for stunning content', 'video_tutorial', 'https://example.com/video2.mp4', 'media_skills', 25, 'beginner', coach_id, true),
    ('Building Your Portfolio', 'Showcase your best work professionally', 'resource_guide', 'https://example.com/guide.pdf', 'portfolio', 20, 'intermediate', coach_id, true)
  ON CONFLICT DO NOTHING;

  -- Insert Pillar Progress for test user
  INSERT INTO pillar_progress (user_id, pillar, xp_earned, current_level, completed_milestones)
  VALUES
    (user1_id, 'digital_confidence', 450, 3, ARRAY['first_login', 'profile_complete', 'first_video']),
    (user1_id, 'media_skills', 800, 5, ARRAY['first_upload', 'quality_submission', 'featured_work']),
    (user1_id, 'portfolio', 250, 2, ARRAY['portfolio_created'])
  ON CONFLICT (user_id, pillar) DO UPDATE
  SET xp_earned = EXCLUDED.xp_earned,
      current_level = EXCLUDED.current_level,
      completed_milestones = EXCLUDED.completed_milestones;

  -- Insert User Badges
  INSERT INTO user_badges (user_id, badge_name, badge_tier, description, pillar, icon_url)
  VALUES
    (user1_id, 'First Steps', 'bronze', 'Completed your first lesson', 'digital_confidence', '🎯'),
    (user1_id, 'Content Creator', 'silver', 'Uploaded 5 quality pieces', 'media_skills', '🎥'),
    (user3_id, 'Portfolio Pro', 'gold', 'Built an outstanding portfolio', 'portfolio', '⭐')
  ON CONFLICT DO NOTHING;

  -- Insert Media Submissions
  INSERT INTO media_submissions (
    user_id, submission_type, title, description, file_url,
    pillar, status, instructor_feedback, is_featured
  )
  VALUES
    (user1_id, 'video', 'My First Vlog', 'Documentary about my creative journey', 'https://example.com/submission1.mp4', 'media_skills', 'approved', 'Great storytelling! Keep it up!', true),
    (user2_id, 'portfolio_piece', 'Brand Identity Design', 'Complete brand package for local business', 'https://example.com/portfolio1.pdf', 'entrepreneurship', 'approved', 'Professional work!', false),
    (user3_id, 'video', 'Short Film - Dreams', 'Experimental short film about creativity', 'https://example.com/film.mp4', 'media_skills', 'pending', NULL, false)
  ON CONFLICT DO NOTHING;

  -- Insert Discount Codes
  INSERT INTO discount_codes (code, description, discount_percentage, max_uses, current_uses, expires_at, is_active)
  VALUES
    ('LAUNCH2024', 'Launch special - 50% off', 50, 100, 15, CURRENT_DATE + INTERVAL '30 days', true),
    ('STUDENT25', 'Student discount', 25, 500, 87, CURRENT_DATE + INTERVAL '90 days', true),
    ('EARLYBIRD', 'Early bird special', 30, 50, 48, CURRENT_DATE + INTERVAL '15 days', true)
  ON CONFLICT (code) DO NOTHING;

  -- Insert Blog Posts
  INSERT INTO blog_posts (
    title, content, excerpt, category, author_id,
    published_at, is_published, featured_image_url, tags
  )
  VALUES
    (
      'Welcome to PowerHaus Academy',
      'We''re excited to launch PowerHaus Academy - your gateway to digital media mastery...',
      'Introducing PowerHaus Academy: Where creativity meets technology',
      'industry_insights',
      admin_id,
      NOW(),
      true,
      'https://example.com/blog1.jpg',
      ARRAY['announcement', 'welcome', 'community']
    ),
    (
      '5 Tips for Creating Engaging Content',
      'Learn the secrets of viral content creation from industry pros...',
      'Master these 5 essential techniques for engagement',
      'tutorial',
      coach_id,
      NOW() - INTERVAL '3 days',
      true,
      'https://example.com/blog2.jpg',
      ARRAY['content creation', 'tips', 'social media']
    )
  ON CONFLICT DO NOTHING;

  -- Insert Community Discussions
  INSERT INTO discussions (title, content, category, author_id, is_pinned)
  VALUES
    ('Introduce Yourself! 👋', 'Welcome to the PowerHaus community! Tell us about your creative journey.', 'general', admin_id, true),
    ('Best Camera for Beginners?', 'Looking for camera recommendations for content creation on a budget', 'tech_help', user1_id, false),
    ('Portfolio Review Thread', 'Share your portfolio and get feedback from the community!', 'portfolio_feedback', coach_id, true)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- You can now log in with:
-- Email: admin@powerhaus.com | Password: admin123
-- Email: user@powerhaus.com  | Password: user123
-- Email: coach@powerhaus.com | Password: coach123
-- ============================================
