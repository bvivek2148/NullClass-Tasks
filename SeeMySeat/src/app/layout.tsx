import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SeeMySeat - Virtual Bus Tour Experience',
  description: 'Experience your journey before you travel with our immersive 360° virtual bus tours and interactive seat selection.',
  keywords: 'virtual tour, bus booking, seat selection, 360 degree, travel, transportation',
  authors: [{ name: 'SeeMySeat Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'SeeMySeat - Virtual Bus Tour Experience',
    description: 'Experience your journey before you travel with our immersive 360° virtual bus tours and interactive seat selection.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeeMySeat - Virtual Bus Tour Experience',
    description: 'Experience your journey before you travel with our immersive 360° virtual bus tours and interactive seat selection.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>

        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}