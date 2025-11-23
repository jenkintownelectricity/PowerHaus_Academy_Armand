-- ============================================
-- SPU LMS - Complete Seed Data
-- Run this after creating all tables to populate test data
-- ============================================

-- First, run the migrations in order:
-- 1. db/migrations/001_add_permission_system.sql
-- 2. db/migrations/002_create_all_tables.sql
-- Then run this seed data file

-- ============================================
-- 1. HANDS-ON STATIONS (5 Required Stations)
-- ============================================

INSERT INTO hands_on_stations (name, description, instructions, questions, target_time, passing_score, is_active) VALUES
(
  'Decontamination Station',
  'Learn proper decontamination procedures for medical instruments',
  '["Put on appropriate PPE (personal protective equipment)", "Pre-rinse instruments under running water to remove gross debris", "Soak instruments in enzymatic detergent solution", "Scrub instruments with soft brush paying attention to hinges and crevices", "Rinse thoroughly under running water", "Dry instruments completely before moving to next station"]'::jsonb,
  '[
    {"question": "What is the first step in decontamination?", "options": ["Scrubbing", "Putting on PPE", "Soaking", "Rinsing"], "correctAnswer": 1},
    {"question": "Why is enzymatic detergent used?", "options": ["It smells nice", "Breaks down organic matter", "It is cheaper", "Required by law"], "correctAnswer": 1},
    {"question": "What areas require special attention during scrubbing?", "options": ["Handles only", "Flat surfaces", "Hinges and crevices", "None"], "correctAnswer": 2},
    {"question": "How should instruments be dried?", "options": ["Air dry only", "Completely and thoroughly", "Leave wet", "Pat dry"], "correctAnswer": 1},
    {"question": "What temperature should the water be?", "options": ["Ice cold", "Room temperature", "Hot but safe to touch", "Boiling"], "correctAnswer": 2}
  ]'::jsonb,
  15,
  80,
  true
),
(
  'Sterilization Procedures',
  'Master the principles of steam sterilization and quality control',
  '["Check sterilizer for proper function and cleanliness", "Load instruments properly - allow space for steam circulation", "Place chemical indicators inside each package", "Set correct time, temperature, and pressure parameters", "Run sterilization cycle and monitor throughout", "Allow load to cool and dry completely before handling"]'::jsonb,
  '[
    {"question": "What is the standard temperature for steam sterilization?", "options": ["212°F", "250°F", "270°F", "300°F"], "correctAnswer": 2},
    {"question": "Why must instruments be spaced apart during sterilization?", "options": ["Looks better", "Steam circulation", "Easier counting", "Prevents rust"], "correctAnswer": 1},
    {"question": "What are chemical indicators used for?", "options": ["Decoration", "Verify sterilization conditions", "Track inventory", "Patient safety"], "correctAnswer": 1},
    {"question": "How long should instruments cool after sterilization?", "options": ["5 minutes", "Until completely cool and dry", "30 seconds", "Overnight"], "correctAnswer": 1},
    {"question": "What pressure is standard for steam sterilization?", "options": ["5 PSI", "10 PSI", "15 PSI", "30 PSI"], "correctAnswer": 3}
  ]'::jsonb,
  15,
  80,
  true
),
(
  'Instrument Identification',
  'Identify surgical instruments and their proper use',
  '["Study instrument names and classifications", "Learn to identify by visual characteristics", "Understand instrument function and specialty", "Practice proper handling techniques", "Memorize common sets and their contents", "Know alternative names for same instruments"]'::jsonb,
  '[
    {"question": "What is a Kelly clamp primarily used for?", "options": ["Cutting", "Clamping blood vessels", "Suturing", "Measuring"], "correctAnswer": 1},
    {"question": "Which instrument is used to hold tissue edges?", "options": ["Scalpel", "Forceps", "Retractor", "Scissors"], "correctAnswer": 1},
    {"question": "What distinguishes Mayo scissors from Metzenbaum scissors?", "options": ["Color", "Mayo are heavier/thicker", "Size only", "Nothing"], "correctAnswer": 1},
    {"question": "What is a hemostat used for?", "options": ["Cutting", "Controlling bleeding", "Drilling", "Measuring"], "correctAnswer": 1},
    {"question": "Needle holders are designed to:", "options": ["Hold needles for suturing", "Store needles", "Sharpen needles", "Count needles"], "correctAnswer": 0}
  ]'::jsonb,
  15,
  80,
  true
),
(
  'Quality Control & Testing',
  'Perform quality control tests on sterile processing equipment',
  '["Conduct daily Bowie-Dick test for steam penetration", "Run biological indicator tests weekly", "Check chemical indicators on every load", "Verify temperature, time, and pressure readings", "Document all test results accurately", "Report any failures immediately to supervisor"]'::jsonb,
  '[
    {"question": "What does a Bowie-Dick test evaluate?", "options": ["Steam penetration", "Water quality", "Instrument sharpness", "Package integrity"], "correctAnswer": 0},
    {"question": "How often should biological indicators be run?", "options": ["Daily", "Weekly", "Monthly", "Yearly"], "correctAnswer": 1},
    {"question": "What organism is used in biological indicators?", "options": ["E. coli", "Geobacillus stearothermophilus", "Staph aureus", "Streptococcus"], "correctAnswer": 1},
    {"question": "What should you do if a biological indicator fails?", "options": ["Ignore it", "Report immediately and recall load", "Run again later", "Use anyway"], "correctAnswer": 1},
    {"question": "Chemical indicators change color when:", "options": ["Wet", "Exposed to sterilization conditions", "Old", "Touched"], "correctAnswer": 1}
  ]'::jsonb,
  15,
  80,
  true
),
(
  'Case Cart Assembly',
  'Properly assemble surgical case carts with required instruments',
  '["Review surgeon preference card for procedure", "Gather all required instruments and supplies", "Check expiration dates on all sterile packages", "Arrange instruments in order of use", "Include backup instruments as needed", "Complete final verification checklist before transport"]'::jsonb,
  '[
    {"question": "What is a surgeon preference card?", "options": ["Business card", "List of preferred instruments/supplies", "Credit card", "ID badge"], "correctAnswer": 1},
    {"question": "Why check expiration dates?", "options": ["Hospital policy only", "Ensure sterility", "Insurance", "Inventory"], "correctAnswer": 1},
    {"question": "How should instruments be arranged?", "options": ["By size", "By color", "Order of use", "Alphabetically"], "correctAnswer": 2},
    {"question": "What if an item is expired?", "options": ["Use anyway", "Do not use, replace with valid item", "Ask surgeon", "Ignore"], "correctAnswer": 1},
    {"question": "Who verifies the case cart is complete?", "options": ["Nobody", "SPD technician", "Janitor", "Patient"], "correctAnswer": 1}
  ]'::jsonb,
  15,
  80,
  true
);

-- ============================================
-- 2. MATERIALS (Learning Resources)
-- ============================================

INSERT INTO materials (title, description, category, tags, file_type, file_path, file_size, uploaded_by_id) VALUES
-- Book Materials
(
  'HSPA Study Guide - 8th Edition',
  'Comprehensive study guide for Healthcare Sterile Processing Association certification exam',
  'book_materials',
  ARRAY['certification', 'study-guide', 'comprehensive'],
  'pdf',
  '/uploads/materials/hspa-study-guide.pdf',
  15728640,
  1
),
(
  'Sterilization & Disinfection Fundamentals',
  'Essential principles of sterilization and high-level disinfection',
  'book_materials',
  ARRAY['sterilization', 'fundamentals', 'textbook'],
  'pdf',
  '/uploads/materials/sterilization-fundamentals.pdf',
  8388608,
  1
),
(
  'Surgical Instrument Atlas',
  'Visual guide to identifying over 500 surgical instruments',
  'book_materials',
  ARRAY['instruments', 'identification', 'reference'],
  'pdf',
  '/uploads/materials/instrument-atlas.pdf',
  20971520,
  1
),
(
  'Decontamination Best Practices Video',
  'Step-by-step video demonstration of proper decontamination procedures',
  'book_materials',
  ARRAY['decontamination', 'video', 'tutorial'],
  'video',
  '/uploads/materials/decontamination-video.mp4',
  104857600,
  1
),

-- Hands-On Station Guides
(
  'Decontamination Station Quick Reference',
  'Printable quick reference guide for decontamination procedures',
  'hands_on_station',
  ARRAY['decontamination', 'quick-reference', 'checklist'],
  'pdf',
  '/uploads/materials/decon-quick-ref.pdf',
  524288,
  1
),
(
  'Sterilization Cycle Parameters Chart',
  'Quick reference for steam, ETO, and hydrogen peroxide sterilization parameters',
  'hands_on_station',
  ARRAY['sterilization', 'parameters', 'chart'],
  'pdf',
  '/uploads/materials/sterilization-params.pdf',
  1048576,
  1
),
(
  'Surgical Instrument Flashcards',
  'Printable flashcards for learning 100 most common surgical instruments',
  'hands_on_station',
  ARRAY['instruments', 'flashcards', 'study-aid'],
  'pdf',
  '/uploads/materials/instrument-flashcards.pdf',
  3145728,
  1
),
(
  'Quality Control Testing Log',
  'Template for documenting daily, weekly, and monthly QC tests',
  'hands_on_station',
  ARRAY['quality-control', 'template', 'documentation'],
  'excel',
  '/uploads/materials/qc-testing-log.xlsx',
  262144,
  1
);

-- ============================================
-- 3. CLASSES (Hybrid, Online, Hands-On)
-- ============================================

INSERT INTO classes (title, description, type, teacher_id, capacity, enrolled, schedule_date, schedule_time, duration, price, is_live, video_url, student_count) VALUES
-- Hybrid Classes
(
  'Introduction to Sterile Processing',
  'Foundation course covering all aspects of central sterile supply department operations',
  'hybrid',
  2,
  30,
  22,
  NOW() + INTERVAL '7 days',
  '9:00 AM - 12:00 PM',
  180,
  4900,
  false,
  NULL,
  0
),
(
  'Advanced Sterilization Techniques',
  'Deep dive into various sterilization modalities including steam, ETO, and hydrogen peroxide',
  'hybrid',
  2,
  25,
  18,
  NOW() + INTERVAL '14 days',
  '1:00 PM - 4:00 PM',
  180,
  5900,
  false,
  NULL,
  0
),

-- Online Classes
(
  'Infection Prevention Fundamentals',
  'Live online session covering microbiology and infection control principles',
  'online',
  2,
  50,
  35,
  NOW() + INTERVAL '3 days',
  '6:00 PM - 8:00 PM',
  120,
  2900,
  false,
  'https://zoom.us/j/123456789',
  0
),
(
  'LIVE: CRCST Exam Prep Session',
  'Join us live for an intensive review session for the Certified Registered Central Service Technician exam',
  'online',
  2,
  100,
  78,
  NOW() + INTERVAL '1 day',
  '7:00 PM - 9:00 PM',
  120,
  3900,
  true,
  'https://zoom.us/j/987654321',
  45
),
(
  'Quality Management in Sterile Processing',
  'Best practices for quality assurance and regulatory compliance',
  'online',
  2,
  40,
  28,
  NOW() + INTERVAL '10 days',
  '3:00 PM - 5:00 PM',
  120,
  3400,
  false,
  'https://zoom.us/j/555123456',
  0
),

-- Hands-On Classes
(
  'Hands-On Instrument Workshop',
  'In-person workshop for identifying and handling surgical instruments',
  'hands_on',
  2,
  15,
  12,
  NOW() + INTERVAL '5 days',
  '10:00 AM - 2:00 PM',
  240,
  7900,
  false,
  NULL,
  0
),
(
  'Steam Sterilizer Operation Practicum',
  'Hands-on training with actual steam sterilizers and biological monitoring',
  'hands_on',
  2,
  12,
  10,
  NOW() + INTERVAL '21 days',
  '9:00 AM - 1:00 PM',
  240,
  8900,
  false,
  NULL,
  0
);

-- ============================================
-- 4. DISCUSSIONS (Community Forum)
-- ============================================

INSERT INTO discussions (title, content, category, tags, author_id, has_helpful_answer) VALUES
(
  'Best practices for cleaning lumened instruments?',
  'I''m having trouble ensuring thorough cleaning of endoscopes and other lumened instruments. What techniques do you recommend?',
  'questions',
  ARRAY['cleaning', 'lumens', 'endoscopes'],
  3,
  true
),
(
  'New SPD tech - any study tips?',
  'I just started working in sterile processing and want to get certified. What are the best resources for studying for the CRCST exam?',
  'questions',
  ARRAY['certification', 'study-tips', 'crcst'],
  4,
  true
),
(
  'Tip: Color-code your instrument sets',
  'We started using colored tape to quickly identify which procedure sets are which. Game changer for efficiency!',
  'tips',
  ARRAY['organization', 'efficiency', 'instruments'],
  3,
  false
),
(
  'How to remember all the surgical instruments',
  'Share your methods for memorizing the hundreds of surgical instruments. I use flashcards and grouping by specialty.',
  'general',
  ARRAY['instruments', 'memorization', 'study-methods'],
  4,
  true
),
(
  'Alumni: Where did your SPD career take you?',
  'Calling all graduates - what positions have you moved into after working in sterile processing?',
  'alumni',
  ARRAY['career', 'advancement', 'networking'],
  3,
  false
),
(
  'Dealing with difficult surgeons',
  'How do you handle surgeons who blame SPD for every missing or wrong instrument?',
  'general',
  ARRAY['workplace', 'communication', 'professionalism'],
  4,
  true
);

-- ============================================
-- 5. BLOG POSTS (Industry News & Extra Credit)
-- ============================================

INSERT INTO blog_posts (title, content, category, author_id, is_approved, extra_credit_awarded, published_at) VALUES
(
  'New FDA Guidelines for Reprocessing Medical Devices',
  'The FDA has released updated guidance on reprocessing reusable medical devices. Key changes include stricter validation requirements for cleaning processes and enhanced documentation standards. Healthcare facilities must update their protocols by Q2 2025 to maintain compliance. This affects all sterile processing departments...',
  'industry_news',
  1,
  true,
  0,
  NOW() - INTERVAL '2 days'
),
(
  '5 Tips for Passing Your CRCST Exam on First Try',
  'After successfully passing the CRCST exam with a 95% score, I want to share my top study strategies: 1) Create a study schedule 3 months before the exam. 2) Use multiple resources, not just one textbook. 3) Form a study group with colleagues. 4) Practice with online question banks daily. 5) Focus on your weak areas...',
  'tips',
  3,
  true,
  10,
  NOW() - INTERVAL '5 days'
),
(
  'Case Study: Implementing Automated Instrument Tracking',
  'Our facility recently implemented a barcode-based instrument tracking system. This case study covers the implementation process, challenges faced, ROI analysis, and outcomes after 6 months. Instrument loss decreased by 65% and we achieved 99.2% accuracy in case cart assembly...',
  'case_studies',
  1,
  true,
  0,
  NOW() - INTERVAL '10 days'
),
(
  'My Journey from SPD Tech to Department Manager',
  'I started as an entry-level technician 8 years ago and recently became the Sterile Processing Department Manager. Here''s how I got here: started with CRCST certification, pursued my bachelor''s degree online while working full time, volunteered for special projects, cross-trained in OR and materials management...',
  'student_work',
  3,
  true,
  10,
  NOW() - INTERVAL '15 days'
),
(
  'Understanding Low-Temperature Sterilization Methods',
  'With increasing numbers of heat-sensitive medical devices, low-temperature sterilization is more important than ever. This article compares ethylene oxide (ETO), hydrogen peroxide gas plasma, and vaporized hydrogen peroxide methods. Each has specific advantages and limitations...',
  'industry_news',
  1,
  true,
  0,
  NOW() - INTERVAL '20 days'
),
(
  'How I Organize My Study Notes for Maximum Retention',
  'As a visual learner, I struggled with traditional study methods. I developed a color-coded system combining mind maps, flowcharts, and mnemonic devices. Sharing my templates and methods here for anyone who learns like I do...',
  'tips',
  4,
  true,
  5,
  NOW() - INTERVAL '7 days'
);

-- ============================================
-- 6. STUDENT PROGRESS (Sample Test Attempts)
-- ============================================

INSERT INTO student_progress (student_id, station_id, score, time_spent, passed, answers) VALUES
-- John Doe's progress
(3, 1, 85, 720, true, '{"0": 1, "1": 1, "2": 2, "3": 1, "4": 2}'::jsonb),
(3, 1, 92, 650, true, '{"0": 1, "1": 1, "2": 2, "3": 1, "4": 2}'::jsonb),
(3, 2, 78, 890, false, '{"0": 2, "1": 1, "2": 1, "3": 1, "4": 3}'::jsonb),
(3, 2, 88, 750, true, '{"0": 2, "1": 1, "2": 1, "3": 1, "4": 3}'::jsonb),
(3, 3, 95, 580, true, '{"0": 1, "1": 1, "2": 1, "3": 1, "4": 0}'::jsonb),

-- Jane Smith's progress
(4, 1, 90, 680, true, '{"0": 1, "1": 1, "2": 2, "3": 1, "4": 2}'::jsonb),
(4, 2, 82, 810, true, '{"0": 2, "1": 1, "2": 1, "3": 1, "4": 3}'::jsonb),
(4, 3, 88, 620, true, '{"0": 1, "1": 1, "2": 1, "3": 1, "4": 0}'::jsonb),
(4, 4, 91, 700, true, '{"0": 0, "1": 1, "2": 1, "3": 1, "4": 1}'::jsonb);

-- ============================================
-- 7. ENROLLMENTS (Student Class Registrations)
-- ============================================

INSERT INTO enrollments (student_id, class_id, status) VALUES
(3, 1, 'active'),
(3, 3, 'active'),
(3, 6, 'active'),
(4, 1, 'active'),
(4, 4, 'active'),
(4, 7, 'active');

-- ============================================
-- 8. DISCUSSION REPLIES
-- ============================================

INSERT INTO discussion_replies (discussion_id, content, author_id, is_helpful) VALUES
(1, 'I use specialized brushes designed for lumens and always run an enzymatic solution through them first. Also make sure to verify patency with air/water test.', 2, true),
(1, 'Great question! Don''t forget to follow the manufacturer''s IFU (Instructions for Use) - they''re required to provide validated cleaning instructions.', 1, false),
(2, 'The HSPA study guide is excellent. Also check out the practice exams on their website. I passed using mainly those resources.', 3, true),
(4, 'I group instruments by specialty (ortho, cardio, general surgery) and then learn the common sets for each. Makes it more manageable.', 3, false),
(6, 'Document everything! When you have the paperwork showing the correct items were sent, it protects you and helps identify the real issue.', 2, true);

-- ============================================
-- 9. BLOG COMMENTS
-- ============================================

INSERT INTO blog_comments (post_id, content, author_id, is_approved) VALUES
(2, 'This is exactly what I needed! Starting my study plan today using these tips.', 4, true),
(2, 'The study group tip is so important. My group met twice a week and we all passed!', 3, true),
(4, 'Congratulations on your promotion! This gives me hope for my own career path.', 4, true),
(6, 'The mind map templates are genius! Can you share more examples?', 3, true);

-- ============================================
-- 10. FEATURE TOGGLES (12 Advanced Features)
-- ============================================

INSERT INTO feature_toggles (name, description, category, tier, impact, enabled, enabled_globally, enabled_by_default) VALUES
-- Learning Features (Free Tier)
('spaced_repetition', 'AI-powered spaced repetition for optimal knowledge retention', 'learning', 'free', 'Increases long-term retention by 40%', true, true, true),
('learning_streak', 'Track daily learning streaks and maintain momentum', 'learning', 'free', 'Boosts engagement and consistency', true, true, true),
('progress_viz', 'Advanced analytics and progress visualization dashboards', 'learning', 'free', 'Helps students identify weak areas', true, true, true),

-- Collaboration Features (Free Tier)
('peer_learning', 'Peer-to-peer tutoring and study group formation', 'collaboration', 'free', 'Leverages community knowledge', true, true, true),

-- Immersive Features (Pro Tier)
('ar_identification', 'AR-based instrument identification practice', 'immersive', 'pro', 'Accelerates instrument memorization', true, true, false),
('vr_simulations', 'VR simulations of sterile processing procedures', 'immersive', 'pro', 'Provides safe practice environment', true, true, false),

-- Advanced Features (Pro Tier)
('real_time_collab', 'Real-time collaboration on case studies', 'collaboration', 'pro', 'Enables virtual study sessions', true, true, false),
('smart_assessment', 'Adaptive testing with personalized difficulty', 'learning', 'pro', 'Optimizes learning efficiency', true, true, false),

-- Enterprise Features (Enterprise Tier)
('multi_tenant', 'Multi-tenant support for institutional deployments', 'enterprise', 'enterprise', 'Enables white-label deployments', true, true, false),
('scorm_xapi', 'SCORM/xAPI integration for LMS compatibility', 'enterprise', 'enterprise', 'Integrates with existing systems', true, true, false),
('advanced_analytics', 'Institution-wide analytics and reporting dashboards', 'enterprise', 'enterprise', 'Data-driven decision making', true, true, false),
('api_integration', 'Full API access for custom integrations', 'enterprise', 'enterprise', 'Unlimited extensibility', true, true, false);

-- ============================================
-- 11. SUBSCRIPTION TIERS
-- ============================================

INSERT INTO subscription_tiers (name, price, description, features, is_active) VALUES
(
  'Free',
  0,
  'Perfect for individual learners getting started',
  '["Access to all 5 hands-on stations", "Basic learning materials", "Community discussions", "Progress tracking", "Spaced repetition", "Learning streaks", "Progress visualization", "Peer learning features"]'::jsonb,
  true
),
(
  'Professional',
  4900,
  'Advanced features for serious learners and small groups',
  '["Everything in Free tier", "AR instrument identification", "VR procedure simulations", "Real-time collaboration tools", "Smart adaptive assessments", "Priority support", "Downloadable certificates", "Advanced progress analytics"]'::jsonb,
  true
),
(
  'Enterprise',
  19900,
  'Complete solution for institutions and training programs',
  '["Everything in Professional tier", "Multi-tenant architecture", "SCORM/xAPI integration", "White-label customization", "Institution-wide analytics", "Full API access", "SSO integration", "Dedicated account manager", "Custom development support", "SLA guarantees"]'::jsonb,
  true
);

-- ============================================
-- 12. PLATFORM SETTINGS
-- ============================================

INSERT INTO platform_settings (key, value, description) VALUES
('site_name', 'SPU Learning Management System', 'The name of the platform'),
('support_email', 'support@spulms.com', 'Email for customer support inquiries'),
('max_upload_size', '104857600', 'Maximum file upload size in bytes (100MB)'),
('session_timeout', '86400', 'Session timeout in seconds (24 hours)'),
('enable_registrations', 'true', 'Allow new user registrations'),
('maintenance_mode', 'false', 'Put site in maintenance mode');

-- ============================================
-- SEED DATA COMPLETE!
-- ============================================
--
-- This seed data provides:
-- ✅ 5 Complete Hands-On Stations with questions
-- ✅ 8 Learning Materials (books + station guides)
-- ✅ 7 Classes (hybrid, online, hands-on) with realistic data
-- ✅ 6 Discussion threads across all categories
-- ✅ 6 Blog posts with mix of official and student content
-- ✅ Student progress data for testing dashboards
-- ✅ Class enrollments for multiple students
-- ✅ Discussion replies showing engagement
-- ✅ Blog comments showing community interaction
-- ✅ 12 Advanced feature toggles across 3 tiers
-- ✅ 3 Subscription tier definitions
-- ✅ Platform configuration settings
--
-- You can now test EVERY button and feature in the application!
