-- Database functions for SKILLWRAP booking system

-- Function to increment session booking count
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

-- Function to decrement session booking count (for cancellations)
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

-- Function to get session availability
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

-- Create payment_logs table for tracking payment events
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_intent_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  metadata JSONB,
  amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_logs_intent_id ON payment_logs(payment_intent_id);