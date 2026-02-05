import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Debug: Fetching all bookings from database...')
    
    // Get all bookings with session data
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        session:sessions(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Debug: Error fetching bookings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`📊 Debug: Found ${bookings?.length || 0} total bookings`)
    
    // Group by status
    const statusCounts = bookings?.reduce((acc: any, booking: any) => {
      acc[booking.booking_status] = (acc[booking.booking_status] || 0) + 1
      return acc
    }, {}) || {}

    // Get confirmed bookings
    const confirmedBookings = bookings?.filter(b => b.booking_status === 'confirmed') || []
    
    console.log('📈 Debug: Status breakdown:', statusCounts)
    console.log(`✅ Debug: Confirmed bookings: ${confirmedBookings.length}`)

    return NextResponse.json({
      success: true,
      totalBookings: bookings?.length || 0,
      statusCounts,
      confirmedCount: confirmedBookings.length,
      bookings: bookings?.map(b => ({
        id: b.id,
        user_id: b.user_id,
        session_id: b.session_id,
        booking_status: b.booking_status,
        payment_intent_id: b.payment_intent_id,
        created_at: b.created_at,
        session_title: b.session?.title || 'Unknown Session'
      }))
    })

  } catch (error) {
    console.error('💥 Debug: Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}