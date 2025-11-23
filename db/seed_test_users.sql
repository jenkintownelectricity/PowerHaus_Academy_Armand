-- Create test users for SPU LMS
-- Run this in Neon SQL Editor
-- This safely updates existing users or creates new ones

-- =====================================================
-- UPSERT TEST USERS (Update if exists, insert if not)
-- =====================================================

-- Admin user
INSERT INTO users (email, password, first_name, last_name, role, extra_credit_points)
VALUES ('admin@spulms.com', 'admin123', 'Admin', 'User', 'admin', 0)
ON CONFLICT (email)
DO UPDATE SET
  password = 'admin123',
  first_name = 'Admin',
  last_name = 'User',
  role = 'admin';

-- Teacher 1
INSERT INTO users (email, password, first_name, last_name, role, extra_credit_points)
VALUES ('teacher@example.com', 'teacher123', 'John', 'Smith', 'teacher', 0)
ON CONFLICT (email)
DO UPDATE SET
  password = 'teacher123',
  first_name = 'John',
  last_name = 'Smith',
  role = 'teacher';

-- Teacher 2
INSERT INTO users (email, password, first_name, last_name, role, extra_credit_points)
VALUES ('jane.smith@example.com', 'teacher123', 'Jane', 'Smith', 'teacher', 0)
ON CONFLICT (email)
DO UPDATE SET
  password = 'teacher123',
  first_name = 'Jane',
  last_name = 'Smith',
  role = 'teacher';

-- Student 1
INSERT INTO users (email, password, first_name, last_name, role, extra_credit_points)
VALUES ('student@example.com', 'student123', 'Sarah', 'Johnson', 'student', 0)
ON CONFLICT (email)
DO UPDATE SET
  password = 'student123',
  first_name = 'Sarah',
  last_name = 'Johnson',
  role = 'student';

-- Student 2
INSERT INTO users (email, password, first_name, last_name, role, extra_credit_points)
VALUES ('john.doe@example.com', 'student123', 'John', 'Doe', 'student', 0)
ON CONFLICT (email)
DO UPDATE SET
  password = 'student123',
  first_name = 'John',
  last_name = 'Doe',
  role = 'student';

-- Verify users were created/updated
SELECT id, email, first_name, last_name, role
FROM users
WHERE email IN (
  'admin@spulms.com',
  'teacher@example.com',
  'jane.smith@example.com',
  'student@example.com',
  'john.doe@example.com'
)
ORDER BY role, email;
