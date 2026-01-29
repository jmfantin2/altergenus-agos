import type { Metadata, Viewport } from 'next';
import { Crimson_Pro, Source_Sans_3, VT323 } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth';
import { ModalManager } from '@/components/modals';
import { ThemeProvider } from '@/components/ThemeProvider';

// Serif font for reading fragments (Crimson Pro is highly readable)
const serifFont = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Sans-serif font for UI (Source Sans 3 is clean and readable)
const sansFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Retro pixel font for AGOS logo (VT323 has a nice terminal/retro feel)
// You can replace this with Bytesized if you have it locally
const bytesizedFont = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bytesized',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AlterGenus - AGOS',
  description: 'A digital archive of public domain literature',
  keywords: ['books', 'literature', 'public domain', 'reading', 'archive'],
  authors: [{ name: 'AlterGenus' }],
  openGraph: {
    title: 'AlterGenus - AGOS',
    description: 'A digital archive of public domain literature',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e3e3e3' },
    { media: '(prefers-color-scheme: dark)', color: '#131313' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${bytesizedFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ag-background text-ag-primary min-h-screen">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <ModalManager />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
