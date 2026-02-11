import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import MobileNavigation from '@/components/MobileNavigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SKILLWRAP - Tech Summer Camps',
  description: 'Join our exciting tech summer camps and learn programming, AI, entrepreneurship, and esports!',
  keywords: 'summer camp, tech camp, programming, AI, entrepreneurship, esports, kids, teens',
  authors: [{ name: 'SKILLWRAP' }],
  creator: 'SKILLWRAP',
  publisher: 'SKILLWRAP',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skillwrap.com',
    title: 'SKILLWRAP - Tech Summer Camps',
    description: 'Join our exciting tech summer camps and learn programming, AI, entrepreneurship, and esports!',
    siteName: 'SKILLWRAP',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'SKILLWRAP - Tech Summer Camps for Kids & Teens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKILLWRAP - Tech Summer Camps',
    description: 'Join our exciting tech summer camps and learn programming, AI, entrepreneurship, and esports!',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Global Header with Authentication */}
            <header className="container mx-auto px-4 py-6">
              <nav className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SW</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SKILLWRAP
                  </span>
                </Link>
                <div className="flex items-center">
                  {/* Desktop Navigation - Hidden on mobile */}
                  <div className="hidden md:flex items-center space-x-4">
                    <Link href="/after-school" className="text-gray-600 hover:text-gray-900 transition-colors">
                      After School
                    </Link>
                    <Link href="/camps" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Summer Camps
                    </Link>
                    <Link href="/forms" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Forms & Waivers
                    </Link>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="btn-primary">
                          Get Started
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Dashboard
                      </Link>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                    </SignedIn>
                  </div>
                  
                  {/* Mobile Navigation - Shown only on mobile */}
                  <MobileNavigation />
                </div>
              </nav>
            </header>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}