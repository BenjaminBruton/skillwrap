import Link from 'next/link'
import { ArrowRightIcon, CodeBracketIcon, RocketLaunchIcon, TrophyIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

const camps = [
  {
    id: 1,
    name: 'Software Dev: AI-Powered Productivity',
    slug: 'software-dev-ai',
    shortDescription: 'Build AI apps and productivity tools',
    description: 'Learn to build AI-powered applications and productivity tools using modern frameworks and machine learning APIs. Students will work with cutting-edge AI technologies to create practical solutions.',
    price: 299,
    ageRange: '13-17',
    icon: CodeBracketIcon,
    color: 'from-blue-500 to-purple-600',
    features: [
      'AI API Integration',
      'Modern JavaScript Frameworks',
      'Machine Learning Basics',
      'Productivity App Development',
      'Real-world Projects'
    ]
  },
  {
    id: 2,
    name: 'Full-Stack Dev: The Startup Prototype',
    slug: 'fullstack-startup',
    shortDescription: 'Build a complete web app from scratch',
    description: 'Create a complete web application from concept to deployment, learning both frontend and backend development. Perfect for aspiring entrepreneurs and developers.',
    price: 349,
    ageRange: '14-18',
    icon: RocketLaunchIcon,
    color: 'from-green-500 to-blue-600',
    features: [
      'Frontend Development',
      'Backend APIs',
      'Database Design',
      'User Authentication',
      'Deployment Strategies'
    ]
  },
  {
    id: 3,
    name: 'Entrepreneurship: Little Shark Tank',
    slug: 'entrepreneurship-shark-tank',
    shortDescription: 'Pitch your startup idea like on Shark Tank',
    description: 'Develop business ideas, create pitches, and present to a panel of judges in our mini Shark Tank competition. Learn the fundamentals of entrepreneurship and business development.',
    price: 199,
    ageRange: '12-16',
    icon: TrophyIcon,
    color: 'from-yellow-500 to-red-600',
    features: [
      'Business Plan Development',
      'Market Research',
      'Pitch Presentation Skills',
      'Financial Planning',
      'Investor Relations'
    ]
  },
  {
    id: 4,
    name: 'Esports Academy',
    slug: 'esports-academy',
    shortDescription: 'Master competitive gaming and streaming',
    description: 'Master competitive gaming strategies, team coordination, and streaming while learning about the esports industry. Develop skills in both playing and content creation.',
    price: 249,
    ageRange: '13-17',
    icon: ComputerDesktopIcon,
    color: 'from-purple-500 to-pink-600',
    features: [
      'Competitive Gaming Strategies',
      'Team Coordination',
      'Streaming Setup',
      'Content Creation',
      'Industry Insights'
    ]
  },
]

export default function CampsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SKILLWRAP
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Summer Tech Camps
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Choose from our specialized week-long camps designed to give kids and teens 
          real-world tech skills through hands-on projects and expert mentorship.
        </p>
      </section>

      {/* Camps Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {camps.map((camp) => {
            const IconComponent = camp.icon
            return (
              <div key={camp.id} className="card p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${camp.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {camp.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {camp.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Ages {camp.ageRange}
                      </span>
                      <span className="text-3xl font-bold text-gray-900">${camp.price}</span>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {camp.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link 
                      href={`/camps/${camp.slug}`}
                      className="btn-primary w-full justify-center group"
                    >
                      View Details & Book
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions About Our Camps?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the perfect camp for your child's interests and skill level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn bg-white text-blue-600 hover:bg-gray-100">
              Contact Us
            </Link>
            <Link href="/faq" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600">
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}