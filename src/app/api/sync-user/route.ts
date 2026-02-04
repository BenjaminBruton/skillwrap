import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    // Get the current user from Clerk
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('👤 Syncing user to Supabase:', user.id)
    
    // Check if user already exists in Supabase
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing user:', checkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingUser) {
      console.log('✅ User already exists in Supabase')
      return NextResponse.json({ 
        success: true, 
        message: 'User already synced',
        user: existingUser 
      })
    }

    // Create user in Supabase
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        phone: user.phoneNumbers[0]?.phoneNumber || null,
        role: 'parent' // Default role
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Failed to create user in Supabase:', insertError)
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
    }

    console.log('✅ User synced successfully to Supabase')
    return NextResponse.json({ 
      success: true, 
      message: 'User synced successfully',
      user: newUser 
    })

  } catch (error) {
    console.error('💥 Error syncing user:', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to sync your current Clerk user to Supabase',
    instructions: 'Make sure you are signed in to Clerk first'
  })
}