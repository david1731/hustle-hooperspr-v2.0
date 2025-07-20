import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function Services() {
  const services = [
    {
      title: "Práctica de Tiro",
      description: "Enfoque en driles para el desarrollo y mejoramientos de destrezas de tiro.",
      image: "/John-Wall-Jump-Shot.jpg",
    },
    {
      title: "Manejo de Balón",
      description: "Enfoque en driles para desarrollar o mejorar el manejo de balón.",
      image: "/basketball-dribble.webp",
    },
    {
      title: "Entrenamiento General",
      description:
        "Entrenamiento en varios aspectos del baloncesto, así como Manejo de Balón y Práctica de Tiros, entre otros.",
      image: "/how-to-shoot-a-basketball.jpg",
    },
  ]

  return (
    <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Servicios</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Colección de los diferentes servicios que ofrecemos y trabajamos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader className="pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 border-2 border-gray-800 group-hover:border-cyan-400 transition-colors">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl font-semibold text-white text-center">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
