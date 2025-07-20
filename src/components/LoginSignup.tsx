"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"

export default function LoginSignup() {
  return (
    <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Join HustleHoopers</CardTitle>
        <CardDescription className="text-gray-300">Accede a tu cuenta o crea una nueva</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Login Section */}
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">¿Tienes cuenta?</p>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-3 text-base font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="mr-3"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            ACCEDE CON GOOGLE
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-gray-400">O</span>
          </div>
        </div>

        {/* Signup Section */}
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">¿No tienes cuenta?</p>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-gradient-to-r from-magenta-500 to-magenta-600 hover:from-magenta-600 hover:to-magenta-700 text-white py-3 text-base font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="mr-3"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            REGÍSTRESE CON GOOGLE
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
