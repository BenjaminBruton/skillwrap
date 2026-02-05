import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing network connectivity to Supabase...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    console.log('📍 Testing URL:', supabaseUrl)
    
    // Test basic HTTP connectivity with shorter timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log('✅ Response received:', response.status)
    
    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      url: supabaseUrl,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Network test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      timestamp: new Date().toISOString(),
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    }, { status: 500 })
  }
}