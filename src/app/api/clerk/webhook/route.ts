import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = req.headers
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || 'whsec_your_webhook_secret_here')

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log(`🔔 Clerk webhook received: ${eventType}`)

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      
      default:
        console.log(`❓ Unhandled Clerk event type: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('💥 Clerk webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleUserCreated(userData: any) {
  console.log('👤 Creating user in Supabase:', userData.id)
  
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_user_id: userData.id,
        email: userData.email_addresses[0]?.email_address || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone_numbers[0]?.phone_number || null,
        role: 'parent' // Default role
      })

    if (error) {
      console.error('❌ Failed to create user in Supabase:', error)
      throw error
    }

    console.log('✅ User created successfully in Supabase')
  } catch (error) {
    console.error('💥 Error creating user:', error)
    throw error
  }
}

async function handleUserUpdated(userData: any) {
  console.log('📝 Updating user in Supabase:', userData.id)
  
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        email: userData.email_addresses[0]?.email_address || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone_numbers[0]?.phone_number || null,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', userData.id)

    if (error) {
      console.error('❌ Failed to update user in Supabase:', error)
      throw error
    }

    console.log('✅ User updated successfully in Supabase')
  } catch (error) {
    console.error('💥 Error updating user:', error)
    throw error
  }
}

async function handleUserDeleted(userData: any) {
  console.log('🗑️ Deleting user from Supabase:', userData.id)
  
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('clerk_user_id', userData.id)

    if (error) {
      console.error('❌ Failed to delete user from Supabase:', error)
      throw error
    }

    console.log('✅ User deleted successfully from Supabase')
  } catch (error) {
    console.error('💥 Error deleting user:', error)
    throw error
  }
}