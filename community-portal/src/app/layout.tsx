import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "સમુદાય પોર્ટલ | Community Portal",
  description: "સમુદાય સભ્યો સાથે જોડાઓ | Connect with your community members",
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="gu" className={`${inter.className} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-blue-600">
                  સમુદાય પોર્ટલ
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <a href="/announcements" className="text-gray-600 hover:text-gray-900">
                  સમાચાર
                </a>
                <a href="/trustees" className="text-gray-600 hover:text-gray-900">
                  ટ્રસ્ટીઓ
                </a>
                <a href="/financial-audits" className="text-gray-600 hover:text-gray-900">
                  નાણાકીય અહેવાલ
                </a>
                <a href="/login" className="text-gray-600 hover:text-gray-900">
                  લૉગિન
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  નોંધણી કરો
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} સમુદાય પોર્ટલ. સર્વાધિકાર સુરક્ષિત.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
