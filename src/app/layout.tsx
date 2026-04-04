import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ChatBusMount } from "@/components/chat-bus"
import { UserProvider } from "@/lib/user-context"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "FinMate by State Farm - Your Financial Wellness Partner",
  description:
    "Like a good neighbor, FinMate is here. AI-powered financial guidance to help you make confident decisions about insurance, benefits, and emergency planning.",
  generator: "State Farm",
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
