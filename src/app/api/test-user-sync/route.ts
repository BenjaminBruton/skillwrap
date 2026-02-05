import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  console.log('🧪 TEST USER SYNC ENDPOINT HIT')
  
  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
    
    console.log(`🔍 Testing user sync for: ${userId}`)
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()
    
    if (existingUser) {
      console.log('✅ User already exists in Supabase:', existingUser)
      return NextResponse.json({ 
        success: true,
        message: 'User already exists',
        user: existingUser
      })
    }
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error checking user existence:', checkError)
      return NextResponse.json({ 
        error: 'Error checking user existence', 
        details: checkError
      }, { status: 500 })
    }
    
    console.log('👤 User not found, fetching from Clerk and creating...')
    
    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId)
    console.log('📋 Clerk user data:', {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber
    })
    
    // Create user in Supabase
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_user_id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        role: 'parent'
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Failed to create user in Supabase:', createError)
      return NextResponse.json({ 
        error: 'Failed to create user', 
        details: createError
      }, { status: 500 })
    }
    
    console.log('✅ User created successfully in Supabase:', newUser)
    
    return NextResponse.json({ 
      success: true,
      message: 'User synced successfully',
      user: newUser,
      clerkData: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        phone: clerkUser.phoneNumbers[0]?.phoneNumber
      }
    })
    
  } catch (error) {
    console.error('🚨 Test user sync error:', error)
    return NextResponse.json({ 
      error: 'Test user sync failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test user sync endpoint',
    usage: 'POST with { userId: "clerk-user-id" } to test user sync'
  })
}