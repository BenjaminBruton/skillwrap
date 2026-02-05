'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // General Information
  {
    id: 'what-is-skillwrap',
    question: 'What is SKILLWRAP?',
    answer: 'SKILLWRAP is a tech summer camp company offering specialized week-long programs for kids and teens aged 10-18. We focus on hands-on learning in software development, entrepreneurship, and esports, giving students real-world skills through expert mentorship and practical projects.',
    category: 'General'
  },
  {
    id: 'age-requirements',
    question: 'What are the age requirements for each camp?',
    answer: 'Our camps are designed for different age groups: Software Development camps (AI-Powered Productivity and Full-Stack Development) are for ages 13-18, while Entrepreneurship and Esports Academy are for ages 10-18. We group students appropriately within these ranges to ensure optimal learning experiences.',
    category: 'General'
  },
  {
    id: 'camp-duration',
    question: 'How long are the camps?',
    answer: 'All our camps are week-long programs running Monday through Friday. Morning sessions run from 8:00 AM to 12:00 PM, and afternoon sessions run from 1:00 PM to 5:00 PM. Each camp provides 20 hours of intensive, hands-on learning.',
    category: 'General'
  },
  {
    id: 'location',
    question: 'Where are the camps held?',
    answer: 'Our camps are located in Waco, Texas, serving the Greater Waco Area. We partner with Nexus Esports to provide state-of-the-art facilities and equipment for our programs.',
    category: 'General'
  },

  // Enrollment & Pricing
  {
    id: 'pricing',
    question: 'How much do the camps cost?',
    answer: 'Software Development camps (AI-Powered Productivity and Full-Stack Development) are $350 per week. Entrepreneurship and Esports Academy camps are $300 per week. All materials, equipment, and instruction are included in the price.',
    category: 'Enrollment'
  },
  {
    id: 'registration-process',
    question: 'How do I register my child for a camp?',
    answer: 'Registration is easy! Browse our available camps, select your preferred dates and times, create an account, and complete the booking process with secure online payment. You\'ll receive immediate confirmation and detailed information about your child\'s camp experience.',
    category: 'Enrollment'
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) through our secure Stripe payment system. Payment is required at the time of booking to secure your child\'s spot.',
    category: 'Enrollment'
  },
  {
    id: 'capacity-limits',
    question: 'How many students are in each camp session?',
    answer: 'We maintain small class sizes for personalized attention. Software Development camps are limited to 12 students per session, while Entrepreneurship and Esports Academy camps accommodate up to 20 students. This ensures every student gets the individual support they need.',
    category: 'Enrollment'
  },

  // Cancellation & Refunds
  {
    id: 'cancellation-policy',
    question: 'What\'s your cancellation policy?',
    answer: 'We offer full refunds up to 2 weeks before the camp starts. After that, we offer a 50% refund up to 1 week before, or you can transfer to another session. For cancellations or transfers, please contact us at ben@skillwrap.com.',
    category: 'Policies'
  },
  {
    id: 'weather-cancellations',
    question: 'What happens if camps are cancelled due to weather or emergencies?',
    answer: 'In the rare event of weather-related or emergency cancellations, we will provide full refunds or reschedule to alternative dates. We prioritize student safety and will communicate any changes immediately via email and phone.',
    category: 'Policies'
  },

  // Technical Requirements
  {
    id: 'equipment-needed',
    question: 'Do students need to bring their own computers or equipment?',
    answer: 'No! We provide all necessary computers, software, and equipment. Students just need to bring themselves, a notebook for taking notes, and enthusiasm to learn. We use industry-standard tools and provide each student with their own workstation.',
    category: 'Technical'
  },
  {
    id: 'experience-required',
    question: 'Does my child need prior programming or tech experience?',
    answer: 'No prior experience is required! Our camps are designed to welcome complete beginners while also challenging students with some background. Our expert instructors adapt to each student\'s skill level and provide appropriate challenges and support.',
    category: 'Technical'
  },
  {
    id: 'take-home-projects',
    question: 'Will my child have projects to take home?',
    answer: 'Absolutely! Students will complete real projects they can showcase and continue working on at home. Software students build AI assistants and web applications, entrepreneurship students develop complete business plans, and esports students create tournament strategies and content.',
    category: 'Technical'
  },

  // Daily Experience
  {
    id: 'typical-day',
    question: 'What does a typical camp day look like?',
    answer: 'Each day combines hands-on project work, expert instruction, collaborative activities, and skill-building exercises. Students work on real-world projects, receive personalized mentorship, and participate in group activities that reinforce learning while having fun.',
    category: 'Experience'
  },
  {
    id: 'lunch-snacks',
    question: 'Are lunch and snacks provided?',
    answer: 'Students should bring their own lunch and snacks. We provide water and have designated break times. For full-day students (attending both morning and afternoon sessions), we have a supervised lunch break with comfortable eating areas.',
    category: 'Experience'
  },
  {
    id: 'supervision',
    question: 'What kind of supervision and safety measures do you have?',
    answer: 'All camps are supervised by qualified instructors with background checks. We maintain appropriate adult-to-student ratios, have clear safety protocols, and require emergency contact information. Our facilities are secure and designed for educational activities.',
    category: 'Experience'
  },

  // Specific Camps
  {
    id: 'ai-camp-details',
    question: 'What will my child learn in the AI-Powered Productivity camp?',
    answer: 'Students learn to integrate Large Language Models (LLMs) into Python applications, master prompt engineering, use AI for automated debugging, and build their own AI-powered personal assistant or productivity bot. They transition from AI "users" to AI "builders."',
    category: 'Camps'
  },
  {
    id: 'fullstack-camp-details',
    question: 'What technologies are covered in the Full-Stack Development camp?',
    answer: 'Students learn React and Tailwind CSS for frontend development, cloud databases with Supabase, user authentication systems, and complete the week by building and deploying a real Minimum Viable Product (MVP) for a problem they choose to solve.',
    category: 'Camps'
  },
  {
    id: 'entrepreneurship-camp-details',
    question: 'What does the Entrepreneurship camp include?',
    answer: 'Students experience the complete startup journey from idea to pitch. They learn market research, financial modeling, brand development, and public speaking skills, culminating in a "Shark Tank" style presentation to a panel of judges.',
    category: 'Camps'
  },
  {
    id: 'esports-camp-details',
    question: 'Is the Esports Academy just about playing games?',
    answer: 'Not at all! While we incorporate high-level gameplay, the focus is on the business side of esports. Students learn tournament organization, broadcast production with OBS, team management, digital branding, and strategic analysis of the multi-billion dollar esports industry.',
    category: 'Camps'
  },

  // Contact & Support
  {
    id: 'contact-questions',
    question: 'Who can I contact if I have more questions?',
    answer: 'You can reach us at ben@skillwrap.com or call (254) 555-SKILL. We typically respond to emails within 24 hours and are available Monday-Friday, 9 AM - 6 PM CST. We\'re always happy to discuss how our camps can benefit your child!',
    category: 'Contact'
  }
]

const categories = ['All', 'General', 'Enrollment', 'Policies', 'Technical', 'Experience', 'Camps', 'Contact']

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our tech camps, enrollment process, and what to expect.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {openItems.includes(faq.id) ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-4">
                    <div className="pl-16">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team is here to help you with any specific questions about our camps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/camps" className="btn bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50">
              View Our Camps
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}