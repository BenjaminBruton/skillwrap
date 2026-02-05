import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await req.json()
    
    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    console.log(`🚫 Processing cancellation for booking: ${bookingId}`)

    // Get booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        session:sessions(
          id,
          start_date,
          camp:camps(name)
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', userId) // Ensure user can only cancel their own bookings
      .single()

    if (fetchError || !booking) {
      console.error('❌ Booking not found:', fetchError)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if booking can be cancelled (e.g., not already cancelled, not past start date)
    if (booking.booking_status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 })
    }

    // Check if session has already started (optional business rule)
    const sessionStartDate = new Date(booking.session.start_date)
    const now = new Date()
    const daysBefore = Math.ceil((sessionStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysBefore < 7) {
      return NextResponse.json({ 
        error: 'Cannot cancel booking less than 7 days before session starts',
        daysRemaining: daysBefore
      }, { status: 400 })
    }

    console.log(`📅 Session starts in ${daysBefore} days, cancellation allowed`)

    // Process Stripe refund if payment was made
    let refundResult = null
    if (booking.stripe_payment_intent_id && booking.payment_status === 'completed') {
      // Check if this is a test payment intent (starts with 'test_')
      if (booking.stripe_payment_intent_id.startsWith('test_')) {
        console.log(`🧪 Skipping refund for test payment: ${booking.stripe_payment_intent_id}`)
        refundResult = {
          refund_id: 'test_refund_' + Date.now(),
          amount: 350, // Mock refund amount
          status: 'succeeded'
        }
        console.log(`✅ Mock refund processed for test payment`)
      } else {
        try {
          console.log(`💰 Processing refund for payment: ${booking.stripe_payment_intent_id}`)
          
          const refund = await stripe.refunds.create({
            payment_intent: booking.stripe_payment_intent_id,
            reason: 'requested_by_customer',
            metadata: {
              booking_id: bookingId,
              user_id: userId,
              camp_name: booking.session.camp.name
            }
          })
          
          refundResult = {
            refund_id: refund.id,
            amount: refund.amount / 100,
            status: refund.status
          }
          
          console.log(`✅ Refund processed: ${refund.id} for $${refund.amount / 100}`)
        } catch (stripeError) {
          console.error('❌ Stripe refund failed:', stripeError)
          return NextResponse.json({
            error: 'Failed to process refund. Please contact support.',
            details: stripeError instanceof Error ? stripeError.message : 'Unknown error'
          }, { status: 500 })
        }
      }
    }

    // Update booking status to cancelled
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        booking_status: 'cancelled',
        payment_status: refundResult ? 'refunded' : booking.payment_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Failed to update booking status:', updateError)
      return NextResponse.json({ 
        error: 'Failed to cancel booking',
        details: updateError
      }, { status: 500 })
    }

    // Decrease session booking count
    const { error: sessionUpdateError } = await supabaseAdmin
      .rpc('decrement_session_bookings', {
        session_id: booking.session_id
      })

    if (sessionUpdateError) {
      console.error('⚠️ Failed to update session count:', sessionUpdateError)
      // Don't fail the request, just log the warning
    }

    console.log(`✅ Booking ${bookingId} cancelled successfully`)

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      refund: refundResult,
      message: refundResult 
        ? `Booking cancelled and refund of $${refundResult.amount} processed`
        : 'Booking cancelled successfully'
    })

  } catch (error) {
    console.error('🚨 Booking cancellation error:', error)
    return NextResponse.json({
      error: 'Failed to cancel booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}