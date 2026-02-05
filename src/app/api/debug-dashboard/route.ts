import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`🔍 Debug dashboard for user: ${userId}`)

    // Get all bookings for this user with detailed info
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        booking_status,
        payment_status,
        student_name,
        total_amount,
        created_at,
        updated_at,
        session:sessions(
          id,
          start_date,
          end_date,
          start_time,
          end_time,
          camp:camps(
            name,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching bookings:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings', details: error }, { status: 500 })
    }

    console.log(`📊 Found ${bookings?.length || 0} total bookings`)

    // Group bookings by status
    const statusCounts = {
      confirmed: 0,
      cancelled: 0,
      pending: 0,
      other: 0
    }

    bookings?.forEach(booking => {
      switch (booking.booking_status) {
        case 'confirmed':
          statusCounts.confirmed++
          break
        case 'cancelled':
          statusCounts.cancelled++
          break
        case 'pending':
          statusCounts.pending++
          break
        default:
          statusCounts.other++
      }
    })

    console.log('📈 Status breakdown:', statusCounts)

    return NextResponse.json({
      success: true,
      userId,
      totalBookings: bookings?.length || 0,
      statusCounts,
      bookings: bookings?.map(booking => ({
        id: booking.id,
        status: booking.booking_status,
        paymentStatus: booking.payment_status,
        student: booking.student_name,
        amount: booking.total_amount,
        camp: booking.session?.camp?.[0]?.name || 'Unknown',
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      })) || []
    })

  } catch (error) {
    console.error('🚨 Debug dashboard error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}