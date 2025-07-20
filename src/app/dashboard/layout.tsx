import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import SideNav from "../../components/sideNav"
import "../../styles/globals.css"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { SessionProvider } from "@/app/context/SessionContext"
import type { User } from "@/app/lib/definitions"

export const metadata: Metadata = {
  title: "HustleHoopersPR",
  description: "Dashboard",
}

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-white text-lg">You are not signed in</p>
        </div>
      </div>
    )
  }

  const user: User = {
    name: session.user?.name || "",
    email: session.user?.email || "",
    image: session.user?.image || "",
  }

  return (
    <SessionProvider user={user}>
      <div className="min-h-screen bg-gray-950">
        <SideNav />
        <div className="p-6 md:p-12">{children}</div>
      </div>
    </SessionProvider>
  )
}
