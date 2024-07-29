'use client';
import Link from 'next/link';
import NavLinks from '@/components/nav-links';
import { signOut } from 'next-auth/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { Button } from 'react-bootstrap';

export default function SideNav() {
  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-fuchsia-50 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          {/* Add logo or brand name here */}
        </div>
      </Link>
      <div className="flex grow flex-col space-y-2">
        <NavLinks/>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <Button onClick={handleSignOut} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <PowerIcon className="w-6 h-6 text-black" />
          <span className="text-black">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
