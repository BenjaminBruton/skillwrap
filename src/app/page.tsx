import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { enhanceCampData, type EnhancedCamp } from '@/lib/campUtils'

async function getCamps(): Promise<EnhancedCamp[]> {
  try {
    const { data: camps, error } = await supabase
      .from('camps')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching camps:', error)
      return []
    }

    return enhanceCampData(camps || [])
  } catch (error) {
    console.error('Unexpected error fetching camps:', error)
    return []
  }
}

async function getSessionCount() {
  try {
    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'closed') // Exclude closed sessions from count
    
    if (error) {
      console.error('Error fetching session count:', error)
      return 20 // fallback to hardcoded value
    }
    
    return count || 20
  } catch (error) {
    console.error('Unexpected error fetching session count:', error)
    return 20 // fallback to hardcoded value
  }
}

export default async function HomePage() {
  const sessionCount = await getSessionCount()
  const camps = await getCamps()
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Summer Camps in Waco, TX
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Code. Create. Compete.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join our week-long intensive camps where kids and teens learn real-world skills 
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
              <div className="text-3xl font-bold text-green-600 mb-2">{sessionCount}</div>
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
                    {camp.short_description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Ages {camp.age_range}</span>
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
                  <p>Proud partner in esports education</p>
                </li>
                <li>
                  <a
                    href="https://savepointsandwich.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Savepoint Sandwich Shop
                  </a>
                  <p>Proud sustenance partner</p>
                </li>
              </ul>
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