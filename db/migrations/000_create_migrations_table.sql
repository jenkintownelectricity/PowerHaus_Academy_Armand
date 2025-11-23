-- ============================================
-- 000 - Create Migrations Tracking Table
-- Run this FIRST before any other migrations
-- ============================================

-- This table tracks which migrations have been applied
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_migrations_name ON migrations(name);

-- ============================================
-- DONE - Now you can run other migrations
-- ============================================
