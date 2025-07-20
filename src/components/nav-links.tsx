"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { HomeIcon, CalendarIcon, PencilIcon } from "@heroicons/react/24/outline"

// links for the dashboard page subsections
const links = [
  { name: "Home", href: "/dashboard", icon: <HomeIcon className="w-4 h-4" /> },
  { name: "Mis Citas", href: "/dashboard/citas", icon: <CalendarIcon className="w-4 h-4" /> },
  { name: "Sacar Citas", href: "/dashboard/sacaCitas", icon: <PencilIcon className="w-4 h-4" /> },
]

interface NavLinksProps {
  isExpanded: boolean
}

export default function NavLinks({ isExpanded }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <div className={clsx(
      "flex transition-all duration-300",
      isExpanded ? "flex-col space-y-2" : "flex-row space-x-1"
    )}>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            "flex items-center gap-2 rounded-lg font-medium transition-all duration-300 border border-transparent",
            "text-gray-300 hover:bg-cyan-500/20 hover:border-cyan-500/30 hover:text-cyan-400",
            {
              "bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border-cyan-500/30 text-white":
                pathname === link.href,
            },
            isExpanded ? "px-3 py-2 text-sm justify-start min-w-[120px]" : "p-2 justify-center"
          )}
          title={!isExpanded ? link.name : undefined}
        >
          <span className="flex-shrink-0">{link.icon}</span>
          {isExpanded && <span className="whitespace-nowrap">{link.name}</span>}
        </Link>
      ))}
    </div>
  )
}
