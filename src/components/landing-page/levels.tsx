import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Levels() {
  const levels = [
    {
      title: "Nivel Principiante",
      description:
        "Entrenamientos para principiantes consiste de driles para desarrollar y fortalecer destrezas fundamentales.",
      badge: "Básico",
      color: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    },
    {
      title: "Nivel Intermedio",
      description:
        "Entrenamientos para intermedios consisten de driles un poco más avanzados donde aplicarán destrezas fundamentales.",
      badge: "Intermedio",
      color: "bg-gradient-to-r from-magenta-500 to-magenta-600",
    },
    {
      title: "Nivel Avanzado",
      description:
        "Clientes que ya dominan los fundamentos, participarán en driles más complejos que requieren alto nivel de destrezas para aplicarlas en situaciones de juego.",
      badge: "Avanzado",
      color: "bg-gradient-to-r from-cyan-400 to-magenta-500",
    },
  ]

  return (
    <section id="niveles" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Niveles</h2>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map((level, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${level.color} text-white`}>{level.badge}</Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-white">{level.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 leading-relaxed">{level.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
