import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, subject, message } = await req.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Email content for ben@skillwrap.com
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SKILLWRAP Contact Form</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3B82F6; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #3B82F6; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #E0F2FE; border-radius: 8px;">
            <p style="margin: 0; color: #0369A1; font-size: 14px;">
              <strong>Reply to:</strong> ${email}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { 
                timeZone: 'America/Chicago',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
        </div>
      </div>
    `

    const textContent = `
SKILLWRAP Contact Form Submission

Contact Information:
Name: ${firstName} ${lastName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
${message}

Reply to: ${email}
Submitted: ${new Date().toLocaleString('en-US', { 
  timeZone: 'America/Chicago',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
})}
    `

    // Confirmation email content for the user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SKILLWRAP</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333;">Thank you for contacting us!</h2>
          
          <p>Hi ${firstName},</p>
          
          <p>We've received your message and will get back to you within 24 hours. Here's a copy of what you sent:</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/camps" style="color: #3B82F6;">Browse our summer camps</a></li>
            <li><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/faq" style="color: #3B82F6;">Check our FAQ for quick answers</a></li>
          </ul>
          
          <p>Best regards,<br>The SKILLWRAP Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>SKILLWRAP - Tech Summer Camps<br>
            Waco, Texas<br>
            ben@skillwrap.com | (254) 555-SKILL</p>
          </div>
        </div>
      </div>
    `

    // Prepare emails
    const emails = [
      // Email to ben@skillwrap.com
      {
        to: 'ben@skillwrap.com',
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@skillwrap.com',
          name: 'SKILLWRAP Contact Form'
        },
        replyTo: {
          email: email,
          name: `${firstName} ${lastName}`
        },
        subject: `SKILLWRAP Contact: ${subject}`,
        text: textContent,
        html: htmlContent,
      },
      // Confirmation email to user
      {
        to: email,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@skillwrap.com',
          name: 'SKILLWRAP'
        },
        subject: 'Thank you for contacting SKILLWRAP',
        html: confirmationHtml,
      }
    ]

    // Send emails
    await sgMail.send(emails)

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    // Handle SendGrid specific errors
    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as any
      console.error('SendGrid error:', sgError.response?.body)
    }
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly at ben@skillwrap.com' },
      { status: 500 }
    )
  }
}