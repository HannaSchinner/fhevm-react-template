import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FhevmProvider } from '@/components/FhevmProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Private Music Royalty - FHEVM Example',
  description: 'A Next.js example demonstrating FHEVM SDK integration for private music royalty distribution',
};

/**
 * Root Layout
 *
 * This layout:
 * - Wraps the entire application
 * - Provides FHEVM context to all components
 * - Sets up global styles and fonts
 * - Configures metadata for SEO
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FhevmProvider>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
