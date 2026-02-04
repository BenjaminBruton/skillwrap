import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      amount 
    } = await req.json()

    // Validate required fields
    if (!sessionId || !studentName || !studentAge || !parentEmail || !emergencyContact || !emergencyPhone || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get session details to validate
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        camp:camps(*)
      `)
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    // Check if session is available
    if (session.status !== 'open' || session.current_bookings >= session.max_capacity) {
      return NextResponse.json({ error: 'Session is full or unavailable' }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        sessionId,
        studentName,
        studentAge: studentAge.toString(),
        parentEmail,
        parentPhone: parentPhone || '',
        emergencyContact,
        emergencyPhone,
        dietaryRestrictions: dietaryRestrictions || '',
        specialNeeds: specialNeeds || '',
        userId,
        campName: session.camp.name,
        type: 'camp_booking'
      },
      description: `SKILLWRAP ${session.camp.name} - ${studentName}`,
      receipt_email: parentEmail,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Payment setup failed' },
      { status: 500 }
    )
  }
}