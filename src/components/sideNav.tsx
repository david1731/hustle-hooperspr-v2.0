import Link from 'next/link';
import NavLinks from '@/components/nav-links';

export default function SideNav() {
  return (
    <div className="flex flex-col h-full w-64 bg-gray-800 text-white">
      <Link
        className="flex items-center justify-start p-4 bg-blue-600 h-20"
        href="/"
      >
        <div className="text-white text-lg font-bold">
          Dashboard
        </div>
      </Link>
      <div className="flex flex-col grow">
        <NavLinks />
      </div>
    </div>
  );
}