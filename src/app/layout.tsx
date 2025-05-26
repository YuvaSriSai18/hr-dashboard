import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

// const geistSans = GeistSans; // Directly use the imported object
// const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'HR Glimpse',
  description: 'Mini HR Performance Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppProvider>
              {children}
              <Toaster />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
