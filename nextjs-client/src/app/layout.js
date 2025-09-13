import ClientProviders from '../components/ClientProviders';
import './globals.css';

export const metadata = {
  title: 'Student Productivity Dashboard',
  description: 'A comprehensive productivity application for students featuring task management, calendar integration, Pomodoro timer, and note-taking capabilities.',
  keywords: 'student productivity, task management, calendar, pomodoro timer, notes, study planner',
  authors: [{ name: 'Ronak Malam' }],
  creator: 'Student Productivity Dashboard',
  publisher: 'Student Productivity Dashboard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Student Productivity Dashboard',
    description: 'Boost your academic productivity with our comprehensive dashboard featuring task management, calendar, Pomodoro timer, and notes.',
    url: '/',
    siteName: 'Student Productivity Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Student Productivity Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Productivity Dashboard',
    description: 'Boost your academic productivity with our comprehensive dashboard.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}