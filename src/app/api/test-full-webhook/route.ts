import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  console.log('🧪 TEST FULL WEBHOOK FLOW')
  
  try {
    const { userId, sessionId } = await req.json()
    
    if (!userId || !sessionId) {
      return NextResponse.json({ 
        error: 'Missing userId or sessionId',
        usage: 'POST with { userId: "clerk-user-id", sessionId: "session-uuid" }'
      }, { status: 400 })
    }
    
    console.log(`🔍 Testing full webhook flow for user: ${userId}, session: ${sessionId}`)
    
    // Step 1: Ensure user exists (same as webhook)
    await ensureUserExists(userId, 'test@webhook.com')
    
    // Step 2: Create booking (same as webhook)
    const testBooking = {
      user_id: userId,
      session_id: sessionId,
      student_name: 'Test Webhook Student',
      student_age: 13,
      parent_email: 'test@webhook.com',
      parent_phone: '555-0123',
      emergency_contact: 'Emergency Contact',
      emergency_phone: '555-0456',
      dietary_restrictions: null,
      special_needs: null,
      stripe_payment_intent_id: `test_full_${Date.now()}`,
      payment_status: 'completed',
      booking_status: 'confirmed',
      total_amount: 350.00
    }
    
    console.log('📝 Creating booking with user sync...')
    
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert(testBooking)
      .select()
      .single()
    
    if (bookingError) {
      console.error('❌ Booking creation failed:', bookingError)
      return NextResponse.json({ 
        error: 'Booking creation failed', 
        details: bookingError
      }, { status: 500 })
    }
    
    console.log('✅ Booking created successfully with user sync!')
    
    // Step 3: Update session count
    const { error: updateError } = await supabaseAdmin
      .rpc('increment_session_bookings', {
        session_id: sessionId
      })
    
    if (updateError) {
      console.error('⚠️ Session update failed:', updateError)
    }
    
    return NextResponse.json({ 
      success: true,
      booking,
      message: 'Full webhook flow test completed successfully'
    })
    
  } catch (error) {
    console.error('🚨 Full webhook test error:', error)
    return NextResponse.json({ 
      error: 'Full webhook test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Same function as in the webhook
async function ensureUserExists(clerkUserId: string, email: string) {
  console.log(`🔍 Checking if user exists in Supabase: ${clerkUserId}`)
  
  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single()
    
    if (existingUser) {
      console.log('✅ User already exists in Supabase')
      return
    }
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error checking user existence:', checkError)
      throw checkError
    }
    
    console.log('👤 User not found, fetching from Clerk and creating...')
    
    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId)
    
    // Create user in Supabase
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_user_id: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress || email,
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        role: 'parent'
      })
    
    if (error) {
      console.error('❌ Failed to create user in Supabase:', error)
      throw error
    }
    
    console.log('✅ User created successfully in Supabase')
    
  } catch (error) {
    console.error('💥 Error ensuring user exists:', error)
    // Don't throw - we want booking to proceed even if user sync fails
    console.log('⚠️ Continuing with booking despite user sync failure')
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test full webhook flow endpoint',
    usage: 'POST with { userId: "clerk-user-id", sessionId: "session-uuid" } to test complete webhook flow'
  })
}