import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { getStore } from "@/app/api/_store"
import { verifyPassword } from "@/lib/auth-password"

const providers: Array<ReturnType<typeof Credentials> | ReturnType<typeof Google>> = [
  Credentials({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : ""
      const password = typeof credentials?.password === "string" ? credentials.password : ""

      if (!email || !password) return null

      const store = getStore()
      const account = store.accounts.get(email)
      if (!account?.passwordHash) return null

      const isValidPassword = verifyPassword(password, account.passwordHash)
      if (!isValidPassword) return null

      return {
        id: account.id,
        email: account.email,
        name: account.name || account.email,
        image: account.image,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      const email = user.email.toLowerCase()
      const store = getStore()

      if (account?.provider === "google" && !store.accounts.has(email)) {
        store.accounts.set(email, {
          id: user.id || crypto.randomUUID(),
          email,
          provider: "google",
          name: user.name || email,
          image: user.image || undefined,
          createdAt: new Date().toISOString(),
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      if (user?.email) token.email = user.email
      if (user?.name) token.name = user.name
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email || session.user.email
        session.user.name = token.name || session.user.name
      }
      return session
    },
  },
}
