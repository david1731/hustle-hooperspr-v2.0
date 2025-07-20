import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-magenta-500/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-8">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            ¡Bienvenidos a{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
              HustleHoopersPR
            </span>
            !
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            HustleHoopersPR es un servicio de entrenamientos
            <br className="hidden sm:block" />
            especializados e individualizados de baloncesto
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-3 text-lg"
            >
              Comenzar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-900 hover:text-cyan-400 hover:border-cyan-400 px-8 py-3 text-lg bg-transparent"
              asChild
            >
              <Link href="https://www.instagram.com/hustlehooperspr/" target="_blank">
                Contáctanos
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <Image
              src="/hustlehoopers.png"
              alt="HustleHoopers Basketball Training"
              width={800}
              height={400}
              className="rounded-2xl shadow-2xl border border-gray-800"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
