import Link from 'next/link'
import { DocumentTextIcon, ClipboardDocumentCheckIcon, CameraIcon } from '@heroicons/react/24/outline'

const forms = [
  {
    id: 1,
    name: 'Esports Waiver',
    description: 'Required waiver for all students participating in Esports Academy programs',
    icon: ClipboardDocumentCheckIcon,
    color: 'from-purple-500 to-pink-600',
    required: true,
    applicableCamps: ['Esports Academy'],
    formUrl: '/forms/esports-waiver',
    status: 'available'
  },
  {
    id: 2,
    name: 'Media Release Form',
    description: 'Permission for photography, videography, and promotional materials during camp activities',
    icon: CameraIcon,
    color: 'from-blue-500 to-purple-600',
    required: false,
    applicableCamps: ['All Camps'],
    formUrl: '/forms/media-release',
    status: 'available'
  },
  {
    id: 3,
    name: 'General Camp Waiver',
    description: 'Standard liability waiver required for all camp participants',
    icon: DocumentTextIcon,
    color: 'from-green-500 to-blue-600',
    required: true,
    applicableCamps: ['All Camps'],
    formUrl: '/forms/general-waiver',
    status: 'available'
  }
]

export default function FormsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Forms & Waivers
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Download and complete the required forms for your camp registration. 
            All forms must be submitted before the first day of camp.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="container mx-auto px-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Important Notice
              </h3>
              <p className="text-yellow-700 mt-1">
                All required forms must be completed and submitted at least 48 hours before your camp start date. 
                Incomplete forms may result in delayed camp participation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {forms.map((form) => {
              const IconComponent = form.icon
              return (
                <div key={form.id} className="card p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {form.name}
                        </h3>
                        {form.required && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {form.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Applicable to: </span>
                        <span className="text-sm font-medium text-gray-700">
                          {form.applicableCamps.join(', ')}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <Link
                          href={form.formUrl}
                          className="btn-primary w-full justify-center group"
                        >
                          Complete Form Online
                          <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Complete Forms Online
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                    Sign in to your SKILLWRAP account
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                    Click "Complete Form Online" for each required form
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                    Fill out all required information
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                    Submit digitally - no printing required!
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Important Deadlines
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete forms before camp registration
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Forms are saved automatically as you type
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View completed forms in your dashboard
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Need help? Contact <a href="mailto:ben@skillwrap.com" className="text-blue-600 hover:underline">ben@skillwrap.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions About Forms?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have questions about any forms or need assistance with submission, 
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <a href="mailto:ben@skillwrap.com" className="btn border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}