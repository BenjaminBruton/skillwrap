'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CancelBookingButtonProps {
  bookingId: string
  campName: string
  studentName: string
  sessionStartDate: string
}

export default function CancelBookingButton({ 
  bookingId, 
  campName, 
  studentName, 
  sessionStartDate 
}: CancelBookingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking')
      }

      // Show success message
      alert(data.message || 'Booking cancelled successfully')
      
      // Refresh the page to show updated booking status
      router.refresh()
      
    } catch (error) {
      console.error('Cancel booking error:', error)
      alert(error instanceof Error ? error.message : 'Failed to cancel booking')
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  // Calculate days until session starts
  const sessionDate = new Date(sessionStartDate)
  const now = new Date()
  const daysUntilSession = Math.ceil((sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Don't show cancel button if session is too soon or has passed
  if (daysUntilSession < 7) {
    return (
      <span className="text-gray-400 text-sm">
        {daysUntilSession < 0 ? 'Session completed' : 'Cannot cancel (less than 7 days)'}
      </span>
    )
  }

  if (showConfirmation) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Cancel <strong>{studentName}</strong>'s booking for <strong>{campName}</strong>?
        </p>
        <p className="text-xs text-gray-500">
          A full refund will be processed to your original payment method.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
          <button
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Keep Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirmation(true)}
      className="text-red-600 hover:text-red-700 font-medium text-sm"
    >
      Cancel Booking
    </button>
  )
}