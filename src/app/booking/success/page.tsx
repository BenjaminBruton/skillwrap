import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function SuccessContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-md w-full text-center">
        <div className="card p-8">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Confirmed! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for registering for SKILLWRAP! Your payment has been processed successfully 
            and your camp spot is confirmed.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Check your dashboard for booking details</li>
              <li>• We'll send camp preparation info 1 week before</li>
              <li>• Contact us if you have any questions</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/dashboard" 
              className="btn-primary w-full justify-center"
            >
              View My Bookings
            </Link>
            
            <Link 
              href="/camps" 
              className="btn-outline w-full justify-center"
            >
              Browse More Camps
            </Link>
            
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Return to Home
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@skillwrap.com" className="text-blue-600 hover:underline">
              support@skillwrap.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}