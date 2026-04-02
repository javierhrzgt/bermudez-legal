import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  token: z.string().min(1, { message: 'Token requerido' }),
  newPassword: z.string().min(6, { message: 'Minimo 6 caracteres' }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos invalidos' },
        { status: 400 }
      )
    }

    const { token, newPassword } = parsed.data

    // Buscar usuario con ese token Y que no haya expirado
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // expiry debe ser mayor a ahora
        },
      },
      select: { id: true },
    })

    if (!user) {
      return Response.json(
        { error: 'El enlace de recuperacion es invalido o ha expirado.' },
        { status: 400 }
      )
    }

    // Hashear la nueva password con bcryptjs (cost factor 12)
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Actualizar password y limpiar el token en una sola operacion
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[reset-password]', error)
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}