import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const blogPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  date: z.string().min(1),
  summary: z.string().min(10),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  image: z.string().default(''),
  published: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(posts)
  } catch (error) {
    console.error('Error en GET /api/admin/blog:', error)
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
    const parsed = blogPostSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const slug = data.slug ?? data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return Response.json(
        { error: 'Ya existe un articulo con ese slug' },
        { status: 409 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: data.title,
        date: data.date,
        summary: data.summary,
        content: data.content,
        tags: data.tags,
        image: data.image,
        published: data.published,
      },
    })

    return Response.json(post)
  } catch (error) {
    console.error('Error en POST /api/admin/blog:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
