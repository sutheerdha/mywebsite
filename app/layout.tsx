import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react'; // Import ReactNode

export const metadata = {
  title: 'Itakarlapalli Sub Centre',
  description: 'Healthcare Services for the Community',
};

export default function RootLayout({ children }: { children: ReactNode }) { // Add the type annotation here
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Itakarlapalli Sub Centre</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
                <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4">
          <div className="container mx-auto text-center">
            <p>© {new Date().getFullYear()} Itakarlapalli Sub Centre. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
