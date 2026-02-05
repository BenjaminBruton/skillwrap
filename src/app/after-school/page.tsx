import Link from 'next/link'
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function AfterSchoolPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            After School Programs
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Exciting tech programs for students throughout the school year are in development.
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <BellIcon className="h-12 w-12 text-blue-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Coming Soon!
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              After School Programs Coming Soon. Please join our email list to be notified when programs begin!
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                What to Expect
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-lg">📚</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Weekly Sessions</h4>
                  <p className="text-gray-600 text-sm">
                    Regular after-school programs designed to fit your schedule
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-purple-600 font-bold text-lg">💻</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tech Skills</h4>
                  <p className="text-gray-600 text-sm">
                    Coding, robotics, esports, entrepreneurship, and digital creativity programs
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-green-600 font-bold text-lg">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Age-Appropriate</h4>
                  <p className="text-gray-600 text-sm">
                    Programs tailored for different age groups and skill levels
                  </p>
                </div>
              </div>
            </div>

            {/* Email Signup CTA */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <EnvelopeIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Be the First to Know
              </h3>
              <p className="text-gray-600 mb-6">
                Get notified when our after school programs launch. We'll send you details about 
                schedules, pricing, and how to enroll.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link 
                  href="/contact?subject=after-school"
                  className="btn-primary flex-1 justify-center"
                >
                  Join Email List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summer Camps CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Don't Want to Wait?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out our summer tech camps happening now! Week-long intensive programs 
            with hands-on projects and expert mentorship.
          </p>
          <Link href="/camps" className="btn-primary">
            Explore Summer Camps
          </Link>
        </div>
      </section>
    </div>
  )
}