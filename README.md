# SKILLWRAP - Tech Summer Camp Website

A modern Next.js website for SKILLWRAP tech summer camps featuring camp registration, payment processing, and user management.

## 🏕️ Camps Offered

1. **Software Dev: AI-Powered Productivity** - $299 (Ages 13-17)
2. **Full-Stack Dev: The Startup Prototype** - $349 (Ages 14-18)
3. **Entrepreneurship: Little Shark Tank** - $199 (Ages 12-16)
4. **Esports Academy** - $249 (Ages 13-17)

Each camp runs 4 times over the summer with morning and afternoon sessions.

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Payments**: Stripe
- **Deployment**: Vercel

## 📋 Prerequisites

Before setting up the project, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Clerk account and application
- A Stripe account (test mode for development)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Fill in the following variables in `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Create Supabase Tables

Run the following SQL in your Supabase SQL editor:

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

-- Users table
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

-- Indexes
CREATE INDEX idx_sessions_camp_id ON sessions(camp_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_camps_slug ON camps(slug);

-- Enable RLS
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Camps are viewable by everyone" ON camps FOR SELECT USING (true);
CREATE POLICY "Sessions are viewable by everyone" ON sessions FOR SELECT USING (true);
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid()::text = user_id);
```

#### Insert Sample Data

```sql
-- Insert camps
INSERT INTO camps (name, slug, description, short_description, age_range, max_capacity, price, image_url) VALUES
('Software Dev: AI-Powered Productivity', 'software-dev-ai', 'Learn to build AI-powered applications and productivity tools using modern frameworks and machine learning APIs.', 'Build AI apps and productivity tools', '13-17', 20, 299.00, '/images/camps/software-dev-ai.jpg'),
('Full-Stack Dev: The Startup Prototype', 'fullstack-startup', 'Create a complete web application from concept to deployment, learning both frontend and backend development.', 'Build a complete web app from scratch', '14-18', 18, 349.00, '/images/camps/fullstack-startup.jpg'),
('Entrepreneurship: Little Shark Tank', 'entrepreneurship-shark-tank', 'Develop business ideas, create pitches, and present to a panel of judges in our mini Shark Tank competition.', 'Pitch your startup idea like on Shark Tank', '12-16', 25, 199.00, '/images/camps/entrepreneurship.jpg'),
('Esports Academy', 'esports-academy', 'Master competitive gaming strategies, team coordination, and streaming while learning about the esports industry.', 'Master competitive gaming and streaming', '13-17', 16, 249.00, '/images/camps/esports.jpg');

-- Insert sample sessions (adjust dates as needed)
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

### 4. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your sign-in/sign-up pages
3. Add your domain to allowed origins
4. Copy your publishable and secret keys to `.env.local`

### 5. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the dashboard
3. Set up webhooks for payment processing
4. Copy your keys to `.env.local`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
skillwrap/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── api/             # API routes
│   │   ├── camps/           # Camp pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── admin/           # Admin dashboard
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript types
├── plans/                   # Architecture documentation
├── public/                  # Static assets
└── README.md
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features

- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Authentication**: Secure user management with Clerk
- **Payment Processing**: Stripe integration for camp bookings
- **Database**: Supabase with Row Level Security
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, accessible interface

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Make sure to set all environment variables in your production environment with production values (not test keys).

## 📚 Documentation

- [Architecture Plan](plans/skillwrap-architecture.md)
- [Implementation Guide](plans/implementation-guide.md)
- [Project Summary](plans/project-summary.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for SKILLWRAP.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.