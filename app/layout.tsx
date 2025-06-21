import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { neobrutalism } from '@clerk/themes'
import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'DocuChat - AI Powered Document Analysis',
  description: 'Upload and chat with your PDF documents using AI. Extract insights, ask questions, and get instant answers from your documents.',
  keywords: ['PDF chat', 'AI document analysis', 'PDF reader', 'document AI', 'chat with documents'],
  authors: [{ name: 'Siddik Mulla' }],
  creator: 'Siddik Mulla',
  publisher: 'Siddik',
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
  metadataBase: new URL('https://chat.siddik.site'),
  alternates: {
    canonical: 'https://chat.siddik.site',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chat.siddik.site',
    title: 'DocuChat - AI Powered Document Analysis',
    description: 'Upload and chat with your PDF documents using AI. Extract insights, ask questions, and get instant answers from your documents.',
    siteName: 'DocuChat',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DocuChat - AI Document Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocuChat - AI Powered Document Analysis',
    description: 'Upload and chat with your PDF documents using AI. Extract insights, ask questions, and get instant answers.',
    images: ['/og-image.jpg'],
    creator: '@__sid_m',
  },
  verification: {
    google: 'f6_GGR5odbk_2hLZLgu725VBqRWDICAomY153j1-OEA',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/dc.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/dc.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="f6_GGR5odbk_2hLZLgu725VBqRWDICAomY153j1-OEA" />
      </head>
      <body className="min-h-screen h-screen overflow-hidden flex flex-col">
        <ClerkProvider appearance={{
          signIn: { baseTheme: neobrutalism },
        }}>
          {children}
          <Toaster />
          <StructuredData />
        </ClerkProvider>
      </body>
    </html>
  );
}
