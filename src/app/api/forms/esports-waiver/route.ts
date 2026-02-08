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
      'camperDateOfBirth',
      'parentFirstName',
      'parentLastName',
      'parentEmail',
      'parentPhone',
      'consent'
    ]

    for (const field of requiredFormFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    if (!formData.consent) {
      return NextResponse.json(
        { error: 'You must agree to the terms and conditions' },
        { status: 400 }
      )
    }

    // Calculate age from date of birth
    const birthDate = new Date(formData.camperDateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Check for duplicate submission
    const { data: existingWaiver } = await supabaseAdmin
      .from('esports_waivers')
      .select('id')
      .eq('student_name', studentName)
      .eq('parent_email', formData.parentEmail)
      .single()

    if (existingWaiver) {
      return NextResponse.json(
        { error: 'An esports waiver has already been submitted for this student and parent email combination.' },
        { status: 409 }
      )
    }

    // Insert the waiver data with mapped field names
    const { data, error } = await supabaseAdmin
      .from('esports_waivers')
      .insert([{
        student_name: studentName,
        student_age: age,
        parent_name: parentName,
        parent_email: formData.parentEmail,
        parent_phone: formData.parentPhone,
        emergency_contact_name: formData.emergencyContactName || '',
        emergency_contact_phone: formData.emergencyContactPhone || '',
        emergency_contact_relationship: formData.emergencyContactRelationship || '',
        medical_conditions: formData.medicalConditions || null,
        medications: formData.medications || null,
        allergies: formData.allergies || null,
        e_rated_games_authorized: formData.gameRatingE || false,
        t_rated_games_authorized: formData.gameRatingT || false,
        m_rated_games_authorized: formData.gameRatingM || false,
        parent_signature: parentName,
        signature_date: new Date().toISOString().split('T')[0],
        submitted_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit waiver. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email
    try {
      if (process.env.SENDGRID_API_KEY) {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">SKILLWRAP</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Tech Summer Camps</p>
            </div>
            
            <div style="padding: 30px; background: white;">
              <h2 style="color: #333; margin-bottom: 20px;">Esports Waiver Confirmation</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Dear ${parentName},
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                Thank you for submitting the Esports Waiver for <strong>${studentName}</strong>.
                We have successfully received and processed your form.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Submission Details:</h3>
                <p style="margin: 5px 0;"><strong>Student:</strong> ${studentName}</p>
                <p style="margin: 5px 0;"><strong>Age:</strong> ${age} years old</p>
                <p style="margin: 5px 0;"><strong>Parent/Guardian:</strong> ${parentName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.parentEmail}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.parentPhone}</p>
                <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin-top: 0;">Game Rating Authorizations:</h3>
                <p style="margin: 5px 0;">✓ E-Rated Games: ${formData.gameRatingE ? 'Authorized' : 'Not Authorized'}</p>
                <p style="margin: 5px 0;">✓ T-Rated Games: ${formData.gameRatingT ? 'Authorized' : 'Not Authorized'}</p>
                <p style="margin: 5px 0;">✓ M-Rated Games: ${formData.gameRatingM ? 'Authorized' : 'Not Authorized'}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                This waiver is now on file and will be used for any esports-related activities during camp sessions.
              </p>
              
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
          subject: `SKILLWRAP - Esports Waiver Confirmation for ${studentName}`,
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
      message: 'Esports waiver submitted successfully',
      data: data[0],
      redirectUrl: `/forms/success?type=esports-waiver&student=${encodeURIComponent(studentName)}`
    })

  } catch (error) {
    console.error('Esports waiver submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}