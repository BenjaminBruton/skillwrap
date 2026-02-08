'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GeneralWaiverPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    participantFirstName: '',
    participantLastName: '',
    campName: 'SKILLWRAP Tech & Entrepreneurship Summer Camp',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: user?.primaryEmailAddress?.emailAddress || '',
    confirmEmail: user?.primaryEmailAddress?.emailAddress || '',
    parentPhone: '',
    medicalConditions: '',
    medications: '',
    allergies: '',
    acknowledgeRisks: false,
    acknowledgeMedical: false,
    liabilityWaiver: false,
    codeOfConduct: false,
    consent: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
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

    if (!formData.acknowledgeRisks || !formData.acknowledgeMedical || 
        !formData.liabilityWaiver || !formData.codeOfConduct || !formData.consent) {
      alert('You must acknowledge all terms and conditions')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/forms/general-waiver', {
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
        router.push('/forms/success?type=general-waiver')
      } else {
        const error = await response.text()
        alert(`Error submitting form: ${error}`)
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
              <h1 className="text-3xl font-bold text-gray-900">General Camp Waiver</h1>
              <Link href="/forms" className="text-blue-600 hover:text-blue-800">
                ← Back to Forms
              </Link>
            </div>
            <p className="text-gray-600">
              This comprehensive waiver is required for all SKILLWRAP camp participants. 
              Please read carefully and complete all sections.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            {/* 1. Participant & Activity Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Participant & Activity Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="participantFirstName"
                    value={formData.participantFirstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="participantLastName"
                    value={formData.participantLastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camp Name
                </label>
                <input
                  type="text"
                  name="campName"
                  value={formData.campName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2"><strong>Location:</strong> Nexus Esports, Waco, TX</p>
                <p className="text-sm text-gray-700">
                  <strong>Description of Activities:</strong> Participation in software development, AI workshops, 
                  gaming tournaments, use of high-end PC/console equipment, and entrepreneurship pitch sessions.
                </p>
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

            {/* Medical Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions (if any)
                  </label>
                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please list any medical conditions we should be aware of..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications (if any)
                  </label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please list any medications your child is currently taking..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies (if any)
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please list any allergies (food, environmental, etc.)..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Assumption of Risk */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">2. Assumption of Risk (The "Tech & Gaming" Clause)</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  I acknowledge that participation in SKILLWRAP programs involves certain risks, including but not limited to:
                </p>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Physical Risks:</strong> Eye strain, repetitive motion injuries (carpal tunnel), and sedentary behavior.
                  </div>
                  <div>
                    <strong>Venue Risks:</strong> Interaction with electrical equipment, cables, and the general public at Nexus Esports.
                  </div>
                  <div>
                    <strong>Cyber Risks:</strong> Exposure to internet content, social media, and digital platforms used for educational purposes.
                  </div>
                  <div>
                    <strong>Equipment Liability:</strong> I understand my child will be using expensive hardware. While SKILLWRAP provides supervision, I acknowledge responsibility for intentional or reckless damage caused by my child to Nexus Esports or SKILLWRAP property.
                  </div>
                </div>
              </div>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acknowledgeRisks"
                  checked={formData.acknowledgeRisks}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">
                  I acknowledge and understand the risks described above <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* 3. Release of Liability & Indemnification */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">3. Release of Liability & Indemnification</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
                <p className="text-sm font-bold text-red-800 mb-4">READ CAREFULLY:</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  I, the undersigned Parent/Guardian, hereby <strong>RELEASE, WAIVE, AND DISCHARGE</strong> SKILLWRAP LLC, 
                  Nexus Esports, their officers, employees, and agents (the "Released Parties") from any and all liability, 
                  claims, or causes of action arising out of my child's participation, <strong>EVEN IF CAUSED BY THE NEGLIGENCE</strong> of the Released Parties.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  I further agree to <strong>INDEMNIFY AND HOLD HARMLESS</strong> the Released Parties from any loss, liability, 
                  damage, or costs, including court costs and attorney fees, that they may incur due to my child's participation.
                </p>
              </div>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="liabilityWaiver"
                  checked={formData.liabilityWaiver}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">
                  I agree to the Release of Liability & Indemnification terms <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* 4. Code of Conduct & Safety */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">4. Code of Conduct & Safety (Texas 2026 Compliance)</h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  I acknowledge that my child must follow all safety protocols, including the Youth CAMPER Act requirements 
                  regarding emergency drills and staff instructions. SKILLWRAP reserves the right to dismiss any participant 
                  for bullying, harassment, or unsafe behavior without a refund.
                </p>
              </div>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="codeOfConduct"
                  checked={formData.codeOfConduct}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">
                  I agree to the Code of Conduct & Safety requirements <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Medical Acknowledgment */}
            <div className="mb-8">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acknowledgeMedical"
                  checked={formData.acknowledgeMedical}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">
                  I acknowledge that I have provided accurate medical information and will notify SKILLWRAP of any changes <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Electronic Signature Consent */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Electronic Signature Consent</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  By selecting "I agree" below, I am signing this document electronically. I agree that my electronic 
                  signature is the legal equivalent of my manual/handwritten signature on this document. I further agree 
                  that my signature on this document is as valid as if I signed the document in writing. I am also confirming 
                  that I am authorized to enter into this Agreement. If I am signing this document on behalf of a minor, 
                  I represent and warrant that I am the minor's parent or legal guardian.
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
                  I agree to all terms and conditions and provide my electronic signature <span className="text-red-500">*</span>
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