'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import clsx from 'clsx';
import { HomeIcon, CalendarIcon, PencilIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';


export default function NavLinks() {
  const pathname = usePathname();
  const params = useParams();
  const { trainer_id } = params; // Get the trainer_id from the URL

  const links = [
    { 
      name: 'Home', 
      href: `/trainerSignin/${trainer_id}/trainerDashboard`, 
      icon: <HomeIcon className="w-6 h-6" />
    },
    { 
      name: 'Mis Citas', 
      href: `/trainerSignin/${trainer_id}/trainerDashboard/citas`, 
      icon: <CalendarIcon className="w-6 h-6" />
    },
    { 
      name: 'Modificar Horas', 
      href: `/trainerSignin/${trainer_id}/trainerDashboard/modificaHoras`, 
      icon: <PencilIcon className="w-6 h-6" />
    },
    {
      name: 'Horas Disponible',
      href: `/trainerSignin/${trainer_id}/trainerDashboard/citasDispo`,
      icon: <CalendarDaysIcon className='w-6 h-6'/>
    }
  ];
  
  return (
    <div className="flex flex-col space-y-2">
      {links.map((link) => (
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

