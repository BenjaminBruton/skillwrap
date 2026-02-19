-- Discount Codes Table Schema
-- Run this script in your Supabase SQL editor

-- Create discount_codes table
CREATE TABLE discount_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2), -- For percentage discounts, cap the max discount
    usage_limit INTEGER, -- NULL means unlimited
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    applicable_camps TEXT[], -- Array of camp slugs, NULL means all camps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX idx_discount_codes_valid_dates ON discount_codes(valid_from, valid_until);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Discount codes are viewable by everyone" ON discount_codes FOR SELECT USING (true);
CREATE POLICY "Admins can manage discount codes" ON discount_codes FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE clerk_user_id = auth.uid()::text AND role = 'admin')
);

-- Function to validate discount code
CREATE OR REPLACE FUNCTION validate_discount_code(
    p_code VARCHAR(50),
    p_camp_slug VARCHAR(100) DEFAULT NULL,
    p_order_amount DECIMAL(10,2) DEFAULT 0
)
RETURNS TABLE(
    is_valid BOOLEAN,
    discount_id UUID,
    discount_type VARCHAR(20),
    discount_value DECIMAL(10,2),
    calculated_discount DECIMAL(10,2),
    error_message TEXT
) AS $$
DECLARE
    discount_record RECORD;
    calculated_discount_amount DECIMAL(10,2) := 0;
BEGIN
    -- Find the discount code
    SELECT * INTO discount_record
    FROM discount_codes
    WHERE code = p_code
    AND is_active = true;

    -- Check if code exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(20), NULL::DECIMAL(10,2), 0::DECIMAL(10,2), 'Invalid discount code'::TEXT;
        RETURN;
    END IF;

    -- Check if code is within valid date range
    IF discount_record.valid_from > NOW() THEN
        RETURN QUERY SELECT false, discount_record.id, discount_record.discount_type, discount_record.discount_value, 0::DECIMAL(10,2), 'Discount code is not yet active'::TEXT;
        RETURN;
    END IF;

    IF discount_record.valid_until IS NOT NULL AND discount_record.valid_until < NOW() THEN
        RETURN QUERY SELECT false, discount_record.id, discount_record.discount_type, discount_record.discount_value, 0::DECIMAL(10,2), 'Discount code has expired'::TEXT;
        RETURN;
    END IF;

    -- Check usage limit
    IF discount_record.usage_limit IS NOT NULL AND discount_record.used_count >= discount_record.usage_limit THEN
        RETURN QUERY SELECT false, discount_record.id, discount_record.discount_type, discount_record.discount_value, 0::DECIMAL(10,2), 'Discount code usage limit reached'::TEXT;
        RETURN;
    END IF;

    -- Check minimum order amount
    IF p_order_amount < discount_record.min_order_amount THEN
        RETURN QUERY SELECT false, discount_record.id, discount_record.discount_type, discount_record.discount_value, 0::DECIMAL(10,2), 
            CONCAT('Minimum order amount of $', discount_record.min_order_amount, ' required')::TEXT;
        RETURN;
    END IF;

    -- Check if applicable to specific camps
    IF discount_record.applicable_camps IS NOT NULL AND p_camp_slug IS NOT NULL THEN
        IF NOT (p_camp_slug = ANY(discount_record.applicable_camps)) THEN
            RETURN QUERY SELECT false, discount_record.id, discount_record.discount_type, discount_record.discount_value, 0::DECIMAL(10,2), 'Discount code not applicable to this camp'::TEXT;
            RETURN;
        END IF;
    END IF;

    -- Calculate discount amount
    IF discount_record.discount_type = 'percentage' THEN
        calculated_discount_amount := p_order_amount * (discount_record.discount_value / 100);
        -- Apply max discount cap if set
        IF discount_record.max_discount_amount IS NOT NULL AND calculated_discount_amount > discount_record.max_discount_amount THEN
            calculated_discount_amount := discount_record.max_discount_amount;
        END IF;
    ELSE -- fixed_amount
        calculated_discount_amount := discount_record.discount_value;
        -- Don't let discount exceed order amount
        IF calculated_discount_amount > p_order_amount THEN
            calculated_discount_amount := p_order_amount;
        END IF;
    END IF;

    -- Return valid result
    RETURN QUERY SELECT true, discount_record.id, discount_record.discount_type, discount_record.discount_value, calculated_discount_amount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_discount_usage(p_discount_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE discount_codes 
    SET 
        used_count = used_count + 1,
        updated_at = NOW()
    WHERE id = p_discount_id;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample discount codes
INSERT INTO discount_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_until) VALUES
('WELCOME10', '10% off for new customers', 'percentage', 10.00, 100.00, 50.00, NULL, '2026-12-31 23:59:59'),
('SAVE25', '$25 off orders over $200', 'fixed_amount', 25.00, 200.00, NULL, 100, '2026-12-31 23:59:59'),
('EARLYBIRD', '15% off early registration', 'percentage', 15.00, 0.00, 75.00, 50, '2026-06-01 23:59:59'),
('SIBLING20', '20% off for sibling registrations', 'percentage', 20.00, 300.00, 100.00, NULL, '2026-12-31 23:59:59');

-- Verify the setup
SELECT 
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    usage_limit,
    used_count,
    is_active
FROM discount_codes
ORDER BY created_at;