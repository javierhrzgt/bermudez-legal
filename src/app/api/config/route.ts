import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'default' },
    })

    if (!config) {
      return NextResponse.json({
        siteName: 'Bermudez Legal Consulting',
        country: 'Guatemala',
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error en GET /api/config:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
