import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import "./globals.css";
import NavBar from "../components/NavBar"; // Ensure you have the NavBar component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HustleHoopersPR",
  description: "Homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar /> {/* Add NavBar component here */}
        {children}
      </body>
    </html>
  );
}

