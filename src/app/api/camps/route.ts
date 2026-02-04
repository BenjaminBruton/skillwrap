import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: camps, error } = await supabase
      .from('camps')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching camps:', error)
      return NextResponse.json(
        { error: 'Failed to fetch camps' },
        { status: 500 }
      )
    }

    return NextResponse.json(camps)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}