import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  console.log('🔧 DEBUG BOOKING ENDPOINT HIT')
  
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    console.log(`🔍 Using authenticated user: ${userId}`)
    
    // Get the first available session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        camp:camps(*)
      `)
      .eq('status', 'open')
      .lt('current_bookings', 'max_capacity')
      .limit(1)
      .single()
    
    if (sessionError || !session) {
      console.error('❌ No available sessions found:', sessionError)
      return NextResponse.json({
        error: 'No available sessions found',
        details: sessionError
      }, { status: 400 })
    }
    
    console.log(`🎯 Using session: ${session.id} (${session.camp.name})`)
    
    // Test booking data
    const testBooking = {
      user_id: userId,
      session_id: session.id,
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
    
    console.log('📝 Attempting to create booking:', testBooking)
    
    // Try to create booking in database
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
    
    console.log('✅ Booking created successfully:', booking)
    
    // Try to update session booking count
    const { error: updateError } = await supabaseAdmin
      .rpc('increment_session_bookings', {
        session_id: session.id
      })
    
    if (updateError) {
      console.error('⚠️ Session update failed:', updateError)
      return NextResponse.json({
        success: true,
        booking,
        warning: 'Booking created but session count update failed',
        updateError
      })
    }
    
    console.log('✅ Session booking count updated successfully')
    
    return NextResponse.json({
      success: true,
      booking,
      session: session,
      message: 'Test booking created and session updated successfully'
    })
    
  } catch (error) {
    console.error('🚨 Debug booking error:', error)
    return NextResponse.json({
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // List available sessions for debugging
    const { data: sessions, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        id,
        week_number,
        time_slot,
        start_date,
        end_date,
        current_bookings,
        max_capacity,
        status,
        camp:camps(name, slug, price)
      `)
      .eq('status', 'open')
      .order('start_date')
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch sessions', details: error }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Debug booking endpoint is active',
      usage: 'POST (authenticated) to test booking creation with first available session',
      availableSessions: sessions?.length || 0,
      sessions: sessions?.slice(0, 5) // Show first 5 sessions
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch debug info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}