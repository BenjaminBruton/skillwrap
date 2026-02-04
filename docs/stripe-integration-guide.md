# SKILLWRAP Stripe Integration Guide

## Recommended Approach: Payment Intents (Not Products)

For your camp booking system, **Payment Intents** is the better choice because:

### Why Payment Intents Over Products?
1. **Dynamic Pricing**: Each session can have different pricing if needed
2. **Custom Metadata**: Store session ID, student info, camp details
3. **Better Control**: Handle complex booking logic before payment
4. **Flexible**: No need to pre-create products for every session
5. **Booking-Specific**: Perfect for one-time camp registrations

### Stripe Setup Steps

#### 1. Stripe Dashboard Setup
```
1. Go to Stripe Dashboard
2. Enable Test Mode
3. Get your API keys (publishable & secret)
4. Set up webhooks endpoint: https://yoursite.com/api/stripe/webhook
5. Subscribe to these events:
   - payment_intent.succeeded
   - payment_intent.payment_failed
```

#### 2. Implementation Flow
```
User Journey:
1. Select camp & session
2. Fill booking form (student info)
3. Review booking details
4. Create Payment Intent (server-side)
5. Collect payment (client-side)
6. Confirm booking (webhook)
```

## Code Implementation

### API Route: Create Payment Intent
```typescript
// src/app/api/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@clerk/nextjs'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, studentName, studentAge, amount } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        sessionId,
        studentName,
        studentAge: studentAge.toString(),
        userId,
        type: 'camp_booking'
      },
      description: `SKILLWRAP Camp Registration - ${studentName}`,
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
```

### Booking Flow Component
```typescript
// src/components/BookingFlow.tsx
'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BookingFlow({ session, camp }) {
  return (
    <Elements stripe={stripePromise}>
      <BookingForm session={session} camp={camp} />
    </Elements>
  )
}

function BookingForm({ session, camp }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    studentName: '',
    studentAge: '',
    parentEmail: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    try {
      // 1. Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          studentName: bookingData.studentName,
          studentAge: parseInt(bookingData.studentAge),
          amount: camp.price
        })
      })

      const { clientSecret, paymentIntentId } = await response.json()

      // 2. Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: bookingData.studentName,
            email: bookingData.parentEmail
          }
        }
      })

      if (error) {
        console.error('Payment failed:', error)
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful - booking will be created via webhook
        window.location.href = `/booking/success?payment_intent=${paymentIntent.id}`
      }
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Student Name"
          value={bookingData.studentName}
          onChange={(e) => setBookingData({...bookingData, studentName: e.target.value})}
          className="input"
          required
        />
        <input
          type="number"
          placeholder="Student Age"
          value={bookingData.studentAge}
          onChange={(e) => setBookingData({...bookingData, studentAge: e.target.value})}
          className="input"
          required
        />
      </div>

      {/* Payment */}
      <div className="card p-4">
        <h3 className="font-semibold mb-4">Payment Information</h3>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' }
              }
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full"
      >
        {loading ? 'Processing...' : `Pay $${camp.price} & Book Camp`}
      </button>
    </form>
  )
}
```

### Webhook Handler
```typescript
// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const { sessionId, studentName, studentAge, userId } = paymentIntent.metadata

      // Create booking in database
      const { error } = await supabaseAdmin
        .from('bookings')
        .insert({
          user_id: userId,
          session_id: sessionId,
          student_name: studentName,
          student_age: parseInt(studentAge),
          stripe_payment_intent_id: paymentIntent.id,
          payment_status: 'completed',
          booking_status: 'confirmed',
          total_amount: paymentIntent.amount / 100
        })

      if (error) {
        console.error('Failed to create booking:', error)
        return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 })
      }

      // Update session capacity
      await supabaseAdmin.rpc('increment_session_bookings', { session_id: sessionId })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }
}
```

## Next Steps

1. **Set up Stripe account** and get API keys
2. **Create webhook endpoint** in Stripe dashboard
3. **Install Stripe dependencies**: `npm install @stripe/stripe-js @stripe/react-stripe-js`
4. **Build booking form** with payment collection
5. **Test with Stripe test cards**
6. **Handle success/failure states**

This approach gives you maximum flexibility for your camp booking system while maintaining security and reliability.