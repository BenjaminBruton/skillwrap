'use client'

import { useEffect } from 'react'

interface Session {
  id: string
  camp_id: string
  week_number: number
  time_slot: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  current_bookings: number
  max_capacity: number
  status: string
  camps?: {
    name: string
    slug: string
  }
}

interface CalendarDebugProps {
  sessions: Session[]
}

export default function CalendarDebug({ sessions }: CalendarDebugProps) {
  useEffect(() => {
    console.log('🔍 CLIENT: Calendar Debug - Sessions received:', sessions.length)
    if (sessions.length > 0) {
      console.log('🔍 CLIENT: First session data:', {
        id: sessions[0].id,
        start_date: sessions[0].start_date,
        end_date: sessions[0].end_date,
        start_time: sessions[0].start_time,
        end_time: sessions[0].end_time,
        camp_name: sessions[0].camps?.name
      })
      console.log('🔍 CLIENT: All sessions:', sessions)
    }
  }, [sessions])

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      Debug: {sessions.length} sessions
    </div>
  )
}