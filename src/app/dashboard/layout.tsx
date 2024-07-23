// src/app/dashboard/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideNav from "../../components/sideNav";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS without source maps
import "../../styles/globals.css";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { SessionProvider } from '@/app/context/SessionContext';
import { User } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: "HustleHoopersPR",
  description: "Dashboard"
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <p>You are not signed in</p>
      </div>
    );
  }

  const user: User = {
    name: session.user?.name || '',
    email: session.user?.email || '',
    image: session.user?.image || '',
  };

  return (
    <SessionProvider user={user}>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}

