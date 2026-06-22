-- IMPORTANT: Change slug from 'tabletop-gaming' to 'trading-card-gaming'
-- This will break existing links temporarily until code is updated
-- Run this in your Supabase SQL editor

-- First, check current data
SELECT id, name, slug, image_url
FROM camps
WHERE slug = 'tabletop-gaming';

-- Update the camp slug
UPDATE camps
SET 
  slug = 'trading-card-gaming',
  name = 'Trading Card Gaming: Collector to Competitor',
  updated_at = NOW()
WHERE slug = 'tabletop-gaming';

-- Verify the update
SELECT id, name, slug, image_url, updated_at
FROM camps
WHERE slug = 'trading-card-gaming';
