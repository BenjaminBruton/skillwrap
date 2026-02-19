import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code, campSlug, orderAmount } = await req.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      )
    }

    // Call the Supabase function to validate the discount code
    const { data, error } = await supabase.rpc('validate_discount_code', {
      p_code: code.toUpperCase().trim(),
      p_camp_slug: campSlug || null,
      p_order_amount: orderAmount || 0
    })

    if (error) {
      console.error('Error validating discount code:', error)
      return NextResponse.json(
        { error: 'Failed to validate discount code' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 400 }
      )
    }

    const result = data[0]

    if (!result.is_valid) {
      return NextResponse.json(
        { error: result.error_message || 'Invalid discount code' },
        { status: 400 }
      )
    }

    // Return successful validation
    return NextResponse.json({
      valid: true,
      discountId: result.discount_id,
      discountType: result.discount_type,
      discountValue: result.discount_value,
      calculatedDiscount: result.calculated_discount,
      message: `Discount applied: ${result.discount_type === 'percentage' 
        ? `${result.discount_value}% off` 
        : `$${result.discount_value} off`}`
    })

  } catch (error) {
    console.error('Error in discount code validation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}