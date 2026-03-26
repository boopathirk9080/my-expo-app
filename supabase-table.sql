-- SQL Query to create students table in Supabase
-- Run this query in Supabase SQL Editor
-- IMPORTANT: Make sure you run this while logged into Supabase as a logged-in user (not anon)

-- Drop existing table if it exists (optional - only if you want to recreate)
-- DROP TABLE IF EXISTS students CASCADE;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER,
  department TEXT NOT NULL,
  email TEXT,
  district TEXT,
  pincode TEXT,
  address TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disable Row Level Security (RLS) for simplicity - allows all operations
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- OR if you want to keep RLS enabled, uncomment these lines:
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- 
-- -- Create policy to allow all operations (for anon key)
-- DROP POLICY IF EXISTS "Allow all operations on students" ON students;
-- CREATE POLICY "Allow all operations on students" ON students
--   FOR ALL
--   TO anon
--   USING (true)
--   WITH CHECK (true);
--
-- -- Also grant access to authenticated role if needed
-- CREATE POLICY "Allow all operations on students_auth" ON students
--   FOR ALL
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);

-- Enable RLS after disabling it (for this approach)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policy for anon role
DROP POLICY IF EXISTS "anon_full_access" ON students;
CREATE POLICY "anon_full_access" ON students
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated role
DROP POLICY IF EXISTS "authenticated_full_access" ON students;
CREATE POLICY "authenticated_full_access" ON students
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Grant table permissions to anon and authenticated roles
GRANT ALL ON students TO anon;
GRANT ALL ON students TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
