import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function formatDateRange(startDate: string, endDate: string): string {
  // Parse dates as local dates to avoid timezone conversion issues
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number)
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number)
  
  const start = new Date(startYear, startMonth - 1, startDay) // Month is 0-indexed
  const end = new Date(endYear, endMonth - 1, endDay)
  
  const startMonthName = start.toLocaleDateString('en-US', { month: 'short' })
  const endMonthName = end.toLocaleDateString('en-US', { month: 'short' })
  
  if (startMonthName === endMonthName) {
    return `${startMonthName} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`
  }
  
  return `${startMonthName} ${start.getDate()} - ${endMonthName} ${end.getDate()}, ${start.getFullYear()}`
}

export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}