import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-slate-400 text-center">© 2024 HustleHoopersPR. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Términos de Servicio
            </Link>
            <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
