-- Rename Tabletop Card Gaming to Trading Card Gaming
-- Run this in your Supabase SQL editor

-- Update the camp name
UPDATE camps
SET 
  name = 'Trading Card Gaming: Collector to Competitor',
  short_description = 'Transform your passion for card games into competitive mastery',
  updated_at = NOW()
WHERE slug = 'tabletop-gaming';

-- Verify the update
SELECT 
  id,
  name,
  slug,
  short_description,
  price,
  updated_at
FROM camps
WHERE slug = 'tabletop-gaming';
