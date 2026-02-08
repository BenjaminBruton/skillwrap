import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()

    // Map form field names to database field names
    const studentName = `${formData.camperFirstName} ${formData.camperLastName}`.trim()
    const parentName = `${formData.parentFirstName} ${formData.parentLastName}`.trim()
    
    // Validate required fields from the form
    const requiredFormFields = [
      'camperFirstName',
      'camperLastName',
      'parentFirstName',
      'parentLastName',
      'parentEmail',
      'mediaPermission'
    ]

    for (const field of requiredFormFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for duplicate submission
    const { data: existingRelease } = await supabaseAdmin
      .from('media_releases')
      .select('id')
      .eq('student_name', studentName)
      .eq('parent_email', formData.parentEmail)
      .single()

    if (existingRelease) {
      return NextResponse.json(
        { error: 'A media release has already been submitted for this student and parent email combination.' },
        { status: 409 }
      )
    }

    // Insert the media release data with mapped field names
    const { data, error } = await supabaseAdmin
      .from('media_releases')
      .insert([{
        student_name: studentName,
        parent_name: parentName,
        parent_email: formData.parentEmail,
        parent_phone: formData.parentPhone || '',
        permission_granted: formData.mediaPermission === 'granted',
        parent_signature: parentName,
        signature_date: new Date().toISOString().split('T')[0],
        submitted_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit media release. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email (similar to esports waiver)
    try {
      if (process.env.SENDGRID_API_KEY) {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">SKILLWRAP</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Tech Summer Camps</p>
            </div>
            
            <div style="padding: 30px; background: white;">
              <h2 style="color: #333; margin-bottom: 20px;">Media Release Confirmation</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Dear ${parentName},
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                Thank you for submitting the Media Release form for <strong>${studentName}</strong>.
                We have successfully received and processed your form.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Submission Details:</h3>
                <p style="margin: 5px 0;"><strong>Student:</strong> ${studentName}</p>
                <p style="margin: 5px 0;"><strong>Parent/Guardian:</strong> ${parentName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.parentEmail}</p>
                <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div style="background: ${formData.mediaPermission === 'granted' ? '#e8f5e8' : '#fff3cd'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: ${formData.mediaPermission === 'granted' ? '#155724' : '#856404'}; margin-top: 0;">Media Permission:</h3>
                <p style="margin: 5px 0; color: ${formData.mediaPermission === 'granted' ? '#155724' : '#856404'};">
                  <strong>${formData.mediaPermission === 'granted' ? 'GRANTED' : 'DENIED'}</strong>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                  ${formData.mediaPermission === 'granted'
                    ? 'You have granted permission for SKILLWRAP to use photos and videos of your child for promotional purposes.'
                    : 'You have denied permission for SKILLWRAP to use photos and videos of your child for promotional purposes. We will ensure your child is not included in any promotional materials.'}
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you have any questions or need to make changes, please contact us at
                <a href="mailto:ben@skillwrap.com" style="color: #667eea;">ben@skillwrap.com</a>.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://skillwrap.com'}/camps"
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Summer Camps
                </a>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0;">SKILLWRAP - Empowering the next generation of tech innovators</p>
              <p style="margin: 5px 0 0 0;">Waco, Texas</p>
            </div>
          </div>
        `

        const msg = {
          to: formData.parentEmail,
          from: process.env.SENDGRID_FROM_EMAIL || 'ben@skillwrap.com',
          subject: `SKILLWRAP - Media Release Confirmation for ${studentName}`,
          html: emailContent,
        }

        await sgMail.send(msg)
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Media release submitted successfully',
      data: data[0],
      redirectUrl: `/forms/success?type=media-release&student=${encodeURIComponent(studentName)}`
    })

  } catch (error) {
    console.error('Media release submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}