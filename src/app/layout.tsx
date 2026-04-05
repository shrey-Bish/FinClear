import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/providers/auth-provider"
import { UserProvider } from "@/lib/user-context"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "SowSmart | Insurance Made Simple for Gen Z",
  description:
    "Skip the phone calls. Get State Farm coverage in 2 minutes. SowSmart makes insurance as easy as ordering food. Plant good financial habits early.",
  generator: "SowSmart",
  keywords: ["insurance", "gen z", "state farm", "renters insurance", "auto insurance", "financial wellness"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
