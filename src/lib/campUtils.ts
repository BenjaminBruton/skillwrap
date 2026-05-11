import { CodeBracketIcon, RocketLaunchIcon, PencilIcon, TrophyIcon, ComputerDesktopIcon, PuzzlePieceIcon, PaintBrushIcon, CameraIcon, AcademicCapIcon, SparklesIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

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
  },
  'junior-art-masterclass': {
    icon: PencilIcon,
    color: 'from-pink-500 to-rose-600',
    highlights: ['Drawing Still Life', 'Clay Work', 'Self Portraits', 'Painted Paper Collages', 'Creative Development'],
    features: ['Drawing Still Life', 'Clay Work', 'Self Portraits', 'Painted Paper Collages', 'Creative Development']
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
  image_url?: string
  instructor_bio?: string
  instructor_photo?: string
  icon?: any
  color?: string
  highlights?: string[]
  features?: string[]
}

// Function to enhance camp data with UI properties
export function enhanceCampData(camps: any[]): EnhancedCamp[] {
  return camps.map(camp => {
    const config = campUIConfig[camp.slug as keyof typeof campUIConfig]
    
    // Debug: log if camp config is missing
    if (!config) {
      console.warn(`No UI config found for camp slug: "${camp.slug}". Available slugs:`, Object.keys(campUIConfig))
    }
    
    return {
      ...camp,
      // Use config if found, otherwise provide fallback
      icon: config?.icon || AcademicCapIcon,
      color: config?.color || 'from-gray-500 to-gray-600',
      highlights: config?.highlights || [],
      features: config?.features || []
    }
  })
}
