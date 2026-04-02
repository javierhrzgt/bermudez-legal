import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Validar con Zod
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos invalidos. Verifica todos los campos.' },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = parsed.data

    // 2. Guardar en base de datos
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        subject,
        message,
        status: 'new',
      },
    })

    // 3. Construir HTML del email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">
            Nuevo Mensaje de Contacto
          </h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong>
              <a href="mailto:${email}" style="color: #0066e6;">${email}</a>
            </p>
            ${phone ? `<p style="margin: 8px 0;"><strong>Telefono:</strong> ${phone}</p>` : ''}
            <p style="margin: 8px 0;"><strong>Asunto:</strong> ${subject}</p>
          </div>
          <h3 style="color: #1a1a2e; margin-top: 20px;">Mensaje:</h3>
          <div style="background: white; padding: 16px; border-left: 4px solid #1a1a2e; margin-top: 8px;">
            <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #6b7280; font-size: 12px; margin: 4px 0;">
            Recibido el: ${new Date().toLocaleString('es', { timeZone: 'America/Mexico_City' })}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 4px 0;">
            ID del mensaje: ${contactMessage.id}
          </p>
        </div>
      </div>
    `

    // 4. Enviar email al admin via Brevo
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `Nuevo mensaje de contacto: ${subject}`,
          html: htmlBody,
        })
      } catch (emailError) {
        // El mensaje ya fue guardado en DB — el email es secundario
        console.error('Error al enviar email de notificacion:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en /api/contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}