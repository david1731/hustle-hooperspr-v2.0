import type { Metadata } from "next";
import { Inter } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import "../../styles/globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HustleHoopersPR",
  description: "Dashboard"
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
          <h1>Dashboard</h1>
        </body>
      </html>
    );
  }