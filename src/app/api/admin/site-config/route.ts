import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const dayScheduleSchema = z.object({
  active: z.boolean(),
  open: z.string(),
  close: z.string(),
})

const businessHoursSchema = z.object({
  lunes: dayScheduleSchema,
  martes: dayScheduleSchema,
  miercoles: dayScheduleSchema,
  jueves: dayScheduleSchema,
  viernes: dayScheduleSchema,
  sabado: dayScheduleSchema,
  domingo: dayScheduleSchema,
})

const siteConfigSchema = z.object({
  siteName: z.string().optional().nullable(),
  siteDescription: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional().nullable(),
  openingHours: z.string().optional().nullable(),
  businessHours: businessHoursSchema.optional().nullable(),
  street: z.string().optional().nullable(),
  streetNumber: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const config = await prisma.siteConfig.findUnique({
      where: { id: 'default' },
    })

    if (!config) {
      const created = await prisma.siteConfig.create({
        data: { id: 'default' },
      })
      return NextResponse.json(created)
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error en GET /api/admin/site-config:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const parsed = siteConfigSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const config = await prisma.siteConfig.upsert({
      where: { id: 'default' },
      update: {
        siteName: data.siteName ?? undefined,
        siteDescription: data.siteDescription ?? undefined,
        logo: data.logo ?? undefined,
        favicon: data.favicon ?? undefined,
        ogImage: data.ogImage ?? undefined,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone ?? undefined,
        openingHours: data.openingHours ?? undefined,
        businessHours: data.businessHours ?? undefined,
        street: data.street ?? undefined,
        streetNumber: data.streetNumber ?? undefined,
        zone: data.zone ?? undefined,
        department: data.department ?? undefined,
        city: data.city ?? undefined,
        postalCode: data.postalCode ?? undefined,
        country: data.country ?? undefined,
        facebook: data.facebook ?? undefined,
        instagram: data.instagram ?? undefined,
        linkedin: data.linkedin ?? undefined,
        twitter: data.twitter ?? undefined,
      },
      create: {
        id: 'default',
        siteName: data.siteName ?? undefined,
        siteDescription: data.siteDescription ?? undefined,
        logo: data.logo ?? undefined,
        favicon: data.favicon ?? undefined,
        ogImage: data.ogImage ?? undefined,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone ?? undefined,
        openingHours: data.openingHours ?? undefined,
        businessHours: data.businessHours ?? undefined,
        street: data.street ?? undefined,
        streetNumber: data.streetNumber ?? undefined,
        zone: data.zone ?? undefined,
        department: data.department ?? undefined,
        city: data.city ?? undefined,
        postalCode: data.postalCode ?? undefined,
        country: data.country ?? 'Guatemala',
        facebook: data.facebook ?? undefined,
        instagram: data.instagram ?? undefined,
        linkedin: data.linkedin ?? undefined,
        twitter: data.twitter ?? undefined,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error en PUT /api/admin/site-config:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
