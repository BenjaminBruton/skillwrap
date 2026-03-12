import { CodeBracketIcon, RocketLaunchIcon, TrophyIcon, ComputerDesktopIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'

// Map camp slugs to their UI properties (icons, colors, highlights)
export const campUIConfig = {
  'software-dev-ai': {
    icon: CodeBracketIcon,
    color: 'from-blue-500 to-purple-600',
    highlights: ['LLM Integration', 'Prompt Engineering', 'AI-Powered Debugging', 'Python Applications', 'Personal AI Assistant'],
    features: ['LLM Integration', 'Prompt Engineering', 'AI-Powered Debugging', 'Python Applications', 'Personal AI Assistant']
  },
  'entrepreneurship-shark-tank': {
    icon: RocketLaunchIcon,
    color: 'from-yellow-500 to-red-600',
    highlights: ['Market Research', 'Financial Modeling', 'Brand Development', 'Investor Pitching', 'Public Speaking'],
    features: ['Market Research', 'Financial Modeling', 'Brand Development', 'Investor Pitching', 'Public Speaking']
  },
  'esports-academy': {
    icon: TrophyIcon,
    color: 'from-purple-500 to-pink-600',
    highlights: ['Tournament Organization', 'Broadcast Production', 'Team Management', 'Digital Branding', 'Strategic Analysis'],
    features: ['Tournament Organization', 'Broadcast Production', 'Team Management', 'Digital Branding', 'Strategic Analysis']
  },
  'tabletop-gaming': {
    icon: PuzzlePieceIcon,
    color: 'from-orange-500 to-red-600',
    highlights: ['Advanced Deck Building', 'Tournament Strategy', 'Card Game Economics', 'Meta Analysis', 'Professional Gaming Mindset'],
    features: ['Advanced Deck Building', 'Tournament Strategy', 'Card Game Economics', 'Meta Analysis', 'Professional Gaming Mindset']
  }
}

// Enhanced camp type that includes UI properties
export interface EnhancedCamp {
  id: number
  name: string
  slug: string
  short_description: string
  description: string
  price: number
  age_range: string
  max_capacity: number
  icon?: any
  color?: string
  highlights?: string[]
  features?: string[]
}

// Function to enhance camp data with UI properties
export function enhanceCampData(camps: any[]): EnhancedCamp[] {
  return camps.map(camp => ({
    ...camp,
    ...campUIConfig[camp.slug as keyof typeof campUIConfig]
  }))
}