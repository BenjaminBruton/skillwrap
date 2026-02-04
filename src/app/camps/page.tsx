import Link from 'next/link'
import { ArrowRightIcon, CodeBracketIcon, RocketLaunchIcon, TrophyIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

const camps = [
  {
    id: 1,
    name: 'Software Dev: AI-Powered Productivity',
    slug: 'software-dev-ai',
    shortDescription: 'Transition from AI "users" to "builders" with cutting-edge tools',
    description: 'In this forward-looking program, students transition from "users" of AI to "builders" with it, mastering the tools that are currently redefining the software industry. Participants will learn to leverage Large Language Models (LLMs) and agentic frameworks to accelerate their coding workflow, focusing on prompt engineering, automated debugging, and integrating AI APIs into functional Python applications. By the end of the week, students will have built an AI-driven personal assistant or productivity bot, gaining a high-level understanding of the intersection between traditional logic and modern generative technology.',
    price: 350,
    ageRange: '13-18',
    icon: CodeBracketIcon,
    color: 'from-blue-500 to-purple-600',
    features: [
      'LLM Integration',
      'Prompt Engineering',
      'AI-Powered Debugging',
      'Python Applications',
      'Personal AI Assistant'
    ]
  },
  {
    id: 2,
    name: 'Full-Stack Dev: The Startup Prototype',
    slug: 'fullstack-startup',
    shortDescription: 'Build a complete MVP from concept to deployment',
    description: 'Designed for the aspiring "solopreneur" or engineer, this camp mirrors the professional lifecycle of a modern web application. Students dive into the full stack—from designing responsive user interfaces with React and Tailwind CSS to managing cloud-based databases with tools like Supabase. The week is centered on building a "Minimum Viable Product" (MVP) for a real-world problem, teaching students how to handle user authentication, data persistence, and live deployment.',
    price: 350,
    ageRange: '13-18',
    icon: RocketLaunchIcon,
    color: 'from-green-500 to-blue-600',
    features: [
      'React & Tailwind CSS',
      'Cloud Databases',
      'User Authentication',
      'MVP Development',
      'Live Deployment'
    ]
  },
  {
    id: 3,
    name: 'Entrepreneurship: Little Shark Tank',
    slug: 'entrepreneurship-shark-tank',
    shortDescription: 'From lightbulb moment to live investor pitch',
    description: 'This immersive camp takes students through the high-stakes journey of a startup founder, from the initial "lightbulb moment" to a live investor pitch. Participants will learn the fundamentals of market research, product prototyping, and financial modeling (calculating profit margins and "burn rates") while developing a brand identity and marketing strategy. The program culminates in a "Shark Tank" style finale where students present their polished business plans to a panel of judges, honing the critical soft skills of public speaking, negotiation, and resilience.',
    price: 300,
    ageRange: '10-18',
    icon: TrophyIcon,
    color: 'from-yellow-500 to-red-600',
    features: [
      'Market Research',
      'Financial Modeling',
      'Brand Development',
      'Investor Pitching',
      'Public Speaking'
    ]
  },
  {
    id: 4,
    name: 'Esports Academy: The Business of Play',
    slug: 'esports-academy',
    shortDescription: 'Explore the multi-billion dollar esports ecosystem',
    description: 'Going far beyond the controller, this academy explores the multi-billion dollar ecosystem of the global Esports industry. Students will analyze the various professional pathways available, including tournament organization, broadcast production (using OBS and shoutcasting), team management, and digital branding. While incorporating high-level gameplay and strategic VOD reviews, the focus remains on the professional skills required to run an organization, providing students with a holistic view of how their passion for gaming translates into a viable career in sports and entertainment.',
    price: 300,
    ageRange: '10-18',
    icon: ComputerDesktopIcon,
    color: 'from-purple-500 to-pink-600',
    features: [
      'Tournament Organization',
      'Broadcast Production',
      'Team Management',
      'Digital Branding',
      'Strategic Analysis'
    ]
  },
]

export default function CampsPage() {
  return (
    <div className="min-h-screen">

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