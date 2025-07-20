"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Menu, Instagram } from "lucide-react"
import LoginSignup from "../LoginSignup"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "#servicios", label: "Nuestros Servicios" },
    { href: "#niveles", label: "Niveles" },
    { href: "#mision", label: "Nuestra Misión" },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
            HustleHoopersPR
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-900">
                  Sacar Cita
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Log in / Registrar</DialogTitle>
                </DialogHeader>
                <LoginSignup />
              </DialogContent>
            </Dialog>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="https://www.instagram.com/hustlehooperspr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-magenta-400 transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-gray-800">
              <div className="flex flex-col space-y-4 mt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-white justify-start">
                      Sacar Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Log in / Registrar</DialogTitle>
                    </DialogHeader>
                    <LoginSignup />
                  </DialogContent>
                </Dialog>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="https://www.instagram.com/hustlehooperspr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-magenta-400 transition-colors py-2"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
