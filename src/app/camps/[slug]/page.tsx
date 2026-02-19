import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import SessionSelector from '@/components/SessionSelector'
import { formatDateRange, formatTime } from '@/lib/utils'
import { Session } from '@/types'

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CampPageProps {
  params: {
    slug: string
  }
}

// Mock data for when database is not set up
const mockCamps = {
  'software-dev-ai': {
    id: '1',
    name: 'Software Development + AI',
    slug: 'software-dev-ai',
    description: 'Learn to build intelligent applications using cutting-edge AI technologies. Students will master Python programming while creating their own AI-powered projects, from chatbots to personal assistants. This camp combines traditional software development with modern AI integration, teaching students how to leverage Large Language Models and APIs to create innovative solutions.',
    short_description: 'Build intelligent applications with Python and AI',
    age_range: '13-18',
    max_capacity: 12,
    price: 300,
    image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  'entrepreneurship-shark-tank': {
    id: '3',
    name: 'Entrepreneurship + Shark Tank',
    slug: 'entrepreneurship-shark-tank',
    description: 'Develop your business acumen and pitch skills in this intensive entrepreneurship program. Students will learn market research, financial modeling, and brand development while creating their own business plan. The week culminates in a Shark Tank-style presentation where students pitch their ideas to a panel of real entrepreneurs and investors, receiving valuable feedback and mentorship.',
    short_description: 'Create and pitch your business idea',
    age_range: '13-18',
    max_capacity: 20,
    price: 275,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  'esports-academy': {
    id: '4',
    name: 'Esports Academy',
    slug: 'esports-academy',
    description: 'Explore the rapidly growing esports industry from multiple angles - not just playing games, but understanding the business, production, and career opportunities. Students learn tournament organization, broadcast production using OBS, team management, and digital marketing. This camp provides insight into the professional esports ecosystem and the diverse career paths available in this billion-dollar industry.',
    short_description: 'Learn the business side of competitive gaming',
    age_range: '12-18',
    max_capacity: 20,
    price: 275,
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}

// Mock sessions data
const mockSessions = [
  // Software Dev + AI Sessions
  { id: '1', camp_id: '1', week_number: 1, time_slot: 'morning', start_date: '2024-06-03', end_date: '2024-06-07', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 3, max_capacity: 12, status: 'open' },
  { id: '2', camp_id: '1', week_number: 1, time_slot: 'afternoon', start_date: '2024-06-03', end_date: '2024-06-07', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 8, max_capacity: 12, status: 'open' },
  { id: '3', camp_id: '1', week_number: 3, time_slot: 'morning', start_date: '2024-06-17', end_date: '2024-06-21', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 5, max_capacity: 12, status: 'open' },
  { id: '4', camp_id: '1', week_number: 5, time_slot: 'afternoon', start_date: '2024-07-01', end_date: '2024-07-05', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 2, max_capacity: 12, status: 'open' },
  { id: '5', camp_id: '1', week_number: 8, time_slot: 'morning', start_date: '2024-07-22', end_date: '2024-07-26', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 12, max_capacity: 12, status: 'full' },

  // Entrepreneurship Sessions
  { id: '11', camp_id: '3', week_number: 1, time_slot: 'morning', start_date: '2024-06-03', end_date: '2024-06-07', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 8, max_capacity: 20, status: 'open' },
  { id: '12', camp_id: '3', week_number: 3, time_slot: 'afternoon', start_date: '2024-06-17', end_date: '2024-06-21', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 12, max_capacity: 20, status: 'open' },
  { id: '13', camp_id: '3', week_number: 5, time_slot: 'morning', start_date: '2024-07-01', end_date: '2024-07-05', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 15, max_capacity: 20, status: 'open' },
  { id: '14', camp_id: '3', week_number: 7, time_slot: 'afternoon', start_date: '2024-07-15', end_date: '2024-07-19', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 20, max_capacity: 20, status: 'full' },
  { id: '15', camp_id: '3', week_number: 10, time_slot: 'morning', start_date: '2024-08-05', end_date: '2024-08-09', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 3, max_capacity: 20, status: 'open' },

  // Esports Academy Sessions
  { id: '16', camp_id: '4', week_number: 2, time_slot: 'afternoon', start_date: '2024-06-10', end_date: '2024-06-14', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 11, max_capacity: 20, status: 'open' },
  { id: '17', camp_id: '4', week_number: 4, time_slot: 'morning', start_date: '2024-06-24', end_date: '2024-06-28', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 16, max_capacity: 20, status: 'open' },
  { id: '18', camp_id: '4', week_number: 6, time_slot: 'afternoon', start_date: '2024-07-08', end_date: '2024-07-12', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 7, max_capacity: 20, status: 'open' },
  { id: '19', camp_id: '4', week_number: 8, time_slot: 'morning', start_date: '2024-07-22', end_date: '2024-07-26', start_time: '08:00:00', end_time: '12:00:00', current_bookings: 19, max_capacity: 20, status: 'open' },
  { id: '20', camp_id: '4', week_number: 10, time_slot: 'afternoon', start_date: '2024-08-05', end_date: '2024-08-09', start_time: '13:00:00', end_time: '17:00:00', current_bookings: 5, max_capacity: 20, status: 'open' }
]

async function getCampData(slug: string) {
  try {
    // Try to fetch from database first
    const { data: camp, error } = await supabase
      .from('camps')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!error && camp) {
      // Get sessions for this camp
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('camp_id', camp.id)
        .order('week_number', { ascending: true })
        .order('time_slot', { ascending: true })

      if (!sessionsError && sessions) {
        // Add availability information
        const sessionsWithAvailability = sessions.map(session => ({
          ...session,
          available_spots: session.max_capacity - session.current_bookings,
          is_available: session.current_bookings < session.max_capacity && session.status === 'open',
          is_full: session.current_bookings >= session.max_capacity || session.status === 'full'
        }))

        return { ...camp, sessions: sessionsWithAvailability }
      }
    }
  } catch (error) {
    console.log('Database not available, using mock data')
  }

  // Fallback to mock data if database is not available
  const mockCamp = mockCamps[slug as keyof typeof mockCamps]
  if (!mockCamp) {
    return null
  }

  // Get mock sessions for this camp
  const campSessions = mockSessions
    .filter(session => session.camp_id === mockCamp.id)
    .map(session => ({
      ...session,
      available_spots: session.max_capacity - session.current_bookings,
      is_available: session.current_bookings < session.max_capacity && session.status === 'open',
      is_full: session.current_bookings >= session.max_capacity || session.status === 'full',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }))

  return { ...mockCamp, sessions: campSessions }
}

export default async function CampDetailPage({ params }: CampPageProps) {
  const camp = await getCampData(params.slug)

  if (!camp) {
    notFound()
  }

  const availableSessions = camp.sessions.filter((session: Session) => session.is_available ?? false)
  const fullSessions = camp.sessions.filter((session: Session) => session.is_full ?? false)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/camps" className="hover:text-gray-900">Camps</Link>
          <span>/</span>
          <span className="text-gray-900">{camp.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Camp Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {camp.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Ages {camp.age_range}
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                5 Days
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2" />
                4 Hours/Day
              </div>
              <div className="flex items-center text-green-600 font-semibold">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                ${camp.price}
              </div>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {camp.description}
            </p>

            {/* What Students Will Learn */}
            <div className="card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">What Students Will Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getSkillsForCamp(camp.slug).map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Camp Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Schedule</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Monday - Friday</li>
                  <li>• Morning: 8:00 AM - 12:00 PM</li>
                  <li>• Afternoon: 1:00 PM - 5:00 PM</li>
                  <li>• Small class sizes (max {camp.max_capacity} students)</li>
                </ul>
              </div>
              
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• All materials and software</li>
                  <li>• Expert instruction</li>
                  <li>• Take-home projects</li>
                  <li>• Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Session Selection */}
          <div className="lg:sticky lg:top-8">
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-6">Select Your Session</h2>
              
              {availableSessions.length > 0 ? (
                <SessionSelector 
                  sessions={availableSessions} 
                  camp={camp}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    All sessions for this camp are currently full.
                  </p>
                  <Link 
                    href="/camps" 
                    className="btn-outline"
                  >
                    Browse Other Camps
                  </Link>
                </div>
              )}

              {fullSessions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Full Sessions</h4>
                  <div className="space-y-2">
                    {fullSessions.map((session: Session) => (
                      <div key={session.id} className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          Week {session.week_number} - {session.time_slot}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          Full
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {getFAQForCamp(camp.slug).map((faq, index) => (
              <div key={index} className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function getSkillsForCamp(slug: string): string[] {
  const skills = {
    'software-dev-ai': [
      'Large Language Model Integration',
      'Prompt Engineering Techniques',
      'AI-Powered Debugging',
      'Python Programming',
      'API Integration',
      'Personal AI Assistant Development'
    ],
    'entrepreneurship-shark-tank': [
      'Market Research & Analysis',
      'Financial Modeling',
      'Brand Development',
      'Pitch Presentation Skills',
      'Business Plan Creation',
      'Public Speaking & Negotiation'
    ],
    'esports-academy': [
      'Tournament Organization',
      'Broadcast Production (OBS)',
      'Team Management',
      'Digital Branding & Marketing',
      'Strategic Game Analysis',
      'Industry Career Pathways'
    ]
  }
  
  return skills[slug as keyof typeof skills] || []
}

function getFAQForCamp(slug: string) {
  const commonFAQs = [
    {
      question: "What should my child bring?",
      answer: "Just bring a laptop if you have one (we can provide one if needed), a notebook, and enthusiasm to learn! All software and materials are provided."
    },
    {
      question: "What if my child has no prior experience?",
      answer: "No problem! Our camps are designed for beginners and we'll start with the basics. Our instructors are experienced in teaching students of all skill levels."
    },
    {
      question: "What's your cancellation policy?",
      answer: "We offer full refunds up to 2 weeks before the camp starts. After that, we offer a 50% refund up to 1 week before, or you can transfer to another session."
    }
  ]

  const specificFAQs = {
    'software-dev-ai': [
      {
        question: "Do students need programming experience?",
        answer: "Basic programming knowledge is helpful but not required. We'll teach Python fundamentals as we build AI applications."
      }
    ],
    'entrepreneurship-shark-tank': [
      {
        question: "Do students present to real investors?",
        answer: "Students present to a panel of local entrepreneurs and business leaders who provide real feedback on their ideas."
      }
    ],
    'esports-academy': [
      {
        question: "Is this just about playing games?",
        answer: "While we do analyze gameplay, the focus is on the business side of esports - management, production, and career opportunities."
      }
    ]
  }

  return [
    ...commonFAQs,
    ...(specificFAQs[slug as keyof typeof specificFAQs] || [])
  ]
}