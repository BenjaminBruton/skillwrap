import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { formatDateRange, formatTime } from '@/lib/utils'

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

async function getSessions() {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        *,
        camps (
          name,
          slug
        )
      `)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching sessions:', error)
      return []
    }

    return sessions || []
  } catch (error) {
    console.error('Error in getSessions:', error)
    return []
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800'
    case 'full':
      return 'bg-red-100 text-red-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

function getTimeSlotDisplay(timeSlot: string) {
  return timeSlot === 'morning' ? 'Morning' : 'Afternoon'
}

export default async function CampCalendarPage() {
  const sessions = await getSessions()
  
  // Debug logging
  console.log('🔍 Calendar Page - Sessions received:', sessions.length)
  if (sessions.length > 0) {
    console.log('🔍 First session data:', {
      id: sessions[0].id,
      start_date: sessions[0].start_date,
      end_date: sessions[0].end_date,
      start_time: sessions[0].start_time,
      end_time: sessions[0].end_time,
      camp_name: sessions[0].camps?.name
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CalendarIcon className="h-8 w-8 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Camp Calendar
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            View all upcoming camp sessions and their availability
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/camps" className="hover:text-blue-600">Camps</Link>
          <span>/</span>
          <span className="text-gray-900">Calendar</span>
        </nav>
      </section>

      {/* Sessions Table */}
      <section className="container mx-auto px-4 py-8">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sessions Available</h3>
            <p className="text-gray-600 mb-6">
              Sessions will be displayed here once they are scheduled in the database.
            </p>
            <Link 
              href="/camps" 
              className="btn-primary"
            >
              View Camps
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                All Camp Sessions ({sessions.length} total)
              </h2>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Camp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {session.camps?.name || 'Unknown Camp'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Week {session.week_number}</div>
                        <div className="text-sm text-gray-500">{getTimeSlotDisplay(session.time_slot)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDateRange(session.start_date, session.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatTime(session.start_time)} - {formatTime(session.end_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {session.current_bookings}/{session.max_capacity}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(session.current_bookings / session.max_capacity) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {session.camps?.slug && session.status === 'open' ? (
                          <Link 
                            href={`/camps/${session.camps.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Book Now
                          </Link>
                        ) : (
                          <span className="text-gray-400">
                            {session.status === 'full' ? 'Full' : 'Unavailable'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {sessions.map((session) => (
                <div key={session.id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {session.camps?.name || 'Unknown Camp'}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      Week {session.week_number} - {getTimeSlotDisplay(session.time_slot)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDateRange(session.start_date, session.end_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {session.current_bookings}/{session.max_capacity} students
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(session.current_bookings / session.max_capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {session.camps?.slug && session.status === 'open' ? (
                    <Link 
                      href={`/camps/${session.camps.slug}`}
                      className="btn-primary w-full text-center"
                    >
                      Book This Session
                    </Link>
                  ) : (
                    <button 
                      disabled 
                      className="w-full py-2 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      {session.status === 'full' ? 'Session Full' : 'Unavailable'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Back to Camps */}
      <section className="container mx-auto px-4 pb-12">
        <div className="text-center">
          <Link 
            href="/camps" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Camps</span>
          </Link>
        </div>
      </section>
    </div>
  )
}