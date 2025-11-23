-- Phase 2: SpeedGrader Database Schema
-- Assignments, submissions, rubrics, and grading system

-- =====================================================
-- ASSIGNMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  due_date TIMESTAMP NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 100,
  rubric_id INTEGER,  -- Will reference rubrics table
  allow_late_submission BOOLEAN NOT NULL DEFAULT true,
  late_penalty_percent INTEGER NOT NULL DEFAULT 10,
  submission_type TEXT NOT NULL DEFAULT 'file',  -- file, text, url
  instructions TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);

-- =====================================================
-- SUBMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL DEFAULT 'file',  -- file, text, url
  content TEXT,  -- For text submissions or file path
  file_url TEXT,  -- S3/R2 URL for files
  file_name TEXT,
  file_size INTEGER,  -- in bytes
  file_type TEXT,  -- pdf, docx, jpg, etc
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_late BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted',  -- submitted, graded, returned
  attempt_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(assignment_id, student_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);

-- =====================================================
-- RUBRICS
-- =====================================================

CREATE TABLE IF NOT EXISTS rubrics (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 100,
  is_template BOOLEAN NOT NULL DEFAULT false,  -- Reusable templates
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rubrics_teacher ON rubrics(teacher_id);
CREATE INDEX IF NOT EXISTS idx_rubrics_template ON rubrics(is_template);

-- =====================================================
-- RUBRIC CRITERIA
-- =====================================================

CREATE TABLE IF NOT EXISTS rubric_criteria (
  id SERIAL PRIMARY KEY,
  rubric_id INTEGER NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  max_points INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rubric_criteria_rubric ON rubric_criteria(rubric_id);

-- =====================================================
-- GRADES
-- =====================================================

CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_score DECIMAL(5,2) NOT NULL,  -- e.g., 87.50
  total_points INTEGER NOT NULL,  -- e.g., 100
  percentage DECIMAL(5,2) NOT NULL,  -- e.g., 87.50%
  letter_grade TEXT,  -- A, B+, etc
  rubric_scores JSONB,  -- {criteria_id: score} for rubric grading
  feedback_text TEXT,
  feedback_audio_url TEXT,  -- URL to audio feedback file
  feedback_video_url TEXT,  -- URL to video feedback file
  graded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  returned_to_student BOOLEAN NOT NULL DEFAULT false,
  returned_at TIMESTAMP,
  time_spent_grading INTEGER,  -- in seconds
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grades_submission ON grades(submission_id);
CREATE INDEX IF NOT EXISTS idx_grades_teacher ON grades(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grades_graded_at ON grades(graded_at);

-- =====================================================
-- PDF ANNOTATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS pdf_annotations (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  annotation_type TEXT NOT NULL,  -- highlight, comment, drawing, stamp
  annotation_data JSONB NOT NULL,  -- Stores coordinates, color, text, etc
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pdf_annotations_submission ON pdf_annotations(submission_id);
CREATE INDEX IF NOT EXISTS idx_pdf_annotations_page ON pdf_annotations(submission_id, page_number);

-- =====================================================
-- GRADING COMMENTS (Quick Feedback)
-- =====================================================

CREATE TABLE IF NOT EXISTS grading_comments (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',  -- general, grammar, content, formatting
  is_positive BOOLEAN NOT NULL DEFAULT true,  -- positive or needs improvement
  use_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grading_comments_teacher ON grading_comments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grading_comments_category ON grading_comments(category);

-- =====================================================
-- Add foreign key for rubrics to assignments
-- =====================================================

ALTER TABLE assignments
  ADD CONSTRAINT fk_assignments_rubric
  FOREIGN KEY (rubric_id)
  REFERENCES rubrics(id)
  ON DELETE SET NULL;

-- =====================================================
-- Helper function: Calculate letter grade
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_letter_grade(percentage DECIMAL)
RETURNS TEXT AS $$
BEGIN
  IF percentage >= 93 THEN RETURN 'A';
  ELSIF percentage >= 90 THEN RETURN 'A-';
  ELSIF percentage >= 87 THEN RETURN 'B+';
  ELSIF percentage >= 83 THEN RETURN 'B';
  ELSIF percentage >= 80 THEN RETURN 'B-';
  ELSIF percentage >= 77 THEN RETURN 'C+';
  ELSIF percentage >= 73 THEN RETURN 'C';
  ELSIF percentage >= 70 THEN RETURN 'C-';
  ELSIF percentage >= 67 THEN RETURN 'D+';
  ELSIF percentage >= 63 THEN RETURN 'D';
  ELSIF percentage >= 60 THEN RETURN 'D-';
  ELSE RETURN 'F';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- Record migration
-- =====================================================

INSERT INTO migrations (name) VALUES ('003_add_speedgrader_system.sql')
ON CONFLICT (name) DO NOTHING;
