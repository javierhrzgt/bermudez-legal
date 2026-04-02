import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const folder = process.env.CLOUDINARY_FOLDER

    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      prefix: folder || undefined,
    })

    const images = (result.resources ?? []).map((r: {
      secure_url: string
      public_id: string
      created_at: string
      width: number
      height: number
      format: string
      bytes: number
    }) => ({
      url: r.secure_url,
      public_id: r.public_id,
      created_at: r.created_at,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error en GET /api/admin/images:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
