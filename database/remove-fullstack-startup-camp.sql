-- Remove Full-Stack Dev: The Startup Prototype camp and its sessions from SKILLWRAP database
-- Run this script in your Supabase SQL editor

-- First, delete all bookings for sessions of this camp (if any exist)
DELETE FROM bookings 
WHERE session_id IN (
  SELECT s.id 
  FROM sessions s 
  JOIN camps c ON s.camp_id = c.id 
  WHERE c.slug = 'fullstack-startup'
);

-- Then delete all sessions for this camp
DELETE FROM sessions 
WHERE camp_id IN (
  SELECT id FROM camps WHERE slug = 'fullstack-startup'
);

-- Finally, delete the camp itself
DELETE FROM camps WHERE slug = 'fullstack-startup';

-- Verify the camp and sessions have been removed
SELECT 
  'Camps remaining' as table_name,
  COUNT(*) as count
FROM camps
UNION ALL
SELECT 
  'Sessions remaining' as table_name,
  COUNT(*) as count
FROM sessions
UNION ALL
SELECT 
  'Bookings remaining' as table_name,
  COUNT(*) as count
FROM bookings;

-- Show remaining camps to confirm
SELECT name, slug FROM camps ORDER BY name;