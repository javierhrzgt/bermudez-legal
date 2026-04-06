import { NextResponse } from 'next/server'
import guatemalaData from '@/data/guatemala.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const departments = guatemalaData.map((dept) => ({
      codigo: dept.codigo,
      nombre: dept.nombre,
      municipios: dept.municipios.map((mun) => ({
        codigo: mun.codigo,
        nombre: mun.nombre,
      })),
    }))

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error en GET /api/guatemala:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
