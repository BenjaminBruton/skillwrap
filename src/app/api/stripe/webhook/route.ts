import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    console.log(`🔔 Webhook received: ${event.type}`)
    console.log(`📋 Event data:`, JSON.stringify(event.data.object, null, 2))
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('💰 Processing payment success...')
        await handlePaymentSuccess(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        console.log('❌ Processing payment failure...')
        await handlePaymentFailed(event.data.object)
        break
      
      case 'payment_intent.canceled':
        console.log('🚫 Processing payment cancellation...')
        await handlePaymentCanceled(event.data.object)
        break
      
      default:
        console.log(`❓ Unhandled event type: ${event.type}`)
    }

    console.log('✅ Webhook processed successfully')
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('💥 Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  console.log('🔍 Payment Intent Metadata:', paymentIntent.metadata)
  
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
  } = paymentIntent.metadata

  // Only process camp bookings
  if (paymentIntent.metadata.type !== 'camp_booking') {
    console.log('⚠️ Not a camp booking, skipping...')
    return
  }

  console.log(`👤 Processing booking for user: ${userId}`)
  console.log(`🎯 Session ID: ${sessionId}`)
  console.log(`👶 Student: ${studentName}, Age: ${studentAge}`)

  try {
    // Try to create booking in database first
    let booking = null
    try {
      const { data: dbBooking, error: bookingError } = await supabaseAdmin
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
          dietary_restrictions: dietaryRestrictions || null,
          special_needs: specialNeeds || null,
          stripe_payment_intent_id: paymentIntent.id,
          payment_status: 'completed',
          booking_status: 'confirmed',
          total_amount: paymentIntent.amount / 100
        })
        .select()
        .single()

      if (!bookingError && dbBooking) {
        booking = dbBooking
        
        // Update session booking count
        const { error: updateError } = await supabaseAdmin
          .rpc('increment_session_bookings', {
            session_id: sessionId
          })

        if (updateError) {
          console.error('Failed to update session bookings:', updateError)
        }
        
        console.log(`Booking created in database for payment ${paymentIntent.id}`)
      } else {
        throw bookingError
      }
    } catch (dbError) {
      console.log('Database not available, storing booking locally:', dbError)
      
      // Fallback: Store booking data locally
      booking = {
        id: `local_${paymentIntent.id}`,
        user_id: userId,
        session_id: sessionId,
        student_name: studentName,
        student_age: parseInt(studentAge),
        parent_email: parentEmail,
        parent_phone: parentPhone || null,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        dietary_restrictions: dietaryRestrictions || null,
        special_needs: specialNeeds || null,
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'completed',
        booking_status: 'confirmed',
        total_amount: paymentIntent.amount / 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Store in local file system as fallback
      await storeBookingLocally(booking)
      console.log(`Booking stored locally for payment ${paymentIntent.id}`)
    }
    
    // TODO: Send confirmation email here
    // await sendBookingConfirmationEmail(booking)
    
  } catch (error) {
    console.error('Error processing successful payment:', error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  console.log(`Payment failed for intent: ${paymentIntent.id}`)
  
  // Log the failure for analytics/debugging
  const { error } = await supabaseAdmin
    .from('payment_logs')
    .insert({
      payment_intent_id: paymentIntent.id,
      status: 'failed',
      metadata: paymentIntent.metadata,
      amount: paymentIntent.amount / 100,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('Failed to log payment failure:', error)
  }

  // TODO: Send payment failure notification email
  // await sendPaymentFailureEmail(paymentIntent.metadata.parentEmail)
}

async function handlePaymentCanceled(paymentIntent: any) {
  console.log(`Payment canceled for intent: ${paymentIntent.id}`)
  
  // Clean up any pending booking records if they exist
  const { error } = await supabaseAdmin
    .from('bookings')
    .delete()
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .eq('payment_status', 'pending')

  if (error) {
    console.error('Failed to clean up canceled payment:', error)
  }
}

// Fallback function to store bookings locally when database is not available
async function storeBookingLocally(booking: any) {
  try {
    const bookingsDir = path.join(process.cwd(), 'data', 'bookings')
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(bookingsDir)) {
      fs.mkdirSync(bookingsDir, { recursive: true })
    }
    
    // Store booking in a JSON file
    const bookingFile = path.join(bookingsDir, `${booking.user_id}.json`)
    let userBookings = []
    
    // Read existing bookings for this user
    if (fs.existsSync(bookingFile)) {
      const existingData = fs.readFileSync(bookingFile, 'utf8')
      userBookings = JSON.parse(existingData)
    }
    
    // Add new booking
    userBookings.push(booking)
    
    // Write back to file
    fs.writeFileSync(bookingFile, JSON.stringify(userBookings, null, 2))
    
    console.log(`Booking stored locally for user ${booking.user_id}`)
  } catch (error) {
    console.error('Failed to store booking locally:', error)
  }
}