import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideNav from "../../components/sideNav";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "HustleHoopersPR",
  description: "Dashboard"
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}