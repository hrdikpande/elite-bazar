-- INSTRUCTIONS
-- 1. Register a new user at http://localhost:5173/register (e.g., email: admin@elitebazar.com)
-- 2. Run the following command in your Supabase SQL Editor to promote that user to Admin.

UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@elitebazar.com';

-- Optional: Verify the update
-- SELECT * FROM profiles WHERE email = 'admin@elitebazar.com';
