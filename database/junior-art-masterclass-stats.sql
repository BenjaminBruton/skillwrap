-- Query to show booking statistics for Junior Art Masterclass
-- Camp ID: 21ea5fd7-0b02-493b-8166-5d6684a5b8cb
-- 
-- RECOMMENDED: Run this main query to get total students and total amount

SELECT 
    COUNT(b.id) as total_students,
    SUM(b.total_amount) as total_amount
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb';

/*
-- ============================================
-- ALTERNATIVE QUERIES (run separately)
-- ============================================

-- Query 2: Breakdown by booking and payment status
SELECT 
    b.booking_status,
    b.payment_status,
    COUNT(b.id) as student_count,
    SUM(b.total_amount) as total_amount
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
GROUP BY b.booking_status, b.payment_status
ORDER BY b.booking_status, b.payment_status;

-- Query 3: Confirmed bookings with completed payments only
SELECT 
    COUNT(b.id) as confirmed_students,
    SUM(b.total_amount) as confirmed_total_amount
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
    AND b.booking_status = 'confirmed'
    AND b.payment_status = 'completed';

-- Query 4: Comprehensive breakdown by session
SELECT 
    s.week_number,
    s.time_slot,
    s.start_date,
    s.end_date,
    COUNT(b.id) as students_booked,
    s.max_capacity,
    (s.max_capacity - COUNT(b.id)) as available_spots,
    SUM(b.total_amount) as session_total_amount
FROM sessions s
LEFT JOIN bookings b ON s.id = b.session_id 
    AND b.booking_status = 'confirmed'
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
GROUP BY s.id, s.week_number, s.time_slot, s.start_date, s.end_date, s.max_capacity
ORDER BY s.week_number, s.time_slot;
*/
