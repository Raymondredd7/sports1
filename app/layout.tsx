import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Football Predictions AI',
  description: 'AI-powered football match predictions and betting tips',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
                    ⚽ PredictAI
                  </Link>
                </div>
              </div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 