import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = user.primaryEmailAddress?.emailAddress

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    console.log('Debugging forms for email:', userEmail)

    // Check all three form tables
    const [esportsResult, mediaResult, generalResult] = await Promise.all([
      supabaseAdmin
        .from('esports_waivers')
        .select('*')
        .eq('parent_email', userEmail),
      
      supabaseAdmin
        .from('media_releases')
        .select('*')
        .eq('parent_email', userEmail),
      
      supabaseAdmin
        .from('general_waivers')
        .select('*')
        .eq('parent_email', userEmail)
    ])

    const debug = {
      userEmail,
      esportsWaivers: {
        count: esportsResult.data?.length || 0,
        data: esportsResult.data || [],
        error: esportsResult.error
      },
      mediaReleases: {
        count: mediaResult.data?.length || 0,
        data: mediaResult.data || [],
        error: mediaResult.error
      },
      generalWaivers: {
        count: generalResult.data?.length || 0,
        data: generalResult.data || [],
        error: generalResult.error
      }
    }

    console.log('Debug results:', debug)

    return NextResponse.json(debug)

  } catch (error) {
    console.error('Debug forms error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}