-- Query to get all student names signed up for Week 1 of Junior Art Masterclass
-- Camp ID: 21ea5fd7-0b02-493b-8166-5d6684a5b8cb

-- Main Query: Get all student names for Week 1
SELECT 
    b.student_name,
    b.student_age,
    b.parent_email,
    b.booking_status,
    b.payment_status,
    b.created_at as booking_date,
    s.time_slot,
    s.start_date,
    s.end_date
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
    AND s.week_number = 1
ORDER BY b.student_name;

/*
-- ============================================
-- ALTERNATIVE QUERIES
-- ============================================

-- Simple version: Just student names for Week 1
SELECT 
    b.student_name
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
    AND s.week_number = 1
ORDER BY b.student_name;

-- Confirmed bookings only (completed payments)
SELECT 
    b.student_name,
    b.student_age,
    b.parent_email,
    s.time_slot,
    s.start_date
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
    AND s.week_number = 1
    AND b.booking_status = 'confirmed'
    AND b.payment_status = 'completed'
ORDER BY b.student_name;

-- Count of students in Week 1
SELECT 
    COUNT(b.id) as total_students_week1
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
    AND s.week_number = 1;

-- Breakdown by time slot for Week 1
SELECT 
    s.time_slot,
    COUNT(b.id) as student_count,
    GROUP_CONCAT(b.student_name, ', ') as student_names
FROM bookings b
JOIN sessions s ON b.session_id = s.id
WHERE s.camp_id = '21ea5fd7-0b02-493b-8166-5d6684a5b8cb'
    AND s.week_number = 1
GROUP BY s.time_slot
ORDER BY s.time_slot;
*/
