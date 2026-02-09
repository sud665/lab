import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider, SmoothScrollProvider, CursorProvider } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Max | Full-Stack Developer & AI Engineer',
  description: 'Interactive portfolio showcasing full-stack development, AI/agent engineering, and creative UI/UX projects.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <CursorProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
