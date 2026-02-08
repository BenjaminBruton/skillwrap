'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function SuccessContent() {
  const searchParams = useSearchParams()
  const formType = searchParams.get('type') || 'form'
  const studentName = searchParams.get('student') || 'your student'
  
  const getFormTitle = (type: string) => {
    switch (type) {
      case 'esports-waiver':
        return 'Esports Waiver'
      case 'media-release':
        return 'Media Release'
      case 'general-waiver':
        return 'General Camp Waiver'
      default:
        return 'Form'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {getFormTitle(formType)} Submitted Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for submitting the {getFormTitle(formType).toLowerCase()} for {studentName}. 
          A confirmation email has been sent to the provided email address.
        </p>

        <div className="space-y-3">
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">What's Next?</p>
            <p>Keep an eye on your email for confirmation and any additional instructions from SKILLWRAP.</p>
          </div>
          
          <Link 
            href="/" 
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/forms" 
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Forms
          </Link>
          
          <Link 
            href="/camps" 
            className="block w-full text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            View Summer Camps
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function FormSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}