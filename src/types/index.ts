export interface Camp {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  age_range: string
  max_capacity: number
  price: number
  image_url: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  camp_id: string
  session_number: number
  time_slot: 'morning' | 'afternoon'
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  current_bookings: number
  max_capacity: number
  status: 'open' | 'full' | 'cancelled'
  created_at: string
  updated_at: string
  camp?: Camp
}

export interface Booking {
  id: string
  user_id: string
  session_id: string
  student_name: string
  student_age: number
  parent_email: string
  parent_phone?: string
  emergency_contact: string
  emergency_phone: string
  dietary_restrictions?: string
  special_needs?: string
  stripe_payment_intent_id?: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  booking_status: 'confirmed' | 'cancelled' | 'waitlist'
  total_amount: number
  created_at: string
  updated_at: string
  session?: Session
}

export interface User {
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: 'parent' | 'admin'
  created_at: string
  updated_at: string
}

export interface BookingFormData {
  student_name: string
  student_age: number
  parent_email: string
  parent_phone?: string
  emergency_contact: string
  emergency_phone: string
  dietary_restrictions?: string
  special_needs?: string
}

export interface SessionWithAvailability extends Session {
  available_spots: number
  is_available: boolean
}

export interface CampWithSessions extends Camp {
  sessions: SessionWithAvailability[]
}