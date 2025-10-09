import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravelCircles - Bus Travel & Community in India',
  description: 'Book bus tickets and connect with fellow travelers across India. Share experiences, tips, and discover new destinations.',
  keywords: 'bus travel, booking, community, travel tips, destinations, India, Indian bus travel',
  authors: [{ name: 'TravelCircles Team' }],
  openGraph: {
    title: 'TravelCircles - Bus Travel & Community in India',
    description: 'Book bus tickets and connect with fellow travelers across India',
    url: 'https://travelcircles.com',
    siteName: 'TravelCircles',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TravelCircles - Bus Travel & Community',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TravelCircles - Bus Travel & Community',
    description: 'Book bus tickets and connect with fellow travelers',
    images: ['/twitter-image.jpg'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div id="root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
