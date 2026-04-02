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

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status: data.status },
    })

    return Response.json(message)
  } catch (error) {
    console.error('Error en PUT /api/admin/messages/[id]:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
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

    await prisma.contactMessage.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/messages/[id]:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
