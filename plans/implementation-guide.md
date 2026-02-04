# SKILLWRAP Implementation Guide

## Phase 1: Project Setup & Configuration

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest skillwrap --typescript --tailwind --eslint --app
cd skillwrap
```

### 2. Install Required Dependencies
```bash
# Core dependencies
npm install @supabase/supabase-js @clerk/nextjs stripe

# UI and utility libraries
npm install @headlessui/react @heroicons/react clsx tailwind-merge
npm install react-hook-form @hookform/resolvers zod
npm install date-fns lucide-react

# Development dependencies
npm install -D @types/node
```

### 3. Environment Variables Setup
Create `.env.local`:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Phase 2: Database Setup

### Supabase SQL Schema
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    session_number INTEGER NOT NULL CHECK (session_number BETWEEN 1 AND 4),
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

-- Indexes for performance
CREATE INDEX idx_sessions_camp_id ON sessions(camp_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_camps_slug ON camps(slug);

-- RLS Policies
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read access for camps and sessions
CREATE POLICY "Camps are viewable by everyone" ON camps FOR SELECT USING (true);
CREATE POLICY "Sessions are viewable by everyone" ON sessions FOR SELECT USING (true);

-- Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid()::text = user_id);

-- Admin policies (will need to set up admin role)
CREATE POLICY "Admins can manage everything" ON camps FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE clerk_user_id = auth.uid()::text AND role = 'admin')
);
```

### Sample Data Insert
```sql
-- Insert sample camps
INSERT INTO camps (name, slug, description, short_description, age_range, max_capacity, price, image_url) VALUES
('Software Dev: AI-Powered Productivity', 'software-dev-ai', 'Learn to build AI-powered applications and productivity tools using modern frameworks and machine learning APIs.', 'Build AI apps and productivity tools', '13-17', 20, 299.00, '/images/camps/software-dev-ai.jpg'),
('Full-Stack Dev: The Startup Prototype', 'fullstack-startup', 'Create a complete web application from concept to deployment, learning both frontend and backend development.', 'Build a complete web app from scratch', '14-18', 18, 349.00, '/images/camps/fullstack-startup.jpg'),
('Entrepreneurship: Little Shark Tank', 'entrepreneurship-shark-tank', 'Develop business ideas, create pitches, and present to a panel of judges in our mini Shark Tank competition.', 'Pitch your startup idea like on Shark Tank', '12-16', 25, 199.00, '/images/camps/entrepreneurship.jpg'),
('Esports Academy', 'esports-academy', 'Master competitive gaming strategies, team coordination, and streaming while learning about the esports industry.', 'Master competitive gaming and streaming', '13-17', 16, 249.00, '/images/camps/esports.jpg');

-- Insert sample sessions (2 morning, 2 afternoon for each camp)
INSERT INTO sessions (camp_id, session_number, time_slot, start_date, end_date, start_time, end_time, max_capacity) 
SELECT 
    c.id,
    s.session_number,
    s.time_slot,
    s.start_date,
    s.end_date,
    s.start_time,
    s.end_time,
    c.max_capacity
FROM camps c
CROSS JOIN (
    VALUES 
    (1, 'morning', '2024-06-10', '2024-06-14', '09:00', '12:00'),
    (2, 'morning', '2024-06-17', '2024-06-21', '09:00', '12:00'),
    (3, 'afternoon', '2024-06-24', '2024-06-28', '13:00', '16:00'),
    (4, 'afternoon', '2024-07-01', '2024-07-05', '13:00', '16:00')
) AS s(session_number, time_slot, start_date, end_date, start_time, end_time);
```

## Phase 3: Core Configuration Files

### Supabase Client Setup
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Stripe Configuration
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
```

### TypeScript Types
```typescript
// src/types/index.ts
export interface Camp {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  age_range: string
  max_capacity: number
  price: number
  image_url: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  camp_id: string
  session_number: number
  time_slot: 'morning' | 'afternoon'
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  current_bookings: number
  max_capacity: number
  status: 'open' | 'full' | 'cancelled'
  created_at: string
  updated_at: string
  camp?: Camp
}

export interface Booking {
  id: string
  user_id: string
  session_id: string
  student_name: string
  student_age: number
  parent_email: string
  parent_phone?: string
  emergency_contact: string
  emergency_phone: string
  dietary_restrictions?: string
  special_needs?: string
  stripe_payment_intent_id?: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  booking_status: 'confirmed' | 'cancelled' | 'waitlist'
  total_amount: number
  created_at: string
  updated_at: string
  session?: Session
}

export interface BookingFormData {
  student_name: string
  student_age: number
  parent_email: string
  parent_phone?: string
  emergency_contact: string
  emergency_phone: string
  dietary_restrictions?: string
  special_needs?: string
}
```

## Phase 4: Key Components Structure

### Layout Components
- Header with navigation and auth status
- Footer with company info and links
- Sidebar for admin dashboard
- Loading states and error boundaries

### Camp Components
- CampCard for listings
- CampDetails for individual pages
- SessionSelector for booking
- AvailabilityIndicator

### Booking Components
- BookingForm with validation
- PaymentForm with Stripe integration
- BookingConfirmation
- BookingHistory

### Admin Components
- Dashboard overview with stats
- CampManager for CRUD operations
- SessionManager for scheduling
- BookingManager for order management

## Phase 5: API Routes Structure

### Public API Routes
- `GET /api/camps` - List all camps
- `GET /api/camps/[slug]` - Get camp details
- `GET /api/sessions` - List sessions with availability
- `GET /api/sessions/[id]` - Get session details

### Protected API Routes
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Payment API Routes
- `POST /api/stripe/create-payment-intent` - Initialize payment
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Admin API Routes
- `POST /api/admin/camps` - Create camp
- `PUT /api/admin/camps/[id]` - Update camp
- `POST /api/admin/sessions` - Create session
- `GET /api/admin/bookings` - Get all bookings

## Phase 6: Authentication Flow

### Clerk Integration
1. Wrap app with ClerkProvider
2. Protect routes with auth middleware
3. Create sign-in/sign-up pages
4. Implement role-based access control
5. Sync user data with Supabase

### User Roles
- **Parent**: Can book camps, view own bookings
- **Admin**: Full access to management features

## Phase 7: Payment Integration

### Stripe Checkout Flow
1. Create payment intent on booking
2. Collect payment information
3. Confirm payment
4. Handle webhooks for status updates
5. Update booking status in database

### Error Handling
- Payment failures
- Network issues
- Capacity conflicts
- Validation errors

This implementation guide provides the foundation for building the SKILLWRAP website with all the specified features and integrations.