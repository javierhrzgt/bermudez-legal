import { type Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import {
  MessageSquare, CalendarDays, FileEdit,
  Clock, TrendingUp, CheckCircle2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const [
    totalMessages,
    newMessages,
    totalAppointments,
    pendingAppointments,
    totalPosts,
    publishedPosts,
  ] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'new' } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'pendiente' } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
  ])

  const cards = [
    {
      label: 'Mensajes Totales',
      value: totalMessages,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Mensajes Nuevos',
      value: newMessages,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: 'Citas Totales',
      value: totalAppointments,
      icon: CalendarDays,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100',
    },
    {
      label: 'Citas Pendientes',
      value: pendingAppointments,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
    },
    {
      label: 'Articulos Totales',
      value: totalPosts,
      icon: FileEdit,
      color: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
    },
    {
      label: 'Articulos Publicados',
      value: publishedPosts,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de la aplicacion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`bg-white rounded-xl p-6 border ${card.border} hover:shadow-md transition-shadow`}
            >
              <div className={`inline-flex p-3 rounded-lg ${card.color} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
