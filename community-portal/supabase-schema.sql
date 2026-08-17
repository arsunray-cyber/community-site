-- ============================================
-- COMMUNITY PORTAL DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE approval_status AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED');
CREATE TYPE user_role AS ENUM ('MEMBER', 'ADMIN');

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    occupation TEXT NOT NULL,
    children_count INTEGER DEFAULT 0,
    current_address TEXT NOT NULL,
    native_place TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    approval_status approval_status DEFAULT 'PENDING_APPROVAL',
    role user_role DEFAULT 'MEMBER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Policy: Approved members can view other approved profiles
CREATE POLICY "Approved members can view approved profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.approval_status = 'APPROVED'
        )
        AND approval_status = 'APPROVED'
    );

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

-- Policy: Users can insert their own profile during registration
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published_date DATE DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
CREATE POLICY "Anyone can view announcements"
    ON announcements FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert announcements"
    ON announcements FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can update announcements"
    ON announcements FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can delete announcements"
    ON announcements FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

-- ============================================
-- FINANCIAL AUDITS TABLE
-- ============================================
CREATE TABLE financial_audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    pdf_url TEXT,
    fiscal_year INTEGER,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE financial_audits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial audits
CREATE POLICY "Anyone can view financial audits"
    ON financial_audits FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert financial audits"
    ON financial_audits FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can update financial audits"
    ON financial_audits FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can delete financial audits"
    ON financial_audits FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

-- ============================================
-- TRUSTEES TABLE
-- ============================================
CREATE TABLE trustees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    photo_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE trustees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trustees
CREATE POLICY "Anyone can view trustees"
    ON trustees FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert trustees"
    ON trustees FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can update trustees"
    ON trustees FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can delete trustees"
    ON trustees FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, approval_status, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'PENDING_APPROVAL',
        'MEMBER'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_audits_updated_at
    BEFORE UPDATE ON financial_audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trustees_updated_at
    BEFORE UPDATE ON trustees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- APP CONFIG TABLE (for admin settings)
-- ============================================
CREATE TABLE app_config (
    id SERIAL PRIMARY KEY,
    smtp_host TEXT,
    smtp_port INTEGER,
    smtp_user TEXT,
    smtp_password TEXT,
    email_from TEXT,
    resend_api_key TEXT,
    twilio_sid TEXT,
    twilio_token TEXT,
    twilio_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for app_config
-- Only admins can read/write config
CREATE POLICY "Admins can view app config"
    ON app_config FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can update app config"
    ON app_config FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'ADMIN'
        )
    );

-- Trigger to update timestamp
CREATE TRIGGER update_app_config_updated_at
    BEFORE UPDATE ON app_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Note: Run this in Supabase Dashboard > Storage or via API
-- CREATE storage bucket 'audits' for PDF documents
-- CREATE storage bucket 'profile-photos' for trustee photos

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================
-- INSERT INTO trustees (name, role, email, phone, display_order) VALUES
-- ('Rajesh Kumar', 'President', 'rajesh@community.org', '+91 98765 43210', 1),
-- ('Priya Sharma', 'Vice President', 'priya@community.org', '+91 98765 43211', 2),
-- ('Amit Patel', 'Secretary', 'amit@community.org', '+91 98765 43212', 3),
-- ('Sunita Singh', 'Treasurer', 'sunita@community.org', '+91 98765 43213', 4);
