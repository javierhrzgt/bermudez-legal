import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'El archivo excede el límite de 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${uniqueSuffix}.${fileExtension}`

    const uploadDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    const url = `/images/${fileName}`

    return NextResponse.json({ url, fileName })
  } catch (error) {
    console.error('Error en POST /api/admin/upload/local:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json({ error: 'Nombre de archivo requerido' }, { status: 400 })
    }

    const { unlink } = await import('fs/promises')
    const filePath = path.join(process.cwd(), 'public', 'images', fileName)
    
    try {
      await unlink(filePath)
      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error en DELETE /api/admin/upload/local:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
