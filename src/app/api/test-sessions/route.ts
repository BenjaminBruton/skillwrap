import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Fetching sessions from database...')
    
    // Get all sessions with camp info
    const { data: sessions, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        id,
        week_number,
        time_slot,
        start_date,
        end_date,
        start_time,
        end_time,
        current_bookings,
        max_capacity,
        status,
        camp:camps(
          id,
          name,
          slug,
          price
        )
      `)
      .order('start_date')
      .limit(10)
    
    if (error) {
      console.error('❌ Error fetching sessions:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch sessions', 
        details: error 
      }, { status: 500 })
    }
    
    console.log(`✅ Found ${sessions?.length || 0} sessions`)
    
    return NextResponse.json({
      success: true,
      totalSessions: sessions?.length || 0,
      sessions: sessions || [],
      sampleSessionId: sessions?.[0]?.id || null,
      message: 'Sessions fetched successfully'
    })
    
  } catch (error) {
    console.error('🚨 Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, testUserId } = await req.json()
    
    if (!sessionId || !testUserId) {
      return NextResponse.json({ 
        error: 'Missing sessionId or testUserId',
        usage: 'POST with { sessionId: "uuid", testUserId: "clerk-user-id" }'
      }, { status: 400 })
    }
    
    console.log(`🧪 Testing booking creation with session: ${sessionId}, user: ${testUserId}`)
    
    // Verify session exists
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        camp:camps(*)
      `)
      .eq('id', sessionId)
      .single()
    
    if (sessionError || !session) {
      return NextResponse.json({ 
        error: 'Session not found', 
        sessionId,
        details: sessionError
      }, { status: 400 })
    }
    
    console.log(`✅ Session found: ${session.camp.name} - Week ${session.week_number} ${session.time_slot}`)
    
    // Test booking data
    const testBooking = {
      user_id: testUserId,
      session_id: sessionId,
      student_name: 'Test Student',
      student_age: 12,
      parent_email: 'test@example.com',
      parent_phone: '555-0123',
      emergency_contact: 'Emergency Contact',
      emergency_phone: '555-0456',
      dietary_restrictions: null,
      special_needs: null,
      stripe_payment_intent_id: `test_${Date.now()}`,
      payment_status: 'completed',
      booking_status: 'confirmed',
      total_amount: session.camp.price
    }
    
    console.log('📝 Creating test booking...')
    
    // Try to create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert(testBooking)
      .select()
      .single()
    
    if (bookingError) {
      console.error('❌ Booking creation failed:', bookingError)
      return NextResponse.json({ 
        error: 'Booking creation failed', 
        details: bookingError,
        testData: testBooking
      }, { status: 500 })
    }
    
    console.log('✅ Booking created successfully!')
    
    // Try to update session booking count
    const { error: updateError } = await supabaseAdmin
      .rpc('increment_session_bookings', {
        session_id: sessionId
      })
    
    if (updateError) {
      console.error('⚠️ Session update failed:', updateError)
      return NextResponse.json({ 
        success: true,
        booking,
        session,
        warning: 'Booking created but session count update failed',
        updateError
      })
    }
    
    console.log('✅ Session booking count updated!')
    
    return NextResponse.json({ 
      success: true,
      booking,
      session,
      message: 'Test booking created and session updated successfully'
    })
    
  } catch (error) {
    console.error('🚨 Test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}