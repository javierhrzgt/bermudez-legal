import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const appointmentSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.email(),
  clientPhone: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  service: z.string().min(1),
  notes: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'desc' },
    })

    return Response.json(appointments)
  } catch (error) {
    console.error('Error en GET /api/admin/appointments:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = appointmentSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const appointment = await prisma.appointment.create({
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone ?? null,
        date: new Date(data.date),
        time: data.time,
        service: data.service,
        notes: data.notes ?? null,
        status: 'pendiente',
      },
    })

    return Response.json(appointment)
  } catch (error) {
    console.error('Error en POST /api/admin/appointments:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
