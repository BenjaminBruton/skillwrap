'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MediaReleasePage() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    camperFirstName: '',
    camperLastName: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: user?.primaryEmailAddress?.emailAddress || '',
    confirmEmail: user?.primaryEmailAddress?.emailAddress || '',
    mediaPermission: '' // 'granted' or 'denied'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.mediaPermission) {
      alert('Please select your media permission preference')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/forms/media-release', {
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
          router.push(`/forms/success?type=media-release&student=${encodeURIComponent(formData.camperFirstName + ' ' + formData.camperLastName)}`)
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
              <h1 className="text-3xl font-bold text-gray-900">Media Release Form</h1>
              <Link href="/forms" className="text-blue-600 hover:text-blue-800">
                ← Back to Forms
              </Link>
            </div>
            <p className="text-gray-600">
              This form gives SKILLWRAP the permission to use photos/videos of you (or the minor you sign for), 
              for promotional materials. This form's return, with either permission or denial of permission, 
              is required for students to participate in SKILLWRAP Summer Camps.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            {/* Date */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Form Date</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
            </div>

            {/* Parent/Guardian Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Parent/Legal Guardian Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Legal Guardian First Name <span className="text-red-500">*</span>
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
                    Parent/Legal Guardian Last Name <span className="text-red-500">*</span>
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
                    Parent/Legal Guardian Email <span className="text-red-500">*</span>
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
            </div>

            {/* Media Release */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Media Release</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  As the legal guardian of the camper identified above, I give my permission to SKILLWRAP to use my child's 
                  photograph/video as needed for advertisements, publications, videos, web pages, social media, campus art and 
                  other informational pieces. By selecting the "I give my permission" button, I am signing this document 
                  electronically. I agree that my electronic signature is the legal equivalent of my manual/handwritten signature 
                  on this document. I further agree that my signature on this document is as valid as if I signed the document 
                  in writing. I am also confirming that I am authorized to enter into this Agreement. If I am signing this 
                  document on behalf of a minor, I represent and warrant that I am the minor's parent or legal guardian.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="mediaPermission"
                    value="granted"
                    checked={formData.mediaPermission === 'granted'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900 font-medium">
                    I give my permission.
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="mediaPermission"
                    value="denied"
                    checked={formData.mediaPermission === 'denied'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900 font-medium">
                    I DO NOT give my permission.
                  </span>
                </label>
              </div>

              {formData.mediaPermission && (
                <div className="mt-4 p-4 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800">
                    {formData.mediaPermission === 'granted' 
                      ? '✓ You have granted permission for SKILLWRAP to use photos/videos of your child for promotional materials.'
                      : '✓ You have denied permission for SKILLWRAP to use photos/videos of your child for promotional materials. Your child can still participate in all camp activities.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}