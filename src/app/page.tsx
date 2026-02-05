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
    highlights: ['LLM Integration', 'Prompt Engineering', 'AI-Powered Debugging', 'Python Applications', 'Personal AI Assistant']
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
    highlights: ['React & Tailwind CSS', 'Cloud Databases', 'User Authentication', 'MVP Development', 'Live Deployment']
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
    highlights: ['Market Research', 'Financial Modeling', 'Brand Development', 'Investor Pitching', 'Public Speaking']
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
    highlights: ['Tournament Organization', 'Broadcast Production', 'Team Management', 'Digital Branding', 'Strategic Analysis']
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Tech Summer Camps
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            That Actually Matter
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join our week-long intensive camps where kids and teens learn real-world tech skills 
          through hands-on projects, expert mentorship, and collaborative learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/camps" className="btn-primary text-lg px-8 py-3">
            Explore Camps
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <Link href="#camps" className="btn-outline text-lg px-8 py-3">
            Learn More
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-gray-600">Specialized Camps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">20</div>
              <div className="text-gray-600">Sessions Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">12-20</div>
              <div className="text-gray-600">Max Students per Session</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">5</div>
              <div className="text-gray-600">Days of Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* Camps Section */}
      <section id="camps" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each camp runs 4 times over the summer with morning and afternoon sessions. 
              Pick the perfect fit for your schedule and interests.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {camps.map((camp) => {
              const IconComponent = camp.icon
              return (
                <div key={camp.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${camp.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {camp.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {camp.shortDescription}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Ages {camp.ageRange}</span>
                    <span className="text-2xl font-bold text-gray-900">${camp.price}</span>
                  </div>
                  <Link 
                    href={`/camps/${camp.slug}`}
                    className="btn-primary w-full justify-center"
                  >
                    Learn More
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Spots fill up fast! Secure your place in our summer tech camps today.
          </p>
          <Link href="/camps" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SW</span>
                </div>
                <span className="text-xl font-bold">SKILLWRAP</span>
              </div>
              <p className="text-gray-400">
                Empowering the next generation of tech innovators through hands-on learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Camps</h4>
              <ul className="space-y-2 text-gray-400">
                {camps.map((camp) => (
                  <li key={camp.id}>
                    <Link href={`/camps/${camp.slug}`} className="hover:text-white transition-colors">
                      {camp.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partners</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://nexuswaco.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Nexus Esports
                  </a>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                Proud partner in esports education
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 SKILLWRAP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}