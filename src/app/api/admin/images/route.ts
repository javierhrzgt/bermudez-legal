import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const folder = process.env.CLOUDINARY_FOLDER

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary no configurado' }, { status: 500 })
    }

    // Cloudinary Admin API uses Basic Auth (api_key:api_secret)
    const basicAuth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

    const params = new URLSearchParams({ max_results: '100', type: 'upload' })
    if (folder) params.set('prefix', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${params}`,
      { headers: { Authorization: `Basic ${basicAuth}` } }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Cloudinary list error:', res.status, errText)
      return NextResponse.json({ error: 'Error al obtener imágenes' }, { status: 500 })
    }

    const data = await res.json()
    const images = (data.resources ?? []).map((r: {
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
