import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const { role } = await request.json()

    if (!role || !['admin', 'editor'].includes(role)) {
      return Response.json({ error: 'Rol invalido' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return Response.json(user)
  } catch (error) {
    console.error('Error en PUT /api/admin/users/[id]:', error)
    return Response.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    // No puede borrar su propia cuenta
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })
    if (currentUser?.id === id) {
      return Response.json({ error: 'No puede eliminar su propia cuenta' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/users/[id]:', error)
    return Response.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}
