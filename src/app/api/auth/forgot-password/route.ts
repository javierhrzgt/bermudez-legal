import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/brevo'

const schema = z.object({
  email: z.email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      // Retornar success igual: no revelar que el formato es invalido
      return Response.json({ success: true })
    }

    const { email } = parsed.data

    // Buscar usuario (si no existe, igual retornamos success)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (user) {
      // Generar token seguro de 32 bytes = 64 caracteres hex
      const resetToken = crypto.randomBytes(32).toString('hex')

      // Expiry: 1 hora desde ahora
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

      // Guardar token en la DB
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      })

      // Construir link de reset
      const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`

      // Enviar email con Brevo
      await sendEmail({
        to: user.email,
        toName: user.name ?? undefined,
        subject: 'Recupera tu contrasena',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Recuperar contrasena</h2>
            <p>Hola${user.name ? ` ${user.name}` : ''},</p>
            <p>Recibimos una solicitud para restablecer la contrasena de tu cuenta.</p>
            <p>Haz clic en el siguiente boton para crear una nueva contrasena:</p>
            <p style="text-align: center; margin: 32px 0;">
              <a
                href="${resetUrl}"
                style="
                  background-color: #0070f3;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                  display: inline-block;
                "
              >
                Restablecer contrasena
              </a>
            </p>
            <p>Este enlace expira en <strong>1 hora</strong>.</p>
            <p>Si no solicitaste esto, puedes ignorar este email.</p>
            <hr style="margin: 24px 0;" />
            <p style="color: #666; font-size: 12px;">
              Si el boton no funciona, copia y pega este enlace en tu navegador:<br/>
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
          </div>
        `,
      })
    }

    // SIEMPRE retornar success, exista o no el usuario
    return Response.json({ success: true })
  } catch (error) {
    console.error('[forgot-password]', error)
    // No exponer detalles del error al cliente
    return Response.json({ success: true })
  }
}