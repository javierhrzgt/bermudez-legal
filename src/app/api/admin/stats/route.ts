import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const [
      totalMessages,
      newMessages,
      totalAppointments,
      pendingAppointments,
      totalPosts,
      publishedPosts,
    ] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'new' } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'pendiente' } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ])

    return Response.json({
      messages: { total: totalMessages, new: newMessages },
      appointments: { total: totalAppointments, pending: pendingAppointments },
      posts: { total: totalPosts, published: publishedPosts },
    })
  } catch (error) {
    console.error('Error en /api/admin/stats:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
