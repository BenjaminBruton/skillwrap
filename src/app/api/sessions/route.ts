import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const campSlug = searchParams.get('camp')

    let query = supabase
      .from('sessions')
      .select(`
        *,
        camp:camps(*)
      `)
      .order('week_number', { ascending: true })
      .order('time_slot', { ascending: true })

    // Filter by camp if specified
    if (campSlug) {
      query = query.eq('camp.slug', campSlug)
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    // Add availability information
    const sessionsWithAvailability = sessions?.map(session => ({
      ...session,
      available_spots: session.max_capacity - session.current_bookings,
      is_available: session.current_bookings < session.max_capacity && session.status === 'open',
      is_full: session.current_bookings >= session.max_capacity || session.status === 'full'
    })) || []

    return NextResponse.json(sessionsWithAvailability)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}