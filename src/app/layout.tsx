import type { Metadata } from "next";
import { SessionProvider } from 'next-auth/react';
import { Inter } from "next/font/google";
import Script from 'next/script'; // Import Script from next/script
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HustleHoopersPR",
  description: "Homepage"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive" // Load script after page becomes interactive
        />
      </body>
    </html>
  );
}



