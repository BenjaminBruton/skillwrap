-- Insert a test discount code with 90% off
INSERT INTO discount_codes (
  code,
  description,
  discount_type,
  discount_value,
  min_order_amount,
  max_discount_amount,
  usage_limit,
  used_count,
  valid_from,
  valid_until,
  applicable_camps,
  is_active
) VALUES (
  'TEST90',
  '90% off test discount code',
  'percentage',
  90,
  0,
  NULL, -- No max discount cap
  100,
  0,
  NOW(),
  NOW() + INTERVAL '1 year',
  NULL, -- Applies to all camps
  true
);