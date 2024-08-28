'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { HomeIcon, CalendarIcon, PencilIcon } from '@heroicons/react/24/outline';

//links for the dashboard page subsections
const links = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    icon: <HomeIcon className="w-6 h-6" />
  },
  { 
    name: 'Mis Citas', 
    href: '/dashboard/citas', 
    icon: <CalendarIcon className="w-6 h-6" />
  },
  { 
    name: 'Sacar Citas', 
    href: '/dashboard/sacaCitas', 
    icon: <PencilIcon className="w-6 h-6" />
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col space-y-2">
      {links.map((link) => ( //displays every link, its icon, and name 
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            'flex items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
            { 'bg-sky-100 text-blue-600': pathname === link.href }
          )}
        >
          {link.icon}
          <p>{link.name}</p>
        </Link>
      ))}
    </div>
  );
}

