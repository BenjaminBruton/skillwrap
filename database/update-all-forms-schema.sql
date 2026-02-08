-- Migration script to update all form tables to match the API endpoints
-- Run this script in your Supabase SQL editor
-- WARNING: This will delete all existing data in the form tables

-- Drop existing tables if they exist
DROP TABLE IF EXISTS esports_waivers CASCADE;
DROP TABLE IF EXISTS media_releases CASCADE;
DROP TABLE IF EXISTS general_waivers CASCADE;

-- Recreate Esports Waiver table to match the API endpoint
CREATE TABLE esports_waivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_age INTEGER NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    emergency_contact_relationship VARCHAR(100) NOT NULL,
    medical_conditions TEXT,
    medications TEXT,
    allergies TEXT,
    e_rated_games_authorized BOOLEAN NOT NULL DEFAULT false,
    t_rated_games_authorized BOOLEAN NOT NULL DEFAULT false,
    m_rated_games_authorized BOOLEAN NOT NULL DEFAULT false,
    parent_signature VARCHAR(255) NOT NULL,
    signature_date DATE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate Media Release table to match the API endpoint
CREATE TABLE media_releases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_age INTEGER NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    permission_granted BOOLEAN NOT NULL,
    parent_signature VARCHAR(255) NOT NULL,
    signature_date DATE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate General Waiver table to match the API endpoint
CREATE TABLE general_waivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_age INTEGER NOT NULL,
    student_address VARCHAR(255),
    student_city VARCHAR(100),
    student_state VARCHAR(50),
    student_zip VARCHAR(20),
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_address VARCHAR(255),
    parent_city VARCHAR(100),
    parent_state VARCHAR(50),
    parent_zip VARCHAR(20),
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    emergency_contact_relationship VARCHAR(100) NOT NULL,
    medical_conditions TEXT,
    medications TEXT,
    allergies TEXT,
    dietary_restrictions TEXT,
    physician_name VARCHAR(255),
    physician_phone VARCHAR(20),
    insurance_company VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    assumption_of_risk_acknowledged BOOLEAN NOT NULL DEFAULT false,
    liability_release_acknowledged BOOLEAN NOT NULL DEFAULT false,
    indemnification_acknowledged BOOLEAN NOT NULL DEFAULT false,
    code_of_conduct_acknowledged BOOLEAN NOT NULL DEFAULT false,
    electronic_signature_consent BOOLEAN NOT NULL DEFAULT false,
    parent_signature VARCHAR(255) NOT NULL,
    signature_date DATE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE esports_waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_waivers ENABLE ROW LEVEL SECURITY;

-- Create policies for public form access (no authentication required)
CREATE POLICY "Enable insert for all users" ON esports_waivers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all users" ON esports_waivers FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON media_releases FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all users" ON media_releases FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON general_waivers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all users" ON general_waivers FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_esports_waivers_email ON esports_waivers(parent_email);
CREATE INDEX IF NOT EXISTS idx_esports_waivers_student ON esports_waivers(student_name);
CREATE INDEX IF NOT EXISTS idx_esports_waivers_submitted ON esports_waivers(submitted_at);

CREATE INDEX IF NOT EXISTS idx_media_releases_email ON media_releases(parent_email);
CREATE INDEX IF NOT EXISTS idx_media_releases_student ON media_releases(student_name);
CREATE INDEX IF NOT EXISTS idx_media_releases_submitted ON media_releases(submitted_at);

CREATE INDEX IF NOT EXISTS idx_general_waivers_email ON general_waivers(parent_email);
CREATE INDEX IF NOT EXISTS idx_general_waivers_student ON general_waivers(student_name);
CREATE INDEX IF NOT EXISTS idx_general_waivers_submitted ON general_waivers(submitted_at);

-- Admin policies (for viewing all forms if you have admin users)
-- Uncomment these if you have an admin system set up
/*
CREATE POLICY "Admins can view all esports waivers" ON esports_waivers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub' 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can view all media releases" ON media_releases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub' 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can view all general waivers" ON general_waivers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub' 
            AND role = 'admin'
        )
    );
*/