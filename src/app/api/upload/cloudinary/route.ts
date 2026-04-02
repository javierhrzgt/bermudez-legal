import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar 10MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`
    const folder = process.env.CLOUDINARY_FOLDER ?? 'bermudez-legal/blog'

    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: 'image',
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
    })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
