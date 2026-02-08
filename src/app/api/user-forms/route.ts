import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

interface UserForm {
  id: string
  type: 'esports-waiver' | 'media-release' | 'general-waiver'
  title: string
  studentName: string
  submittedAt: string
  status: 'completed'
  details: any
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = user.primaryEmailAddress?.emailAddress

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    // Fetch all forms submitted by this user's email
    const [esportsWaivers, mediaReleases, generalWaivers] = await Promise.all([
      supabaseAdmin
        .from('esports_waivers')
        .select('*')
        .eq('parent_email', userEmail)
        .order('submitted_at', { ascending: false }),
      
      supabaseAdmin
        .from('media_releases')
        .select('*')
        .eq('parent_email', userEmail)
        .order('submitted_at', { ascending: false }),
      
      supabaseAdmin
        .from('general_waivers')
        .select('*')
        .eq('parent_email', userEmail)
        .order('submitted_at', { ascending: false })
    ])

    // Format the forms data
    const forms: UserForm[] = []

    // Add esports waivers
    if (esportsWaivers.data) {
      esportsWaivers.data.forEach(form => {
        forms.push({
          id: form.id,
          type: 'esports-waiver',
          title: 'Esports Waiver',
          studentName: form.student_name,
          submittedAt: form.submitted_at,
          status: 'completed',
          details: {
            age: form.student_age,
            eRated: form.e_rated_games_authorized,
            tRated: form.t_rated_games_authorized,
            mRated: form.m_rated_games_authorized,
            emergencyContact: form.emergency_contact_name,
            emergencyPhone: form.emergency_contact_phone
          }
        })
      })
    }

    // Add media releases
    if (mediaReleases.data) {
      mediaReleases.data.forEach(form => {
        forms.push({
          id: form.id,
          type: 'media-release',
          title: 'Media Release',
          studentName: form.student_name,
          submittedAt: form.submitted_at,
          status: 'completed',
          details: {
            age: form.student_age,
            permissionGranted: form.permission_granted
          }
        })
      })
    }

    // Add general waivers
    if (generalWaivers.data) {
      generalWaivers.data.forEach(form => {
        forms.push({
          id: form.id,
          type: 'general-waiver',
          title: 'General Camp Waiver',
          studentName: form.student_name,
          submittedAt: form.submitted_at,
          status: 'completed',
          details: {
            age: form.student_age,
            emergencyContact: form.emergency_contact_name,
            emergencyPhone: form.emergency_contact_phone,
            medicalConditions: form.medical_conditions,
            allergies: form.allergies,
            medications: form.medications
          }
        })
      })
    }

    // Sort all forms by submission date (newest first)
    forms.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ forms })

  } catch (error) {
    console.error('Error fetching user forms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}