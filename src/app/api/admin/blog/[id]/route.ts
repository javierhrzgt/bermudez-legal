import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      return Response.json({ error: 'Articulo no encontrado' }, { status: 404 })
    }

    return Response.json(post)
  } catch (error) {
    console.error('Error en GET /api/admin/blog/[id]:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

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

    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined)     updateData.title = data.title
    if (data.slug !== undefined)      updateData.slug = data.slug
    if (data.date !== undefined)      updateData.date = data.date
    if (data.summary !== undefined)   updateData.summary = data.summary
    if (data.content !== undefined)   updateData.content = data.content
    if (data.tags !== undefined)      updateData.tags = data.tags
    if (data.image !== undefined)     updateData.image = data.image
    if (data.published !== undefined) updateData.published = data.published

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })

    return Response.json(post)
  } catch (error) {
    console.error('Error en PUT /api/admin/blog/[id]:', error)
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

    await prisma.blogPost.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/blog/[id]:', error)
    return Response.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
