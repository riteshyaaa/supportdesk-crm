import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SupportDesk - Customer Support Ticketing CRM',
  description: 'A production-grade Customer Support Ticketing CRM for fast, efficient issue resolution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
              SupportDesk CRM &copy; {new Date().getFullYear()} &mdash; Built with ❤️ by Ritesh Yadav
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
