-- Add Tabletop Card Gaming camp and sessions to SKILLWRAP database
-- Run this script in your Supabase SQL editor

-- First, add the new camp to the camps table
INSERT INTO camps (id, name, slug, description, short_description, age_range, max_capacity, price, image_url, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Tabletop Card Gaming: Collector to Competitor',
  'tabletop-gaming',
  'Transform your passion for card games into competitive mastery! Learn advanced strategies, deck building, tournament play, and the business side of competitive gaming. Perfect for aspiring professional players and collectors who want to understand the deeper mechanics of their favorite games and develop the skills needed to compete at higher levels.',
  'Transform your passion for card games into competitive mastery',
  '10-18',
  20,
  200,
  '',
  NOW(),
  NOW()
);

-- Add the 4 sessions for Tabletop Card Gaming camp
-- Week 2: June 8-12, 2026
INSERT INTO sessions (id, camp_id, week_number, time_slot, start_date, end_date, start_time, end_time, current_bookings, max_capacity, status, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM camps WHERE slug = 'tabletop-gaming'),
  2,
  'afternoon',
  '2026-06-08',
  '2026-06-12',
  '12:00:00',
  '17:00:00',
  0,
  20,
  'open',
  NOW(),
  NOW()
);

-- Week 4: June 22-26, 2026
INSERT INTO sessions (id, camp_id, week_number, time_slot, start_date, end_date, start_time, end_time, current_bookings, max_capacity, status, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM camps WHERE slug = 'tabletop-gaming'),
  4,
  'afternoon',
  '2026-06-22',
  '2026-06-26',
  '12:00:00',
  '17:00:00',
  0,
  20,
  'open',
  NOW(),
  NOW()
);

-- Week 6: July 6-10, 2026
INSERT INTO sessions (id, camp_id, week_number, time_slot, start_date, end_date, start_time, end_time, current_bookings, max_capacity, status, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM camps WHERE slug = 'tabletop-gaming'),
  6,
  'afternoon',
  '2026-07-06',
  '2026-07-10',
  '12:00:00',
  '17:00:00',
  0,
  20,
  'open',
  NOW(),
  NOW()
);

-- Week 8: July 20-24, 2026
INSERT INTO sessions (id, camp_id, week_number, time_slot, start_date, end_date, start_time, end_time, current_bookings, max_capacity, status, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM camps WHERE slug = 'tabletop-gaming'),
  8,
  'afternoon',
  '2026-07-20',
  '2026-07-24',
  '12:00:00',
  '17:00:00',
  0,
  20,
  'open',
  NOW(),
  NOW()
);

-- Verify the data was inserted correctly
SELECT 
  c.name as camp_name,
  c.slug,
  c.price as camp_price,
  c.max_capacity as camp_capacity,
  s.week_number,
  s.start_date,
  s.end_date,
  s.start_time,
  s.end_time,
  s.time_slot,
  s.max_capacity as session_capacity
FROM camps c
JOIN sessions s ON c.id = s.camp_id
WHERE c.slug = 'tabletop-gaming'
ORDER BY s.week_number;