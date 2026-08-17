import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Community Portal",
  description: "Connect with your community members",
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`${inter.className} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-blue-600">
                  Community Portal
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <a href="/announcements" className="text-gray-600 hover:text-gray-900">
                  Announcements
                </a>
                <a href="/trustees" className="text-gray-600 hover:text-gray-900">
                  Trustees
                </a>
                <a href="/financial-audits" className="text-gray-600 hover:text-gray-900">
                  Financial Audits
                </a>
                <a href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Community Portal. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
