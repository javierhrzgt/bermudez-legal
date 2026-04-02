import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

// Schema de validacion con Zod v4
// IMPORTANTE: z.email() es top-level en Zod v4, NO z.string().email()
const loginSchema = z.object({
  email: z.email({ message: 'Email invalido' }),
  password: z.string().min(6, { message: 'Minimo 6 caracteres' }),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // Adaptador de Prisma para persistir sesiones/usuarios (solo Node.js)
  adapter: PrismaAdapter(prisma),

  // Usar JWT aunque tengamos PrismaAdapter
  // Necesario para compatibilidad con Edge Runtime en el middleware
  session: { strategy: 'jwt' },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, password: true, role: true },
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as string
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})