-- SKILLWRAP Sessions Table Update Script
-- Updates pricing and capacity based on user feedback and testing
-- Run this script in your Supabase SQL editor

-- First, let's see the current camp IDs to reference them correctly
-- You may need to adjust the camp_id values based on your actual UUIDs

-- Update sessions for Software Dev: AI-Powered Productivity
-- Price: $300, Capacity: 12
UPDATE sessions 
SET max_capacity = 12
WHERE camp_id = (
    SELECT id FROM camps WHERE slug = 'software-dev-ai'
);

-- Update sessions for Full-Stack Dev: The Startup Prototype  
-- Price: $300, Capacity: 12
UPDATE sessions 
SET max_capacity = 12
WHERE camp_id = (
    SELECT id FROM camps WHERE slug = 'fullstack-startup'
);

-- Update sessions for Entrepreneurship: Little Shark Tank
-- Price: $275, Capacity: 15
UPDATE sessions 
SET max_capacity = 15
WHERE camp_id = (
    SELECT id FROM camps WHERE slug = 'entrepreneurship-shark-tank'
);

-- Update sessions for Esports Academy: The Business of Play
-- Price: $275, Capacity: 15
UPDATE sessions 
SET max_capacity = 15
WHERE camp_id = (
    SELECT id FROM camps WHERE slug = 'esports-academy'
);

-- Update the updated_at timestamp for all modified sessions
UPDATE sessions 
SET updated_at = NOW()
WHERE camp_id IN (
    SELECT id FROM camps WHERE slug IN (
        'software-dev-ai', 
        'fullstack-startup', 
        'entrepreneurship-shark-tank', 
        'esports-academy'
    )
);

-- Verify the updates
SELECT 
    c.name as camp_name,
    c.slug,
    c.price as camp_price,
    s.week_number,
    s.time_slot,
    s.start_date,
    s.end_date,
    s.max_capacity as session_capacity,
    s.current_bookings
FROM sessions s
JOIN camps c ON s.camp_id = c.id
ORDER BY s.week_number, s.time_slot, c.name;

-- Optional: Update any sessions that might be marked as 'full' but now have capacity
UPDATE sessions 
SET status = 'open'
WHERE status = 'full' 
AND current_bookings < max_capacity;

-- Summary of changes made:
-- Software Dev: AI-Powered Productivity - Capacity: 12 (Price: $300 - update in camps table)
-- Full-Stack Dev: The Startup Prototype - Capacity: 12 (Price: $300 - update in camps table)  
-- Entrepreneurship: Little Shark Tank - Capacity: 15 (Price: $275 - update in camps table)
-- Esports Academy: The Business of Play - Capacity: 15 (Price: $275 - update in camps table)