import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone ?? null,
        date: new Date(data.date),
        time: data.time,
        service: data.service,
        notes: data.notes ?? null,
        status: data.status,
      },
    })

    return Response.json(appointment)
  } catch (error) {
    console.error('Error en PUT /api/admin/appointments/[id]:', error)
    return Response.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    await prisma.appointment.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/appointments/[id]:', error)
    return Response.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
