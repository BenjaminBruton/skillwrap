'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { formatDateRange, formatTime } from '@/lib/utils'
import BookingForm from './BookingForm'
import { Camp, Session } from '@/types'

interface SessionSelectorProps {
  sessions: Session[]
  camp: Camp
}

export default function SessionSelector({ sessions, camp }: SessionSelectorProps) {
  const { user, isSignedIn } = useUser()
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const handleSessionSelect = (session: Session) => {
    if (!isSignedIn) {
      // Redirect to sign in
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setSelectedSession(session)
    setShowBookingForm(true)
  }

  const handleBookingSuccess = () => {
    setShowBookingForm(false)
    setSelectedSession(null)
  }

  const handleBookingError = (error: string) => {
    console.error('Booking error:', error)
    // You could show a toast notification here
    alert(`Booking failed: ${error}`)
  }

  if (showBookingForm && selectedSession) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Complete Your Booking</h3>
          <button
            onClick={() => setShowBookingForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Sessions
          </button>
        </div>
        <BookingForm
          session={selectedSession}
          camp={camp}
          onSuccess={handleBookingSuccess}
          onError={handleBookingError}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">
                Week {session.week_number} - {session.time_slot.charAt(0).toUpperCase() + session.time_slot.slice(1)}
              </h4>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDateRange(session.start_date, session.end_date)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${camp.price}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 mr-2" />
              {formatTime(session.start_time)} - {formatTime(session.end_time)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              {session.available_spots ?? 0} spots left
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                (session.available_spots ?? 0) > 5 ? 'bg-green-500' :
                (session.available_spots ?? 0) > 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {(session.available_spots ?? 0) > 5 ? 'Available' :
                 (session.available_spots ?? 0) > 2 ? 'Limited spots' : 'Almost full'}
              </span>
            </div>

            {isSignedIn ? (
              <button
                onClick={() => handleSessionSelect(session)}
                disabled={!(session.is_available ?? false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  (session.is_available ?? false)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {(session.is_available ?? false) ? 'Book Now' : 'Full'}
              </button>
            ) : (
              <Link
                href={`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In to Book
              </Link>
            )}
          </div>
        </div>
      ))}

      {!isSignedIn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-blue-900 mb-2">Ready to Join?</h4>
          <p className="text-blue-800 text-sm mb-3">
            Sign up for a free account to book your camp session and manage your bookings.
          </p>
          <div className="flex space-x-3">
            <Link
              href="/sign-up"
              className="btn-primary text-sm"
            >
              Create Account
            </Link>
            <Link
              href="/sign-in"
              className="btn-outline text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}