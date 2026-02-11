'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRightIcon, BriefcaseIcon, CogIcon, UserGroupIcon, ChartBarIcon, LightBulbIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function WorkforcePage() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    teamSize: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/workforce-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          company: '',
          name: '',
          email: '',
          phone: '',
          teamSize: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Workforce Training
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Level Up Your Team
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your workforce with custom AI programs designed, developed, and delivered by SKILLWRAP. 
            Empower your employees with cutting-edge skills that drive innovation and competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary text-lg px-8 py-3">
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </a>
            <a href="#programs" className="btn-outline text-lg px-8 py-3">
              View Programs
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SKILLWRAP for Workforce Training?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We create tailored AI training programs that align with your business goals and industry needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CogIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Designed</h3>
              <p className="text-gray-600">
                Programs tailored specifically to your industry, company culture, and skill requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Delivered</h3>
              <p className="text-gray-600">
                Led by industry professionals with real-world experience in AI implementation and training.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Measurable Results</h3>
              <p className="text-gray-600">
                Track progress and ROI with comprehensive analytics and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Custom AI Training Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI fundamentals to advanced implementation, we design programs that meet your team where they are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LightBulbIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Fundamentals</h3>
                  <p className="text-gray-600 mb-4">
                    Build foundational understanding of AI concepts, applications, and business impact across your organization.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Machine Learning Basics
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      AI Ethics & Governance
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Business Applications
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CogIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Implementation</h3>
                  <p className="text-gray-600 mb-4">
                    Advanced training for teams ready to integrate AI tools and workflows into their daily operations.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Tool Integration
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Workflow Optimization
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Performance Measurement
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Leadership Training</h3>
                  <p className="text-gray-600 mb-4">
                    Specialized programs for executives and managers leading AI transformation initiatives.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Strategic Planning
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Change Management
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      ROI Assessment
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Function-Specific</h3>
                  <p className="text-gray-600 mb-4">
                    Customized training programs designed for specific business functions and operational areas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Marketing Tech & Analytics
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Operations & Process Automation
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Sales & Customer Success Tech
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Workforce?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Contact us to discuss your custom AI training program. We'll work with you to design a solution 
                that fits your team's needs and business objectives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-6">What to Expect:</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Initial Consultation</h4>
                      <p className="text-blue-100">We'll assess your current capabilities and training goals</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Custom Program Design</h4>
                      <p className="text-blue-100">Tailored curriculum based on your industry and needs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Expert Delivery</h4>
                      <p className="text-blue-100">Professional training delivered by industry experts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Ongoing Support</h4>
                      <p className="text-blue-100">Continued guidance and resources post-training</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get More Information</h3>
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-green-800 font-medium">Thank you! Your inquiry has been sent successfully.</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">Sorry, there was an error sending your message.</p>
                    <p className="text-red-700 text-sm mt-1">Please try again or contact us directly at ben@skillwrap.com</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Team Size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Tell us about your training needs *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your current AI knowledge level, specific goals, and any particular areas of interest..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Request Information'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}