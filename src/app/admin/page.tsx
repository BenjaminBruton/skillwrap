import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { supabaseAdmin } from '@/lib/supabase'
import { formatDateRange, formatTime } from '@/lib/utils'

async function getAllBookings() {
  try {
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        session:sessions (
          *,
          camp:camps (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return []
    }

    return bookings || []
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

async function getAllForms() {
  try {
    const [esportsWaivers, mediaReleases, generalWaivers] = await Promise.all([
      supabaseAdmin
        .from('esports_waivers')
        .select('*')
        .order('submitted_at', { ascending: false }),
      
      supabaseAdmin
        .from('media_releases')
        .select('*')
        .order('submitted_at', { ascending: false }),
      
      supabaseAdmin
        .from('general_waivers')
        .select('*')
        .order('submitted_at', { ascending: false })
    ])

    return {
      esportsWaivers: esportsWaivers.data || [],
      mediaReleases: mediaReleases.data || [],
      generalWaivers: generalWaivers.data || []
    }
  } catch (error) {
    console.error('Error fetching forms:', error)
    return {
      esportsWaivers: [],
      mediaReleases: [],
      generalWaivers: []
    }
  }
}

export default async function AdminDashboard() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Simple admin check - you can enhance this with proper role-based access control
  const adminEmails = ['ben@skillwrap.com', process.env.ADMIN_EMAIL]
  const userEmail = user.primaryEmailAddress?.emailAddress
  
  if (!adminEmails.includes(userEmail)) {
    redirect('/dashboard')
  }

  const bookings = await getAllBookings()
  const forms = await getAllForms()

  const confirmedBookings = bookings.filter((b: any) => b.booking_status === 'confirmed')
  const pendingBookings = bookings.filter((b: any) => b.payment_status === 'pending')
  const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)
  const totalForms = forms.esportsWaivers.length + forms.mediaReleases.length + forms.generalWaivers.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 mt-1">
                Manage all bookings, forms, and camp sessions
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition-colors"
            >
              Back to User Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{confirmedBookings.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingBookings.length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${totalRevenue}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Forms Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Forms Submitted</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{totalForms}</p>
              <p className="text-sm text-gray-600 mt-1">Total Forms</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{forms.esportsWaivers.length}</p>
              <p className="text-sm text-gray-600 mt-1">Esports Waivers</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{forms.mediaReleases.length}</p>
              <p className="text-sm text-gray-600 mt-1">Media Releases</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{forms.generalWaivers.length}</p>
              <p className="text-sm text-gray-600 mt-1">General Waivers</p>
            </div>
          </div>
        </div>

        {/* All Bookings List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
            <div className="text-sm text-gray-600">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Bookings will appear here as they are made.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Camp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Booked</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.student_name}</div>
                          <div className="text-sm text-gray-500">{booking.student_age} years old</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{booking.session?.camp?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          {booking.session && `${formatTime(booking.session.start_time)} - ${formatTime(booking.session.end_time)}`}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {booking.session && formatDateRange(booking.session.start_date, booking.session.end_date)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900 mb-1">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            <a href={`mailto:${booking.parent_email}`} className="hover:text-blue-600">
                              {booking.parent_email}
                            </a>
                          </div>
                          {booking.parent_phone && (
                            <div className="flex items-center text-gray-600">
                              <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <a href={`tel:${booking.parent_phone}`} className="hover:text-blue-600">
                                {booking.parent_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.booking_status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.booking_status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.booking_status}
                          </span>
                          <br />
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : booking.payment_status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900">${booking.total_amount}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Forms */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Forms</h2>
          
          <div className="space-y-6">
            {/* Esports Waivers */}
            {forms.esportsWaivers.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Esports Waivers ({forms.esportsWaivers.length})</h3>
                <div className="space-y-2">
                  {forms.esportsWaivers.slice(0, 5).map((form: any) => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{form.student_name}</p>
                        <p className="text-sm text-gray-600">{form.parent_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(form.submitted_at).toLocaleDateString()}</p>
                        <div className="flex gap-1 mt-1">
                          {form.e_rated_games_authorized && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">E</span>}
                          {form.t_rated_games_authorized && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">T</span>}
                          {form.m_rated_games_authorized && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">M</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Releases */}
            {forms.mediaReleases.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Media Releases ({forms.mediaReleases.length})</h3>
                <div className="space-y-2">
                  {forms.mediaReleases.slice(0, 5).map((form: any) => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{form.student_name}</p>
                        <p className="text-sm text-gray-600">{form.parent_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(form.submitted_at).toLocaleDateString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                          form.permission_granted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {form.permission_granted ? 'Granted' : 'Denied'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Waivers */}
            {forms.generalWaivers.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">General Waivers ({forms.generalWaivers.length})</h3>
                <div className="space-y-2">
                  {forms.generalWaivers.slice(0, 5).map((form: any) => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{form.student_name}</p>
                        <p className="text-sm text-gray-600">{form.parent_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(form.submitted_at).toLocaleDateString()}</p>
                        {form.emergency_contact_name && (
                          <p className="text-xs text-gray-500 mt-1">Emergency: {form.emergency_contact_name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalForms === 0 && (
              <div className="text-center py-8 text-gray-500">
                No forms submitted yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
