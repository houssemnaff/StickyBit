import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Chatbot } from '@/components/shared/chatbot'

import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CyberAman - خلّيك آمن على الإنترنت',
  description: 'منصة تثقيفية مجانية لحماية نفسك من الاحتيالات الإلكترونية والتصيد الاحتيالي والأرقام الوهمية والجرائم الإلكترونية. تعلم بسهولة وأمان.',
  keywords: ['cybersecurity', 'phishing', 'scam', 'protection', 'cybersecurity-awareness', 'دراية', 'أمان', 'احتيال', 'تصيد'],
  authors: [{ name: 'CyberAman Team' }],
  creator: 'CyberAman',
  applicationName: 'CyberAman',
  referrer: 'strict-origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'CyberAman - خلّيك آمن على الإنترنت',
    description: 'منصة تثقيفية لحماية نفسك من الاحتيالات الإلكترونية',
    type: 'website',
    siteName: 'CyberAman',
    locale: 'ar_TN',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={geist.className}>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
       
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
