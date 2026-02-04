import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  console.log('🧪 TEST WEBHOOK ENDPOINT HIT')
  
  try {
    // Simulate the exact payment intent data from your recent booking
    const mockPaymentIntent = {
      id: "pi_test_webhook",
      amount: 35000,
      metadata: {
        sessionId: "4c94e5bb-88f0-49c3-a181-e4cf27d3cdca", // From your recent booking
        studentName: "Test Webhook Student",
        studentAge: "13",
        parentEmail: "test@webhook.com",
        parentPhone: "12547301670",
        emergencyContact: "Emergency Contact",
        emergencyPhone: "12547301670",
        dietaryRestrictions: "n/a",
        specialNeeds: "n/a",
        userId: "user_39DtBsjrvaRwhxbQo8StV3vDVda",
        campName: "Full-Stack Dev: The Startup Prototype",
        type: "camp_booking"
      }
    }
    
    console.log('🔍 Processing mock payment intent:', mockPaymentIntent.id)
    console.log('📋 Metadata:', mockPaymentIntent.metadata)
    
    // Extract metadata (same logic as webhook)
    const {
      sessionId,
      studentName,
      studentAge,
      parentEmail,
      parentPhone,
      emergencyContact,
      emergencyPhone,
      dietaryRestrictions,
      specialNeeds,
      userId
    } = mockPaymentIntent.metadata
    
    // Only process camp bookings
    if (mockPaymentIntent.metadata.type !== 'camp_booking') {
      console.log('⚠️ Not a camp booking, skipping...')
      return NextResponse.json({ error: 'Not a camp booking' }, { status: 400 })
    }
    
    console.log(`👤 Processing booking for user: ${userId}`)
    console.log(`🎯 Session ID: ${sessionId}`)
    console.log(`👶 Student: ${studentName}, Age: ${studentAge}`)
    
    // Try to create booking in database
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        session_id: sessionId,
        student_name: studentName,
        student_age: parseInt(studentAge),
        parent_email: parentEmail,
        parent_phone: parentPhone || null,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        dietary_restrictions: dietaryRestrictions === 'n/a' ? null : dietaryRestrictions,
        special_needs: specialNeeds === 'n/a' ? null : specialNeeds,
        stripe_payment_intent_id: mockPaymentIntent.id,
        payment_status: 'completed',
        booking_status: 'confirmed',
        total_amount: mockPaymentIntent.amount / 100
      })
      .select()
      .single()
    
    if (bookingError) {
      console.error('❌ Booking creation failed:', bookingError)
      return NextResponse.json({ 
        error: 'Booking creation failed', 
        details: bookingError
      }, { status: 500 })
    }
    
    console.log('✅ Booking created successfully:', booking)
    
    // Update session booking count
    const { error: updateError } = await supabaseAdmin
      .rpc('increment_session_bookings', {
        session_id: sessionId
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
      message: 'Test webhook processed successfully - booking created!'
    })
    
  } catch (error) {
    console.error('🚨 Test webhook error:', error)
    return NextResponse.json({ 
      error: 'Test webhook failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test webhook endpoint - simulates successful payment processing',
    usage: 'POST to simulate webhook processing with mock payment data'
  })
}