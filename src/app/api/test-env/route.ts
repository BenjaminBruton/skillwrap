import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing environment variables...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('📍 Supabase URL:', supabaseUrl)
    console.log('🔑 Has Anon Key:', !!supabaseAnonKey, supabaseAnonKey?.substring(0, 20) + '...')
    console.log('🔐 Has Service Key:', !!supabaseServiceKey, supabaseServiceKey?.substring(0, 20) + '...')
    
    return NextResponse.json({
      success: true,
      env: {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        hasServiceKey: !!supabaseServiceKey,
        url: supabaseUrl,
        anonKeyPreview: supabaseAnonKey?.substring(0, 20) + '...',
        serviceKeyPreview: supabaseServiceKey?.substring(0, 20) + '...'
      }
    })
    
  } catch (error) {
    console.error('❌ Environment test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}