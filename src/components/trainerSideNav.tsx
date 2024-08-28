'use client';
import Link from 'next/link';
import NavLinks from '@/components/trainerLinks';
import { signOut } from 'next-auth/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const link = {
  name: 'Signout',
  href: '/',
  icon: <PowerIcon className="w-6 h-6" />

};
export default function SideNav() {
  const pathname = usePathname();
  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' }); //redirects user to homepage when signed out
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
        <Link 
          key={link.name} 
          href={link.href}
          onClick={handleSignOut} 
          className={clsx(
            'flex items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
            { 'bg-sky-100 text-blue-600': pathname === link.href}
          )}
        >
          {link.icon}
          <p>{link.name}</p>
        </Link>
      </div>
    </div>
  );
}