'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EsportsWaiverPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    camperFirstName: '',
    camperLastName: '',
    camperDateOfBirth: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: user?.primaryEmailAddress?.emailAddress || '',
    confirmEmail: user?.primaryEmailAddress?.emailAddress || '',
    parentPhone: '',
    gameRatingE: false,
    gameRatingT: false,
    gameRatingM: false,
    consent: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please sign in to submit the form')
      return
    }

    if (formData.parentEmail !== formData.confirmEmail) {
      alert('Email addresses do not match')
      return
    }

    if (!formData.gameRatingE && !formData.gameRatingT && !formData.gameRatingM) {
      alert('Please select at least one game rating authorization')
      return
    }

    if (!formData.consent) {
      alert('You must agree to the terms and conditions')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/forms/esports-waiver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.redirectUrl) {
          router.push(result.redirectUrl)
        } else {
          router.push(`/forms/success?type=esports-waiver&student=${encodeURIComponent(formData.camperFirstName + ' ' + formData.camperLastName)}`)
        }
      } else {
        const errorData = await response.json()
        alert(`Error submitting form: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You must be signed in to complete this form.</p>
          <Link href="/sign-in" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Esports Waiver</h1>
              <Link href="/forms" className="text-blue-600 hover:text-blue-800">
                ← Back to Forms
              </Link>
            </div>
            <p className="text-gray-600">
              This form is for the parents of campers in any of our Esports camps. 
              Each Esports camper only needs this form filled out once per year.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            {/* Camper Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Camper Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camper's First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="camperFirstName"
                    value={formData.camperFirstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camper's Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="camperLastName"
                    value={formData.camperLastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camper's Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="camperDateOfBirth"
                  value={formData.camperDateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Parent/Guardian Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentLastName"
                    value={formData.parentLastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Game Rating Authorization */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Game Rating Authorization</h2>
              <p className="text-gray-600 mb-6">
                I am the parent or legal guardian of the camper identified above, who is under 18, but AT LEAST 10 years of age. 
                I hereby consent to his/her participation in video game play at SKILLWRAP camps in partnership with Nexus Esports. 
                I am aware that the camps may have PC and console video games with ratings of "E", "T" or "M" as specified by the 
                Entertainment Software Ratings Board. I authorize my child to play the following ratings. SKILLWRAP will limit the 
                games available to play based on the parental limits selected below.
              </p>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="gameRatingE"
                    checked={formData.gameRatingE}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">"E" For Everyone:</span>
                    <span className="text-gray-600 ml-2">
                      Content is generally suitable for all ages. May contain minimal cartoon, fantasy, 
                      or mild violence and/or infrequent use of mild language.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="gameRatingT"
                    checked={formData.gameRatingT}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">"T" for Teen:</span>
                    <span className="text-gray-600 ml-2">
                      Content is generally suitable for ages 13 and up. May contain violence, suggestive themes, 
                      crude humor, minimal blood, simulated gambling, and/or infrequent use of strong language.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="gameRatingM"
                    checked={formData.gameRatingM}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">"M" for Mature:</span>
                    <span className="text-gray-600 ml-2">
                      Content is generally suitable for ages 17 and up. May contain intense violence, 
                      blood and gore, sexual content, and/or strong language.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Consent and Waiver */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Consent and Waiver</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  By selecting the "I agree" button, I am signing this document electronically. I agree that my electronic 
                  signature is the legal equivalent of my manual/handwritten signature on this document. By selecting "I agree" 
                  using any device, means, or action, I consent to the legally binding terms and conditions of this document. 
                  I further agree that my signature on this document is as valid as if I signed the document in writing. 
                  I am also confirming that I am authorized to enter into this Agreement. If I am signing this document on 
                  behalf of a minor, I represent and warrant that I am the minor's parent or legal guardian.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  With my e-signature, as the Parent or Legal Guardian, I give my permission to allow my child, a minor, 
                  to participate in PC and console game play at SKILLWRAP camps in partnership with Nexus Esports. 
                  I release SKILLWRAP, including its organizers, owners, sponsors, and affiliates, including Nexus Esports, 
                  from any and all liabilities that may arise from my decision to allow the minor to participate. 
                  I understand that the programs and activities offered at and by SKILLWRAP camps may involve exposure to 
                  content deemed inappropriate to some children. With the nature of gaming, open-play format, and competition, 
                  there is the chance that inappropriate images, language, and content may be viewed and/or heard by a minor. 
                  I assume the risks and hazards incident to such participation. I understand that I am responsible for 
                  determining and disclosing whether my minor child should be limited to certain game titles or activities.
                </p>
              </div>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">
                  I agree <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Waiver'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}