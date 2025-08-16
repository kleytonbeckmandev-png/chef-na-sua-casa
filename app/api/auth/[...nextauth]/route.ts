import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      try {
        if (user) {
          token.role = user.role
        }
        return token
      } catch (error) {
        console.error('Erro no callback JWT:', error)
        return token
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      try {
        if (token) {
          session.user.id = token.sub!
          session.user.role = token.role as string
        }
        return session
      } catch (error) {
        console.error('Erro no callback session:', error)
        return session
      }
    }
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
