import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'
import SessionSelector from '@/components/SessionSelector'
import { Session, Camp } from '@/types'

async function getCampData() {
  try {
    // Fetch sessions from the API
    const sessionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sessions`, {
      cache: 'no-store'
    })
    
    if (!sessionsResponse.ok) {
      throw new Error('Failed to fetch sessions')
    }
    
    const sessions: Session[] = await sessionsResponse.json()
    
    // Filter sessions for tabletop-gaming camp
    const tabletopSessions = sessions.filter(session => 
      session.camp_id === 'tabletop-gaming' || 
      (session.camp && session.camp.slug === 'tabletop-gaming')
    )

    // Add availability info to sessions
    const sessionsWithAvailability = tabletopSessions.map(session => ({
      ...session,
      available_spots: session.max_capacity - session.current_bookings,
      is_full: session.current_bookings >= session.max_capacity
    }))

    const availableSessions = sessionsWithAvailability.filter(session => !session.is_full)
    const fullSessions = sessionsWithAvailability.filter(session => session.is_full)

    // Camp data
    const camp: Camp = {
      id: 'tabletop-gaming',
      name: 'Tabletop Card Gaming: Collector to Competitor',
      slug: 'tabletop-gaming',
      description: 'Transform your passion for card games into competitive mastery! Learn advanced strategies, deck building, tournament play, and the business side of competitive gaming. Perfect for aspiring professional players and collectors who want to understand the deeper mechanics of their favorite games and develop the skills needed to compete at higher levels.',
      short_description: 'Transform your passion for card games into competitive mastery',
      age_range: '10-18',
      max_capacity: 20,
      price: 200,
      image_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return {
      camp,
      availableSessions,
      fullSessions
    }
  } catch (error) {
    console.error('Error fetching camp data:', error)
    // Return fallback data if API fails
    return {
      camp: {
        id: 'tabletop-gaming',
        name: 'Tabletop Card Gaming: Collector to Competitor',
        slug: 'tabletop-gaming',
        description: 'Transform your passion for card games into competitive mastery! Learn advanced strategies, deck building, tournament play, and the business side of competitive gaming. Perfect for aspiring professional players and collectors who want to understand the deeper mechanics of their favorite games and develop the skills needed to compete at higher levels.',
        short_description: 'Transform your passion for card games into competitive mastery',
        age_range: '10-18',
        max_capacity: 20,
        price: 200,
        image_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      availableSessions: [],
      fullSessions: []
    }
  }
}

export default async function TabletopGamingCampPage() {
  const { camp, availableSessions, fullSessions } = await getCampData()

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
                4 Days
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2" />
                5 Hours/Day
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
                {getSkillsForCamp().map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
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
                  <li>• Monday - Thursday</li>
                  <li>• Afternoon: 12:00 PM - 5:00 PM</li>
                  <li>• Small class sizes (max {camp.max_capacity} students)</li>
                  <li>• 20 hours over 4 days</li>
                </ul>
              </div>
              
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Starter decks and practice cards</li>
                  <li>• Expert instruction from competitive players</li>
                  <li>• Tournament preparation and practice</li>
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
                  <p className="text-gray-600 mb-4">All sessions are currently full.</p>
                  <Link 
                    href="/contact?subject=Tabletop Gaming Waitlist" 
                    className="btn-primary"
                  >
                    Join Waitlist
                  </Link>
                </div>
              )}

              {fullSessions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Sessions</h3>
                  {fullSessions.map((session: Session) => (
                    <div key={session.id} className="bg-gray-100 p-4 rounded-lg mb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Week {session.week_number}</span>
                        <span className="text-red-600 font-medium">FULL</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            {getFAQForCamp().map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function getSkillsForCamp(): string[] {
  return [
    'Advanced deck building strategies and card synergies',
    'Tournament preparation and competitive play techniques',
    'Understanding card game economics and market trends',
    'Meta analysis and adaptation strategies',
    'Professional gaming mindset and mental preparation',
    'Community building and networking in gaming',
    'Card collection and investment strategies',
    'Rules mastery and judge-level understanding',
    'Streaming and content creation for card games',
    'Business opportunities in the gaming industry'
  ]
}

function getFAQForCamp() {
  return [
    {
      question: "What card games will we focus on?",
      answer: "We'll cover popular trading card games including Pokémon and Lorcana mainly, and Magic: The Gathering if time permits, with focus on the games most popular among participants. Students can bring their own collections or use provided cards."
    },
    {
      question: "Do I need to own cards to participate?",
      answer: "No! We provide starter decks and cards for learning. However, students are welcome to bring their own collections to work with and learn advanced strategies for their preferred games."
    },
    {
      question: "Will we participate in actual tournaments?",
      answer: "Yes! The week includes practice tournaments within the camp, and we'll discuss how to prepare for and participate in local game store tournaments and larger competitive events."
    },
    {
      question: "Is this suitable for beginners?",
      answer: "Absolutely! We welcome players of all skill levels, from complete beginners to experienced players looking to take their game to the next level. Instruction is tailored to each student's experience."
    },
    {
      question: "What about the business side of gaming?",
      answer: "Students will learn about card values, market trends, collection management, and various career paths in the gaming industry including content creation, tournament organization, and game design."
    }
  ]
}