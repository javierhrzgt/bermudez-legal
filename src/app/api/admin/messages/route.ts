import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(messages)
  } catch (error) {
    console.error('Error en GET /api/admin/messages:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
