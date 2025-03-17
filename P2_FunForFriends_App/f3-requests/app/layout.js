import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import PageTransition from "@/components/PageTransition";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "F3 Requests - Manage Applications",
  description: "Application to manage and display submitted applications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-b from-[#22093E] via-[#8E044B] to-[#FF7F4C]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#333',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '0.375rem',
                  padding: '0.75rem 1rem',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
