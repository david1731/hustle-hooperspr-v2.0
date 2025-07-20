'use client';
import Link from 'next/link';
import { useState } from 'react';
import NavLinks from '@/components/trainerLinks';
import { signOut } from 'next-auth/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function SideNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' });
  };

  return (
    <div 
      className="fixed top-6 left-6 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={clsx(
        "bg-gray-900/90 border border-gray-800 rounded-xl backdrop-blur-sm transition-all duration-300 ease-out",
        "shadow-xl shadow-black/20",
        isExpanded ? "p-4" : "p-2"
      )}>
        {/* Navigation Links */}
        <div className="mb-2">
          <NavLinks isExpanded={isExpanded} />
        </div>

        {/* Divider */}
        {isExpanded && (
          <div className="border-t border-gray-700 my-2"></div>
        )}

        {/* Sign Out Button */}
        <Link
          href="/"
          onClick={handleSignOut}
          className={clsx(
            "flex items-center gap-2 rounded-lg font-medium transition-all duration-300 border border-transparent",
            "text-gray-300 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400",
            isExpanded ? "px-3 py-2 text-sm" : "p-2 justify-center"
          )}
          title={!isExpanded ? "Sign Out" : undefined}
        >
          <PowerIcon className="w-4 h-4 flex-shrink-0" />
          {isExpanded && <span>Sign Out</span>}
        </Link>
      </div>
    </div>
  );
}