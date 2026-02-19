-- Update camps table with correct data to match the camps listing page
-- Run this in your Supabase SQL editor

-- First, let's make sure we have the correct camps with the right prices
INSERT INTO camps (name, slug, description, short_description, age_range, max_capacity, price, image_url) VALUES
(
  'Software Dev: AI-Powered Productivity',
  'software-dev-ai',
  'In this forward-looking program, students transition from "users" of AI to "builders" with it, mastering the tools that are currently redefining the software industry. Participants will learn to leverage Large Language Models (LLMs) and agentic frameworks to accelerate their coding workflow, focusing on prompt engineering, automated debugging, and integrating AI APIs into functional Python applications. By the end of the week, students will have built an AI-driven personal assistant or productivity bot, gaining a high-level understanding of the intersection between traditional logic and modern generative technology.',
  'Transition from AI "users" to "builders" with cutting-edge tools',
  '13-18',
  12,
  300,
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
),
(
  'Entrepreneurship: Little Shark Tank',
  'entrepreneurship-shark-tank',
  'This immersive camp takes students through the high-stakes journey of a startup founder, from the initial "lightbulb moment" to a live investor pitch. Participants will learn the fundamentals of market research, product prototyping, and financial modeling (calculating profit margins and "burn rates") while developing a brand identity and marketing strategy. The program culminates in a "Shark Tank" style finale where students present their polished business plans to a panel of judges, honing the critical soft skills of public speaking, negotiation, and resilience.',
  'From lightbulb moment to live investor pitch',
  '10-18',
  15,
  275,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
),
(
  'Esports Academy: The Business of Play',
  'esports-academy',
  'Going far beyond the controller, this academy explores the multi-billion dollar ecosystem of the global Esports industry. Students will analyze the various professional pathways available, including tournament organization, broadcast production (using OBS and shoutcasting), team management, and digital branding. While incorporating high-level gameplay and strategic VOD reviews, the focus remains on the professional skills required to run an organization, providing students with a holistic view of how their passion for gaming translates into a viable career in sports and entertainment.',
  'Explore the multi-billion dollar esports ecosystem',
  '10-18',
  15,
  275,
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  age_range = EXCLUDED.age_range,
  max_capacity = EXCLUDED.max_capacity,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- Verify the camps are correctly inserted/updated
SELECT id, name, slug, price, age_range, max_capacity
FROM camps
WHERE slug IN ('software-dev-ai', 'entrepreneurship-shark-tank', 'esports-academy', 'tabletop-gaming')
ORDER BY name;