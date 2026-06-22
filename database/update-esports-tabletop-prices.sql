-- Update Esports Academy and Tabletop Gaming camp prices to $150
-- Run this script in your Supabase SQL editor

UPDATE camps
SET 
  price = 150.00,
  updated_at = NOW()
WHERE slug IN ('esports-academy', 'tabletop-gaming');

-- Verify the price update
SELECT 
  name,
  slug,
  price,
  age_range,
  max_capacity,
  updated_at
FROM camps
WHERE slug IN ('esports-academy', 'tabletop-gaming')
ORDER BY name;
