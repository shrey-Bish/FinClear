import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ChatBusMount } from "@/components/chat-bus"
import { UserProvider } from "@/lib/user-context"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "SowSmart - Plant Good Financial Habits Early",
  description:
    "🌱 SowSmart helps you grow your financial future. AI-powered guidance on insurance, savings, and emergency planning tailored to your life and goals.",
  generator: "SowSmart",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <ChatBusMount />
        <UserProvider>
          {children}
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
