import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Field Estimate Tool',
  description: 'HVAC field estimate generator',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Estimates',
    statusBarStyle: 'default',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        {/* Container for the app */}
        <div className="flex min-h-screen flex-col bg-slate-50 relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
