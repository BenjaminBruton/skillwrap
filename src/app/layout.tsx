import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SKILLWRAP - Tech Summer Camps',
  description: 'Join our exciting tech summer camps and learn programming, AI, entrepreneurship, and esports!',
  keywords: 'summer camp, tech camp, programming, AI, entrepreneurship, esports, kids, teens',
  authors: [{ name: 'SKILLWRAP' }],
  creator: 'SKILLWRAP',
  publisher: 'SKILLWRAP',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skillwrap.com',
    title: 'SKILLWRAP - Tech Summer Camps',
    description: 'Join our exciting tech summer camps and learn programming, AI, entrepreneurship, and esports!',
    siteName: 'SKILLWRAP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKILLWRAP - Tech Summer Camps',
    description: 'Join our exciting tech summer camps and learn programming, AI, entrepreneurship, and esports!',
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
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}