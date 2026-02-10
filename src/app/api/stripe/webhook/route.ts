import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'
import sgMail from '@sendgrid/mail'
import fs from 'fs'
import path from 'path'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

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
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break

      default:
        // Unhandled event type - no action needed
        break
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('💥 Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
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
    return
  }

  try {
    // First, ensure user exists in Supabase (auto-sync if missing)
    await ensureUserExists(userId, parentEmail)
    
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
        
        // Booking created successfully
      } else {
        throw bookingError
      }
    } catch (dbError) {
      // Database not available, using local storage fallback
      
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
      // Booking stored locally as fallback
    }
    
    // Send booking confirmation emails
    await sendBookingConfirmationEmails(booking, paymentIntent)
    
  } catch (error) {
    console.error('Error processing successful payment:', error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  
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
    
    // Booking stored locally as fallback
  } catch (error) {
    console.error('Failed to store booking locally:', error)
  }
}

// Ensure user exists in Supabase, create if missing
async function ensureUserExists(clerkUserId: string, email: string) {
  // Check if user exists in Supabase
  
  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('clerk_user_id')
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

// Send booking confirmation emails
async function sendBookingConfirmationEmails(booking: any, paymentIntent: any) {
  try {
    // Get session details from Supabase
    const { data: session } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        camps (
          name,
          slug
        )
      `)
      .eq('id', booking.session_id)
      .single()

    if (!session) {
      console.error('Session not found for booking confirmation email')
      return
    }

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (timeStr: string) => {
      return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }

    // Email to ben@skillwrap.com (admin notification)
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🎉 New Camp Booking Received!</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Session Information</h3>
          <p><strong>Camp:</strong> ${session.camps?.name}</p>
          <p><strong>Week:</strong> ${session.week_number}</p>
          <p><strong>Dates:</strong> ${formatDate(session.start_date)} - ${formatDate(session.end_date)}</p>
          <p><strong>Time:</strong> ${formatTime(session.start_time)} - ${formatTime(session.end_time)}</p>
          <p><strong>Time Slot:</strong> ${session.time_slot}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Student Information</h3>
          <p><strong>Student Name:</strong> ${booking.student_name}</p>
          <p><strong>Student Age:</strong> ${booking.student_age}</p>
        </div>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Parent/Guardian Contact</h3>
          <p><strong>Email:</strong> ${booking.parent_email}</p>
          <p><strong>Phone:</strong> ${booking.parent_phone || 'Not provided'}</p>
        </div>

        <div style="background-color: #fef7f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c2410c; margin-top: 0;">Emergency Contact</h3>
          <p><strong>Name:</strong> ${booking.emergency_contact}</p>
          <p><strong>Phone:</strong> ${booking.emergency_phone}</p>
        </div>

        ${booking.dietary_restrictions || booking.special_needs ? `
        <div style="background-color: #fdf4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #a21caf; margin-top: 0;">Additional Information</h3>
          ${booking.dietary_restrictions ? `<p><strong>Dietary Restrictions:</strong> ${booking.dietary_restrictions}</p>` : ''}
          ${booking.special_needs ? `<p><strong>Special Needs:</strong> ${booking.special_needs}</p>` : ''}
        </div>
        ` : ''}

        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Payment Information</h3>
          <p><strong>Amount Paid:</strong> $${booking.total_amount}</p>
          <p><strong>Payment Status:</strong> ${booking.payment_status}</p>
          <p><strong>Booking Status:</strong> ${booking.booking_status}</p>
          <p><strong>Stripe Payment ID:</strong> ${booking.stripe_payment_intent_id}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This booking was automatically processed through the SKILLWRAP booking system.
            You can view all bookings in the admin dashboard.
          </p>
        </div>
      </div>
    `

    // Email to parent (booking confirmation)
    const parentEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🎉 Booking Confirmed - SKILLWRAP Summer Camp</h2>
        
        <p>Thank you for booking with SKILLWRAP! We're excited to have ${booking.student_name} join us for an amazing tech camp experience.</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Your Booking Details</h3>
          <p><strong>Camp:</strong> ${session.camps?.name}</p>
          <p><strong>Student:</strong> ${booking.student_name} (Age ${booking.student_age})</p>
          <p><strong>Week:</strong> ${session.week_number}</p>
          <p><strong>Dates:</strong> ${formatDate(session.start_date)} - ${formatDate(session.end_date)}</p>
          <p><strong>Time:</strong> ${formatTime(session.start_time)} - ${formatTime(session.end_time)}</p>
          <p><strong>Amount Paid:</strong> $${booking.total_amount}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
          <ul>
            <li>You'll receive additional information about camp preparation closer to the start date</li>
            <li>Please ensure all required forms are completed before camp begins</li>
            <li>If you have any questions, contact us at ben@skillwrap.com</li>
          </ul>
        </div>

        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Important Reminders</h3>
          <ul>
            <li><strong>Cancellation Policy:</strong> Full refunds up to 2 weeks before, 50% refund up to 1 week before, or transfer to another session</li>
            <li><strong>Forms:</strong> Please complete all required waivers and forms before camp starts</li>
            <li><strong>Contact:</strong> For any questions, email ben@skillwrap.com</li>
          </ul>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Thank you for choosing SKILLWRAP! We can't wait to see ${booking.student_name} at camp.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            - The SKILLWRAP Team
          </p>
        </div>
      </div>
    `

    // Send admin notification email
    await sgMail.send({
      to: 'ben@skillwrap.com',
      from: 'ben@skillwrap.com',
      subject: `New Camp Booking: ${booking.student_name} - ${session.camps?.name}`,
      html: adminEmailContent
    })

    // Send parent confirmation email
    await sgMail.send({
      to: booking.parent_email,
      from: 'ben@skillwrap.com',
      subject: `Booking Confirmed - ${session.camps?.name} - SKILLWRAP`,
      html: parentEmailContent
    })

  } catch (error) {
    console.error('Failed to send booking confirmation emails:', error)
    // Don't throw - we don't want email failures to break the booking process
  }
}