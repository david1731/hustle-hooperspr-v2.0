import { Card, CardContent } from "@/components/ui/card"

export default function Mission() {
  return (
    <section id="mision" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Nuestra Misión</h2>
        </div>

        {/* Mission Content */}
        <div className="flex justify-center">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 max-w-4xl">
            <CardContent className="p-12">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed text-center">
                Nuestra misión es que el cliente se sienta en familia y llevar a nuestro Señor a través de nuestro
                servicio. Mejorar su juego individual para que aporten en lo colectivo. Ser de ayuda a su disciplina
                tanto en los entrenamientos como en la vida.{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text font-semibold">
                  ¡GRACIAS!
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
