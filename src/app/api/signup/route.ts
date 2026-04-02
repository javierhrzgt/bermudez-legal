import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'editor']).default('editor'),
})

export async function POST(request: Request) {
  try {
    // Solo admins pueden crear usuarios
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return Response.json(
        { error: 'No autorizado. Solo administradores pueden crear usuarios.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Ya existe un usuario con ese email' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name: name ?? null, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true },
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/signup:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
