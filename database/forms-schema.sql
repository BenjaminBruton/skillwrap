-- SKILLWRAP Forms & Waivers Database Schema
-- Run this script in your Supabase SQL editor

-- Esports Waiver table
CREATE TABLE esports_waivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    camper_first_name VARCHAR(255) NOT NULL,
    camper_last_name VARCHAR(255) NOT NULL,
    camper_date_of_birth DATE NOT NULL,
    parent_first_name VARCHAR(255) NOT NULL,
    parent_last_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20),
    game_rating_e BOOLEAN NOT NULL DEFAULT false,
    game_rating_t BOOLEAN NOT NULL DEFAULT false,
    game_rating_m BOOLEAN NOT NULL DEFAULT false,
    consent BOOLEAN NOT NULL DEFAULT false,
    parent_signature VARCHAR(255) NOT NULL, -- Digital signature (typed name)
    signature_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Release Form table
CREATE TABLE media_releases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    form_date DATE NOT NULL,
    camper_first_name VARCHAR(255) NOT NULL,
    camper_last_name VARCHAR(255) NOT NULL,
    parent_first_name VARCHAR(255) NOT NULL,
    parent_last_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    media_permission VARCHAR(20) NOT NULL CHECK (media_permission IN ('granted', 'denied')),
    parent_signature VARCHAR(255) NOT NULL, -- Digital signature (typed name)
    signature_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- General Camp Waiver table
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
    parent_signature VARCHAR(255) NOT NULL, -- Digital signature (typed name)
    signature_date DATE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_esports_waivers_user_id ON esports_waivers(user_id);
CREATE INDEX idx_media_releases_user_id ON media_releases(user_id);
CREATE INDEX idx_general_waivers_user_id ON general_waivers(user_id);

-- Enable RLS
ALTER TABLE esports_waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_waivers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own forms)
CREATE POLICY "Users can view their own esports waivers" ON esports_waivers
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own esports waivers" ON esports_waivers
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own media releases" ON media_releases
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own media releases" ON media_releases
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Enable insert for all users" ON general_waivers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all users" ON general_waivers FOR SELECT USING (true);

-- Admin policies (for viewing all forms)
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