-- SKILLWRAP Complete Database Setup
-- Run this script in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS camps CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS payment_logs CASCADE;

-- Camps table
CREATE TABLE camps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    age_range VARCHAR(50),
    max_capacity INTEGER NOT NULL DEFAULT 20,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    time_slot VARCHAR(20) NOT NULL CHECK (time_slot IN ('morning', 'afternoon')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    current_bookings INTEGER DEFAULT 0,
    max_capacity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    student_age INTEGER NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20),
    emergency_contact VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    dietary_restrictions TEXT,
    special_needs TEXT,
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'waitlist')),
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (additional info beyond Clerk)
CREATE TABLE users (
    clerk_user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment logs table
CREATE TABLE payment_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    payment_intent_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    metadata JSONB,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_camp_id ON sessions(camp_id);
CREATE INDEX idx_sessions_week_slot ON sessions(week_number, time_slot);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_camps_slug ON camps(slug);
CREATE INDEX idx_payment_logs_intent_id ON payment_logs(payment_intent_id);

-- Enable RLS
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Camps are viewable by everyone" ON camps FOR SELECT USING (true);
CREATE POLICY "Sessions are viewable by everyone" ON sessions FOR SELECT USING (true);
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid()::text = user_id);

-- Admin policies (will need to set up admin role)
CREATE POLICY "Admins can manage everything" ON camps FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE clerk_user_id = auth.uid()::text AND role = 'admin')
);

-- Insert camps with correct capacities
INSERT INTO camps (name, slug, description, short_description, age_range, max_capacity, price, image_url) VALUES
(
    'Software Dev: AI-Powered Productivity', 
    'software-dev-ai', 
    'In this forward-looking program, students transition from "users" of AI to "builders" with it, mastering the tools that are currently redefining the software industry. Participants will learn to leverage Large Language Models (LLMs) and agentic frameworks to accelerate their coding workflow, focusing on prompt engineering, automated debugging, and integrating AI APIs into functional Python applications. By the end of the week, students will have built an AI-driven personal assistant or productivity bot, gaining a high-level understanding of the intersection between traditional logic and modern generative technology.',
    'Transition from AI "users" to "builders" with cutting-edge tools', 
    '13-18', 
    12, 
    350.00, 
    '/images/camps/software-dev-ai.jpg'
),
(
    'Full-Stack Dev: The Startup Prototype', 
    'fullstack-startup', 
    'Designed for the aspiring "solopreneur" or engineer, this camp mirrors the professional lifecycle of a modern web application. Students dive into the full stack—from designing responsive user interfaces with React and Tailwind CSS to managing cloud-based databases with tools like Supabase. The week is centered on building a "Minimum Viable Product" (MVP) for a real-world problem, teaching students how to handle user authentication, data persistence, and live deployment.',
    'Build a complete MVP from concept to deployment', 
    '13-18', 
    12, 
    350.00, 
    '/images/camps/fullstack-startup.jpg'
),
(
    'Entrepreneurship: Little Shark Tank', 
    'entrepreneurship-shark-tank', 
    'This immersive camp takes students through the high-stakes journey of a startup founder, from the initial "lightbulb moment" to a live investor pitch. Participants will learn the fundamentals of market research, product prototyping, and financial modeling (calculating profit margins and "burn rates") while developing a brand identity and marketing strategy. The program culminates in a "Shark Tank" style finale where students present their polished business plans to a panel of judges, honing the critical soft skills of public speaking, negotiation, and resilience.',
    'From lightbulb moment to live investor pitch', 
    '10-18', 
    20, 
    300.00, 
    '/images/camps/entrepreneurship.jpg'
),
(
    'Esports Academy: The Business of Play', 
    'esports-academy', 
    'Going far beyond the controller, this academy explores the multi-billion dollar ecosystem of the global Esports industry. Students will analyze the various professional pathways available, including tournament organization, broadcast production (using OBS and shoutcasting), team management, and digital branding. While incorporating high-level gameplay and strategic VOD reviews, the focus remains on the professional skills required to run an organization, providing students with a holistic view of how their passion for gaming translates into a viable career in sports and entertainment.',
    'Explore the multi-billion dollar esports ecosystem', 
    '10-18', 
    20, 
    300.00, 
    '/images/camps/esports.jpg'
);

-- Insert all sessions based on your schedule
INSERT INTO sessions (camp_id, week_number, time_slot, start_date, end_date, start_time, end_time, max_capacity)
SELECT 
    c.id,
    s.week_number,
    s.time_slot,
    s.start_date::date,
    s.end_date::date,
    s.start_time::time,
    s.end_time::time,
    c.max_capacity
FROM camps c
CROSS JOIN (
    VALUES
    -- Week 1: June 1-5, 2026
    ('software-dev-ai', 1, 'morning', '2026-06-01', '2026-06-05', '08:00', '12:00'),
    ('entrepreneurship-shark-tank', 1, 'afternoon', '2026-06-01', '2026-06-05', '13:00', '17:00'),
    
    -- Week 2: June 8-12, 2026
    ('fullstack-startup', 2, 'morning', '2026-06-08', '2026-06-12', '08:00', '12:00'),
    ('esports-academy', 2, 'afternoon', '2026-06-08', '2026-06-12', '13:00', '17:00'),
    
    -- Week 3: June 15-19, 2026
    ('entrepreneurship-shark-tank', 3, 'morning', '2026-06-15', '2026-06-19', '08:00', '12:00'),
    ('software-dev-ai', 3, 'afternoon', '2026-06-15', '2026-06-19', '13:00', '17:00'),
    
    -- Week 4: June 22-26, 2026
    ('esports-academy', 4, 'morning', '2026-06-22', '2026-06-26', '08:00', '12:00'),
    ('fullstack-startup', 4, 'afternoon', '2026-06-22', '2026-06-26', '13:00', '17:00'),
    
    -- Week 5: June 29 - July 3, 2026
    ('software-dev-ai', 5, 'morning', '2026-06-29', '2026-07-03', '08:00', '12:00'),
    ('entrepreneurship-shark-tank', 5, 'afternoon', '2026-06-29', '2026-07-03', '13:00', '17:00'),
    
    -- Week 6: July 6-10, 2026
    ('fullstack-startup', 6, 'morning', '2026-07-06', '2026-07-10', '08:00', '12:00'),
    ('esports-academy', 6, 'afternoon', '2026-07-06', '2026-07-10', '13:00', '17:00'),
    
    -- Week 7: July 13-17, 2026
    ('entrepreneurship-shark-tank', 7, 'morning', '2026-07-13', '2026-07-17', '08:00', '12:00'),
    ('software-dev-ai', 7, 'afternoon', '2026-07-13', '2026-07-17', '13:00', '17:00'),
    
    -- Week 8: July 20-24, 2026
    ('esports-academy', 8, 'morning', '2026-07-20', '2026-07-24', '08:00', '12:00'),
    ('fullstack-startup', 8, 'afternoon', '2026-07-20', '2026-07-24', '13:00', '17:00'),
    
    -- Week 9: July 27-31, 2026
    ('software-dev-ai', 9, 'morning', '2026-07-27', '2026-07-31', '08:00', '12:00'),
    ('entrepreneurship-shark-tank', 9, 'afternoon', '2026-07-27', '2026-07-31', '13:00', '17:00'),
    
    -- Week 10: August 3-7, 2026
    ('fullstack-startup', 10, 'morning', '2026-08-03', '2026-08-07', '08:00', '12:00'),
    ('esports-academy', 10, 'afternoon', '2026-08-03', '2026-08-07', '13:00', '17:00')
) AS s(camp_slug, week_number, time_slot, start_date, end_date, start_time, end_time)
WHERE c.slug = s.camp_slug;

-- Database functions
CREATE OR REPLACE FUNCTION increment_session_bookings(session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE sessions 
  SET 
    current_bookings = current_bookings + 1,
    status = CASE 
      WHEN current_bookings + 1 >= max_capacity THEN 'full'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_session_bookings(session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE sessions 
  SET 
    current_bookings = GREATEST(current_bookings - 1, 0),
    status = CASE 
      WHEN current_bookings - 1 < max_capacity AND status = 'full' THEN 'open'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_session_availability(session_id UUID)
RETURNS TABLE(
  available_spots INTEGER,
  is_available BOOLEAN,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (s.max_capacity - s.current_bookings) as available_spots,
    (s.current_bookings < s.max_capacity AND s.status = 'open') as is_available,
    s.status::TEXT
  FROM sessions s
  WHERE s.id = session_id;
END;
$$ LANGUAGE plpgsql;

-- Verify the setup
SELECT 
    c.name as camp_name,
    s.week_number,
    s.time_slot,
    s.start_date,
    s.end_date,
    s.max_capacity,
    s.current_bookings,
    (s.max_capacity - s.current_bookings) as available_spots
FROM sessions s
JOIN camps c ON s.camp_id = c.id
ORDER BY s.week_number, s.time_slot, c.name;