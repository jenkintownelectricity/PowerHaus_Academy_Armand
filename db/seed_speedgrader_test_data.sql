-- =====================================================
-- SPEEDGRADER TEST DATA
-- Run this AFTER running migration 003_add_speedgrader_system.sql
-- =====================================================

-- First, get the teacher and student IDs
DO $$
DECLARE
  teacher_id INTEGER;
  student1_id INTEGER;
  student2_id INTEGER;
  class_id INTEGER;
  assignment_id INTEGER;
BEGIN
  -- Get user IDs
  SELECT id INTO teacher_id FROM users WHERE email = 'teacher@example.com';
  SELECT id INTO student1_id FROM users WHERE email = 'student@example.com';
  SELECT id INTO student2_id FROM users WHERE email = 'john.doe@example.com';

  -- Get or create a test class
  SELECT id INTO class_id FROM classes LIMIT 1;

  IF class_id IS NULL THEN
    -- Create a test class if none exists
    INSERT INTO classes (
      title, description, type, teacher_id, capacity, enrolled,
      schedule_date, schedule_time, duration, price
    ) VALUES (
      'Sterile Processing Fundamentals',
      'Learn the basics of sterile processing',
      'hybrid',
      teacher_id,
      30,
      2,
      NOW() + INTERVAL '7 days',
      '10:00 AM',
      120,
      0
    ) RETURNING id INTO class_id;
  END IF;

  -- Create test assignment
  INSERT INTO assignments (
    title,
    description,
    class_id,
    teacher_id,
    due_date,
    total_points,
    submission_type,
    instructions,
    allow_late_submission,
    late_penalty_percent
  ) VALUES (
    'Sterilization Methods Report',
    'Write a comprehensive report on different sterilization methods used in healthcare',
    class_id,
    teacher_id,
    NOW() + INTERVAL '7 days',
    100,
    'file',
    'Submit a 3-5 page report covering:\n1. Steam sterilization\n2. ETO sterilization\n3. Hydrogen peroxide plasma sterilization\n\nInclude advantages, disadvantages, and proper usage for each method.',
    true,
    10
  ) RETURNING id INTO assignment_id;

  -- Create test submissions
  INSERT INTO submissions (
    assignment_id,
    student_id,
    submission_type,
    file_url,
    file_name,
    file_size,
    file_type,
    is_late,
    status,
    attempt_number
  ) VALUES
  -- Student 1 submission (on time)
  (
    assignment_id,
    student1_id,
    'file',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'sterilization-methods-sarah.pdf',
    13264,
    'application/pdf',
    false,
    'submitted',
    1
  ),
  -- Student 2 submission (late)
  (
    assignment_id,
    student2_id,
    'file',
    'https://www.africau.edu/images/default/sample.pdf',
    'sterilization-methods-john.pdf',
    3028,
    'application/pdf',
    true,
    'submitted',
    1
  );

  -- Display results
  RAISE NOTICE 'Test assignment created with ID: %', assignment_id;
  RAISE NOTICE 'Access SpeedGrader at: /speedgrader?assignment=%', assignment_id;
END $$;

-- Verify the data was created
SELECT
  a.id as assignment_id,
  a.title,
  a.due_date,
  COUNT(s.id) as submission_count
FROM assignments a
LEFT JOIN submissions s ON s.assignment_id = a.id
WHERE a.title = 'Sterilization Methods Report'
GROUP BY a.id, a.title, a.due_date;

-- Show submissions
SELECT
  s.id,
  u.first_name || ' ' || u.last_name as student_name,
  s.file_name,
  s.is_late,
  s.status,
  s.submitted_at
FROM submissions s
JOIN users u ON u.id = s.student_id
JOIN assignments a ON a.id = s.assignment_id
WHERE a.title = 'Sterilization Methods Report'
ORDER BY s.submitted_at;
