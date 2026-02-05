import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { formatDateRange, formatTime } from '@/lib/utils'
import { Booking, Session, Camp } from '@/types'
import fs from 'fs'
import path from 'path'

// Mock bookings for when database is not available
const mockBookings = [
  {
    id: '1',
    user_id: 'user_123',
    session_id: '2',
    student_name: 'Alex Johnson',
    student_age: 15,
    parent_email: 'parent@example.com',
    parent_phone: '555-0123',
    emergency_contact: 'Jane Johnson',
    emergency_phone: '555-0124',
    dietary_restrictions: 'No nuts',
    special_needs: '',
    stripe_payment_intent_id: 'pi_test_123',
    payment_status: 'completed' as const,
    booking_status: 'confirmed' as const,
    total_amount: 350,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    session: {
      id: '2',
      camp_id: '1',
      week_number: 1,
      time_slot: 'afternoon' as const,
      start_date: '2024-06-03',
      end_date: '2024-06-07',
      start_time: '13:00:00',
      end_time: '17:00:00',
      current_bookings: 8,
      max_capacity: 12,
      status: 'open' as const,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      camp: {
        id: '1',
        name: 'Software Development + AI',
        slug: 'software-dev-ai',
        description: 'Learn to build intelligent applications using cutting-edge AI technologies.',
        short_description: 'Build intelligent applications with Python and AI',
        age_range: '13-18',
        max_capacity: 12,
        price: 350,
        image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    }
  }
]

async function getUserBookings(userId: string) {
  try {
    // Try to fetch from database first using supabaseAdmin to bypass RLS
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        session:sessions (
          *,
          camp:camps (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && bookings) {
      console.log(`Found ${bookings.length} bookings for user ${userId}`)
      return bookings as (Booking & { session: Session & { camp: Camp } })[]
    } else {
      console.log('Database query failed:', error)
    }
  } catch (error) {
    console.log('Database not available, checking local bookings:', error)
  }

  // Check for local booking files
  try {
    const bookingsDir = path.join(process.cwd(), 'data', 'bookings')
    const bookingFile = path.join(bookingsDir, `${userId}.json`)
    
    if (fs.existsSync(bookingFile)) {
      const bookingData = fs.readFileSync(bookingFile, 'utf8')
      const localBookings = JSON.parse(bookingData)
      
      // Add mock session and camp data to local bookings
      const bookingsWithSessionData = localBookings.map((booking: any) => ({
        ...booking,
        session: {
          id: booking.session_id,
          camp_id: '1', // Default to first camp for demo
          week_number: 1,
          time_slot: 'afternoon' as const,
          start_date: '2024-06-03',
          end_date: '2024-06-07',
          start_time: '13:00:00',
          end_time: '17:00:00',
          current_bookings: 8,
          max_capacity: 12,
          status: 'open' as const,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          camp: {
            id: '1',
            name: 'Software Development + AI',
            slug: 'software-dev-ai',
            description: 'Learn to build intelligent applications using cutting-edge AI technologies.',
            short_description: 'Build intelligent applications with Python and AI',
            age_range: '13-18',
            max_capacity: 12,
            price: 350,
            image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        }
      }))
      
      console.log(`Found ${localBookings.length} local bookings for user ${userId}`)
      return bookingsWithSessionData
    }
  } catch (error) {
    console.log('No local bookings found, using mock data')
  }

  // Fallback to mock data
  return mockBookings.filter(booking => booking.user_id === userId)
}

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const bookings = await getUserBookings(user.id)

  const confirmedBookings = bookings.filter((b: any) => b.booking_status === 'confirmed')
  const pendingBookings = bookings.filter((b: any) => b.payment_status === 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName || 'Parent'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your camp bookings and student information
              </p>
            </div>
            <Link
              href="/camps"
              className="btn-primary"
            >
              Book Another Camp
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{confirmedBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${confirmedBookings.reduce((sum: number, b: any) => sum + b.total_amount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
            {bookings.length === 0 && (
              <Link
                href="/camps"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Book your first camp →
              </Link>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="max-w-md mx-auto">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">
                  Ready to give your child an amazing tech camp experience? Browse our camps and book a session.
                </p>
                <Link
                  href="/camps"
                  className="btn-primary"
                >
                  Browse Camps
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.session?.camp?.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.booking_status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.booking_status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.payment_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Payment {booking.payment_status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          Student: {booking.student_name}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {booking.session && formatDateRange(booking.session.start_date, booking.session.end_date)}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {booking.session && `${formatTime(booking.session.start_time)} - ${formatTime(booking.session.end_time)}`}
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          ${booking.total_amount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Age:</span> {booking.student_age} years old
                      </div>
                      <div>
                        <span className="font-medium">Emergency Contact:</span> {booking.emergency_contact} ({booking.emergency_phone})
                      </div>
                      {booking.dietary_restrictions && (
                        <div>
                          <span className="font-medium">Dietary Restrictions:</span> {booking.dietary_restrictions}
                        </div>
                      )}
                      {booking.special_needs && (
                        <div>
                          <span className="font-medium">Special Needs:</span> {booking.special_needs}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-4 mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-3">
                      {booking.payment_status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Complete Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cancellation Policy</h2>
          <div className="card p-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Cancellation Policy
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Full refund:</strong> Up to 2 weeks before camp starts</li>
                      <li><strong>50% refund:</strong> Up to 1 week before camp starts</li>
                      <li><strong>Transfer option:</strong> You can transfer to another session instead of cancelling</li>
                      <li><strong>Less than 1 week:</strong> No refunds, but transfers may still be available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Need to cancel or transfer a booking? Please contact us directly:
              </p>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-900">Contact for Cancellations</p>
                  <a
                    href="mailto:ben@skillwrap.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ben@skillwrap.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/camps"
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Book Another Camp</h3>
                  <p className="text-sm text-gray-600">Browse available sessions</p>
                </div>
              </div>
            </Link>

            <div className="card p-6 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Update Profile</h3>
                  <p className="text-sm text-gray-600">Manage account settings</p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Payment History</h3>
                  <p className="text-sm text-gray-600">View past transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}