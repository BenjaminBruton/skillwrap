-- Add 'closed' status to sessions table constraint
-- This allows sessions to be hidden from the website without deletion

-- Drop the existing constraint
ALTER TABLE sessions DROP CONSTRAINT sessions_status_check;

-- Add the new constraint with 'closed' included
ALTER TABLE sessions ADD CONSTRAINT sessions_status_check 
CHECK (status IN ('open', 'full', 'cancelled', 'closed'));

-- Update the API logic comment
COMMENT ON COLUMN sessions.status IS 'Session status: open (bookable), full (no spots), cancelled (admin cancelled), closed (hidden from website)';