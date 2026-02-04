'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useUser } from '@clerk/nextjs'
import { Camp, Session } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingFormProps {
  session: Session
  camp: Camp
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function BookingForm({ session, camp, onSuccess, onError }: BookingFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <BookingFormContent session={session} camp={camp} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}

function BookingFormContent({ session, camp, onSuccess, onError }: BookingFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const [bookingData, setBookingData] = useState({
    studentName: '',
    studentAge: '',
    parentEmail: user?.emailAddresses[0]?.emailAddress || '',
    parentPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRestrictions: '',
    specialNeeds: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!bookingData.studentName.trim()) {
      newErrors.studentName = 'Student name is required'
    }
    
    if (!bookingData.studentAge || parseInt(bookingData.studentAge) < 1) {
      newErrors.studentAge = 'Valid student age is required'
    }
    
    if (!bookingData.parentEmail.trim()) {
      newErrors.parentEmail = 'Parent email is required'
    }
    
    if (!bookingData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required'
    }
    
    if (!bookingData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency phone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !user) return

    setLoading(true)
    setErrors({})

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          ...bookingData,
          studentAge: parseInt(bookingData.studentAge),
          amount: camp.price
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment setup failed')
      }

      const { clientSecret } = data

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: bookingData.studentName,
            email: bookingData.parentEmail,
            phone: bookingData.parentPhone || undefined
          }
        }
      })

      if (error) {
        console.error('Payment failed:', error)
        onError?.(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful - booking will be created via webhook
        onSuccess?.()
        window.location.href = `/booking/success?payment_intent=${paymentIntent.id}`
      }
    } catch (error) {
      console.error('Booking failed:', error)
      onError?.(error instanceof Error ? error.message : 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingData = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Student Info</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Camp Summary */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">{camp.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Dates:</span> {session.start_date} - {session.end_date}
          </div>
          <div>
            <span className="font-medium">Time:</span> {session.start_time} - {session.end_time}
          </div>
          <div>
            <span className="font-medium">Age Range:</span> {camp.age_range}
          </div>
          <div>
            <span className="font-medium">Price:</span> <span className="text-2xl font-bold text-green-600">${camp.price}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <>
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.studentName}
                    onChange={(e) => updateBookingData('studentName', e.target.value)}
                    className={`input ${errors.studentName ? 'border-red-500' : ''}`}
                    placeholder="Enter student's full name"
                  />
                  {errors.studentName && (
                    <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={bookingData.studentAge}
                    onChange={(e) => updateBookingData('studentAge', e.target.value)}
                    className={`input ${errors.studentAge ? 'border-red-500' : ''}`}
                    placeholder="Age"
                  />
                  {errors.studentAge && (
                    <p className="text-red-500 text-sm mt-1">{errors.studentAge}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={bookingData.parentEmail}
                    onChange={(e) => updateBookingData('parentEmail', e.target.value)}
                    className={`input ${errors.parentEmail ? 'border-red-500' : ''}`}
                    placeholder="parent@example.com"
                  />
                  {errors.parentEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.parentPhone}
                    onChange={(e) => updateBookingData('parentPhone', e.target.value)}
                    className="input"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.emergencyContact}
                    onChange={(e) => updateBookingData('emergencyContact', e.target.value)}
                    className={`input ${errors.emergencyContact ? 'border-red-500' : ''}`}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContact && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Phone *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.emergencyPhone}
                    onChange={(e) => updateBookingData('emergencyPhone', e.target.value)}
                    className={`input ${errors.emergencyPhone ? 'border-red-500' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.emergencyPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <textarea
                    value={bookingData.dietaryRestrictions}
                    onChange={(e) => updateBookingData('dietaryRestrictions', e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Any food allergies or dietary restrictions..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Needs or Accommodations
                  </label>
                  <textarea
                    value={bookingData.specialNeeds}
                    onChange={(e) => updateBookingData('specialNeeds', e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Any special accommodations needed..."
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary w-full"
            >
              Continue to Payment
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              <div className="mb-4">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': { color: '#aab7c4' },
                        padding: '12px'
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Your payment is secure and encrypted. You will be charged ${camp.price} for this camp registration.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-outline flex-1"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!stripe || loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Processing...' : `Pay $${camp.price} & Book Camp`}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}