import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('🧪 WEBHOOK TEST ENDPOINT HIT')
  console.log('🕐 Timestamp:', new Date().toISOString())
  
  try {
    const body = await req.text()
    const headers = Object.fromEntries(req.headers.entries())
    
    console.log('📋 Headers:', JSON.stringify(headers, null, 2))
    console.log('📦 Body length:', body.length)
    console.log('📦 Body preview:', body.substring(0, 200) + '...')
    
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      hasStripeSignature: !!headers['stripe-signature']
    })
  } catch (error) {
    console.error('🚨 Webhook test error:', error)
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook test endpoint is active',
    timestamp: new Date().toISOString()
  })
}