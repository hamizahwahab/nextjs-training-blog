import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import { verifyPassword } from "@/lib/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const client = await clientPromise
        const db = client.db("blog_db")
        const user = await db.collection("users").findOne({ 
          username: credentials.username as string
        })

        if (!user) {
          return null
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email || undefined,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
