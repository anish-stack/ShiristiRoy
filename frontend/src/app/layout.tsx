import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

import { Toaster } from '@/components/ui/Toaster';
import { personJsonLd } from '@/lib/seo';
import { LayoutProvider } from './LayoutProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://awakenwithsrishti.com'
  ),

  title: {
    default: 'Srishti Roy — Counselling Psychologist',
    template: '%s | Srishti Roy',
  },

  description:
    'Adlerian-informed integrative therapy for anxiety, relationships, self-esteem, and personal growth. Online and in-person sessions.',

  keywords: [
    'counselling psychologist',
    'adlerian therapy',
    'online therapy India',
    'anxiety therapy',
    'family therapy',
  ],

  authors: [{ name: 'Srishti Roy' }],
  creator: 'Srishti Roy',

  // ⚠️ Remove/flip this before launch — currently blocks Google indexing entirely
  robots: 'noindex,nofollow',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName:
      'Srishti Roy — Counselling Psychologist',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              personJsonLd()
            ),
          }}
        />
      </head>

      <body className="min-h-screen overflow-x-hidden">
        <LayoutProvider>
          {children}
        </LayoutProvider>

        <Toaster />
      </body>
    </html>
  );
}