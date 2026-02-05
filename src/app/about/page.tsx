import Link from 'next/link'
import { AcademicCapIcon, LightBulbIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About SKILLWRAP
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Empowering the next generation with future-ready tech skills through innovative education and hands-on experience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              At SKILLWRAP, we believe every young person deserves to be <strong>skill wrapped</strong> – 
              equipped with the technical expertise, creative thinking, and entrepreneurial mindset needed 
              to thrive in tomorrow's digital economy.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 italic">
                "We don't just teach technology – we cultivate future-ready innovators who can adapt, 
                create, and lead in an ever-evolving digital landscape."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              The Experience Behind SKILLWRAP
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">High School Education</h3>
                <p className="text-gray-600">
                  Understanding the foundational needs of young learners and the importance of 
                  making technology accessible and engaging at the secondary level.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RocketLaunchIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Higher Ed Technical Schools</h3>
                <p className="text-gray-600">
                  Experience with technical education programs that bridge the gap between 
                  theoretical knowledge and practical, industry-ready skills.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LightBulbIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Online Tech Bootcamps</h3>
                <p className="text-gray-600">
                  Insights from intensive, results-driven learning environments that prepare 
                  students for real-world challenges in accelerated timeframes.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                A Comprehensive Educational Perspective
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our approach draws from extensive experience across the entire educational spectrum – 
                from traditional high school classrooms to cutting-edge technical institutes and 
                intensive online bootcamps. This diverse background allows us to understand what 
                works at each stage of a student's journey and how to create learning experiences 
                that truly prepare them for the future.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We've seen firsthand how the most successful programs combine structured learning 
                with hands-on application, theoretical foundations with practical skills, and 
                individual growth with collaborative problem-solving. SKILLWRAP brings together 
                the best of all these approaches in our summer camp programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Forward-Thinking Tech Initiatives
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Future-Proofing Skills</h3>
                <p className="text-blue-800 leading-relaxed">
                  We don't just teach today's technologies – we focus on fundamental concepts, 
                  problem-solving methodologies, and adaptable thinking patterns that will serve 
                  students regardless of how technology evolves.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-purple-900 mb-4">Innovation Mindset</h3>
                <p className="text-purple-800 leading-relaxed">
                  Every program emphasizes creative problem-solving, entrepreneurial thinking, 
                  and the confidence to tackle challenges that don't yet have established solutions.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-green-900 mb-4">Real-World Application</h3>
                <p className="text-green-800 leading-relaxed">
                  Students work on actual projects, build functional applications, and develop 
                  solutions to genuine problems – not just theoretical exercises.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-yellow-900 mb-4">Collaborative Learning</h3>
                <p className="text-yellow-800 leading-relaxed">
                  We foster teamwork, communication, and peer learning – essential skills for 
                  success in any tech career or entrepreneurial venture.
                </p>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <UserGroupIcon className="h-16 w-16 mx-auto mb-6 text-blue-400" />
              <h3 className="text-2xl font-bold mb-4">Ensuring They Are Skill Wrapped</h3>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Our ultimate goal is simple: every student who completes a SKILLWRAP program should 
                feel confident, capable, and excited about their future in technology. They should 
                be <em>skill wrapped</em> – thoroughly prepared with both technical abilities and 
                the mindset to continue learning and growing throughout their careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Skill Wrapped?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us this summer and discover how our forward-thinking approach to tech education 
            can prepare you for an exciting future in technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/camps" className="btn bg-white text-blue-600 hover:bg-gray-100">
              Explore Our Camps
            </Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}