-- ============================================
-- POWERHAUS ACADEMY - SUPABASE SEED DATA
-- ============================================
-- Run this AFTER running supabase-schema.sql
-- This creates test accounts and sample data
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

-- Get user IDs and insert related data
DO $$
DECLARE
  admin_id INT;
  coach_id INT;
  user1_id INT;
  user2_id INT;
  user3_id INT;
BEGIN
  -- Get user IDs
  SELECT id INTO admin_id FROM users WHERE email = 'admin@powerhaus.com';
  SELECT id INTO coach_id FROM users WHERE email = 'coach@powerhaus.com';
  SELECT id INTO user1_id FROM users WHERE email = 'user@powerhaus.com';
  SELECT id INTO user2_id FROM users WHERE email = 'user2@powerhaus.com';
  SELECT id INTO user3_id FROM users WHERE email = 'user3@powerhaus.com';

  -- Insert Programs (using actual schema columns)
  INSERT INTO programs (title, description, duration, difficulty, price, pillars_included, is_active)
  VALUES
    ('Content Creation Foundations', 'Master the basics of digital content creation across platforms', 8, 'beginner', 0, ARRAY['media_skills', 'digital_confidence']::pillar[], true),
    ('Creative Leadership Bootcamp', 'Lead creative teams and projects with confidence', 6, 'intermediate', 0, ARRAY['creative_leadership', 'entrepreneurship']::pillar[], true),
    ('Portfolio Building Masterclass', 'Build a stunning portfolio that gets you hired', 4, 'intermediate', 0, ARRAY['portfolio', 'digital_literacy']::pillar[], true)
  ON CONFLICT DO NOTHING;

  -- Insert Pillar Progress for test users
  INSERT INTO pillar_progress (user_id, pillar, xp_earned, current_level, milestones_completed)
  VALUES
    (user1_id, 'digital_confidence', 450, 3, ARRAY['first_login', 'profile_complete', 'first_video']),
    (user1_id, 'media_skills', 800, 5, ARRAY['first_upload', 'quality_submission', 'featured_work']),
    (user1_id, 'portfolio', 250, 2, ARRAY['portfolio_created']),
    (user2_id, 'digital_confidence', 300, 2, ARRAY['first_login', 'profile_complete']),
    (user3_id, 'media_skills', 1200, 7, ARRAY['first_upload', 'quality_submission', 'featured_work', 'expert_level'])
  ON CONFLICT (user_id, pillar) DO UPDATE
  SET xp_earned = EXCLUDED.xp_earned,
      current_level = EXCLUDED.current_level,
      milestones_completed = EXCLUDED.milestones_completed;

  -- Insert User Badges
  INSERT INTO user_badges (user_id, badge_name, badge_tier, description, earned_at)
  VALUES
    (user1_id, 'First Steps', 'bronze', 'Completed your first lesson', NOW() - INTERVAL '10 days'),
    (user1_id, 'Content Creator', 'silver', 'Uploaded 5 quality pieces', NOW() - INTERVAL '5 days'),
    (user3_id, 'Portfolio Pro', 'gold', 'Built an outstanding portfolio', NOW() - INTERVAL '2 days'),
    (user3_id, 'Master Creator', 'platinum', 'Achieved mastery in media skills', NOW())
  ON CONFLICT DO NOTHING;

  -- Insert Discount Codes (using actual schema columns)
  INSERT INTO discount_codes (code, description, discount_type, discount_value, max_uses, uses_count, valid_from, valid_until, is_active)
  VALUES
    ('LAUNCH2024', 'Launch special - 50% off', 'percentage', 50, 100, 15, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', true),
    ('STUDENT25', 'Student discount', 'percentage', 25, 500, 87, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days', true),
    ('EARLYBIRD', 'Early bird special', 'percentage', 30, 50, 48, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '5 days', true)
  ON CONFLICT (code) DO NOTHING;

  -- Insert Blog Posts (using actual schema columns - no excerpt, is_published, featured_image_url, tags)
  INSERT INTO blog_posts (title, content, category, author_id, published_at, is_approved, extra_credit_awarded)
  VALUES
    (
      'Welcome to PowerHaus Academy',
      'We are excited to launch PowerHaus Academy - your gateway to digital media mastery! Our 6 Pillars curriculum will guide you through Digital Confidence, Media Skills, Creative Leadership, Digital Literacy, Entrepreneurship, and Portfolio Building. Join our community of creators and transform your passion into a career.',
      'industry_insights',
      admin_id,
      NOW(),
      true,
      0
    ),
    (
      '5 Tips for Creating Engaging Content',
      'Learn the secrets of viral content creation from industry pros. 1. Know your audience deeply. 2. Tell authentic stories. 3. Optimize for each platform. 4. Engage with comments. 5. Analyze and iterate. Master these fundamentals and watch your engagement soar!',
      'tutorial',
      coach_id,
      NOW() - INTERVAL '3 days',
      true,
      10
    ),
    (
      'Student Success Story: From Zero to Creator',
      'Meet Sarah, who went from complete beginner to landing her first paid client in just 3 months using our 6 Pillars curriculum. Her journey shows that with dedication and the right guidance, anyone can become a successful content creator.',
      'student_success',
      admin_id,
      NOW() - INTERVAL '7 days',
      true,
      5
    )
  ON CONFLICT DO NOTHING;

  -- Insert Community Discussions (using actual schema columns)
  INSERT INTO discussions (title, content, category, author_id, tags, is_pinned)
  VALUES
    ('Introduce Yourself! 👋', 'Welcome to the PowerHaus community! Tell us about your creative journey, what you hope to achieve, and what excites you most about digital media.', 'general', admin_id, ARRAY['welcome', 'introductions'], true),
    ('Best Camera for Beginners?', 'Looking for camera recommendations for content creation on a budget. What do you all use? Should I start with my phone or invest in a DSLR?', 'tech_help', user1_id, ARRAY['equipment', 'beginner', 'camera'], false),
    ('Portfolio Review Thread', 'Share your portfolio and get feedback from the community! Post a link and let us know what kind of work you are looking to get hired for.', 'portfolio_feedback', coach_id, ARRAY['portfolio', 'feedback', 'review'], true),
    ('Editing Software Recommendations', 'What is everyone using for video editing? I am torn between DaVinci Resolve, Premiere Pro, and Final Cut. Pros and cons?', 'tech_help', user2_id, ARRAY['software', 'editing', 'video'], false)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- You can now log in with:
--
-- Admin:   admin@powerhaus.com  / admin123
-- Student: user@powerhaus.com   / user123
-- Coach:   coach@powerhaus.com  / coach123
-- ============================================
