-- ================================================================
-- SEED DATA SCRIPT FOR COMMUNITY PORTAL
-- Run this in Supabase SQL Editor AFTER running supabase-schema.sql
-- This creates sample data for testing the application
-- ================================================================

-- 1. Create a sample Admin User
-- Note: In production, you would create users via the Auth UI or API
-- This script assumes you have already created a user via the registration form
-- For testing, we'll insert a dummy user directly into auth.users (requires service_role key in API call)
-- However, for safety, we will just create profiles for existing test users or use a placeholder approach.

-- Since we cannot directly insert into auth.users via SQL Editor safely without breaking auth links,
-- We will provide instructions to create a test user via the UI first, then promote them.
-- BUT, to make the app work immediately with data, we will insert sample data into public tables 
-- that do NOT require a valid auth user ID for display purposes (like Trustees, Announcements).

-- For the 'profiles' table, we need a valid UUID. 
-- WORKAROUND: We will generate a random UUID for a "sample" profile to test the directory.
-- WARNING: This sample profile won't be able to log in unless you create the matching auth user.

-- Generate a random UUID for a sample member
DO $$
DECLARE
  sample_user_id UUID := gen_random_uuid();
  admin_user_id UUID := gen_random_uuid(); -- Placeholder for admin
BEGIN

  -- 2. Insert Sample Trustee Records (Publicly visible, no auth link required for display in this schema design if we decouple, 
  -- but our schema links to profiles. Let's assume trustees are just stored as JSONB or separate table for simplicity in seed, 
  -- OR we create dummy profiles for them).
  
  -- Let's stick to the schema: Trustees are just profiles with a specific role or we have a separate view?
  -- The schema requested a "Trustee Reachout Page". If we use the `profiles` table, we need entries there.
  
  -- Insert Sample Profiles (One Admin, One Member, Three Trustees)
  -- Note: These users CANNOT log in until you create corresponding accounts in Auth tab or via Signup form.
  -- They serve only to populate the Directory and Trustee pages for visual testing.
  
  INSERT INTO profiles (id, full_name, father_name, mother_name, occupation, num_children, address, native_place, email, phone, approval_status, role)
  VALUES 
    (admin_user_id, 'Rajesh Kumar (Admin)', 'Mohan Kumar', 'Sita Devi', 'Community Administrator', 2, '123 Main St, Mumbai', 'Jaipur', 'admin@community.test', '9999999999', 'APPROVED', 'ADMIN'),
    (sample_user_id, 'Amit Sharma', 'Vinod Sharma', 'Rekha Sharma', 'Software Engineer', 1, '456 Tech Park, Bangalore', 'Lucknow', 'amit@community.test', '8888888888', 'APPROVED', 'MEMBER'),
    (gen_random_uuid(), 'Sunita Verma', 'Prakash Verma', 'Anita Verma', 'Doctor', 0, '789 Health Ave, Delhi', 'Kanpur', 'sunita@community.test', '7777777777', 'APPROVED', 'MEMBER'), -- Trustee 1
    (gen_random_uuid(), 'Vikram Singh', 'Balwant Singh', 'Harjeet Kaur', 'Business Owner', 3, '321 Market Rd, Chandigarh', 'Amritsar', 'vikram@community.test', '6666666666', 'APPROVED', 'MEMBER'), -- Trustee 2
    (gen_random_uuid(), 'Dr. Anjali Mehta', 'Suresh Mehta', 'Nalini Mehta', 'Professor', 2, '555 Education Ln, Pune', 'Nagpur', 'anjali@community.test', '5555555555', 'APPROVED', 'MEMBER'); -- Trustee 3

  -- 3. Insert Sample Announcements
  INSERT INTO announcements (title, content, announcement_date, created_by)
  VALUES 
    ('Annual General Meeting 2024', 'The annual general meeting will be held on December 15th at the community center. All members are requested to attend.', CURRENT_DATE, admin_user_id),
    ('Festival Celebration Fundraiser', 'We are collecting donations for the upcoming Diwali celebration. Please contact the treasurer for contributions.', CURRENT_DATE - INTERVAL '5 days', admin_user_id),
    ('New Community Website Launch', 'Our new portal is now live! Members can now update their profiles and connect with each other online.', CURRENT_DATE - INTERVAL '10 days', admin_user_id);

  -- 4. Insert Sample Financial Audits
  INSERT INTO financial_audits (title, description, audit_year, file_url, uploaded_at)
  VALUES 
    ('Financial Report FY 2023-24', 'Complete audited financial statements for the fiscal year 2023-24.', 2024, 'https://via.placeholder.com/150?text=PDF+Audit+2024', CURRENT_DATE),
    ('Q3 Expense Summary', 'Summary of expenses incurred during the third quarter.', 2024, 'https://via.placeholder.com/150?text=PDF+Q3', CURRENT_DATE - INTERVAL '3 months'),
    ('Annual Budget Approval 2023', 'Approved budget plan for the year 2023.', 2023, 'https://via.placeholder.com/150?text=PDF+Budget+2023', CURRENT_DATE - INTERVAL '1 year');

END $$;

-- ================================================================
-- INSTRUCTIONS FOR TESTING THE ADMIN WORKFLOW:
-- 1. Go to the Registration Page and sign up a REAL user.
-- 2. That user will appear in the database with 'PENDING_APPROVAL'.
-- 3. Log in to Supabase Dashboard -> Authentication -> Users.
-- 4. Find the new user's UUID.
-- 5. Run this SQL to make them an admin (replace <USER_UUID> with actual ID):
--    UPDATE profiles SET role = 'ADMIN' WHERE id = '<USER_UUID>';
-- 6. Log in as that user to access the Admin Dashboard.
-- ================================================================
