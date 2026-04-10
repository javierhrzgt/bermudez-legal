import { type Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { MessageSquare, CalendarDays, FileEdit } from 'lucide-react'
import { DashboardStatCard } from '@/components/admin/dashboard-stat-card'
import { PriorityAlerts } from '@/components/admin/priority-alerts'
import { RecentMessages } from '@/components/admin/recent-messages'
import { UpcomingAppointments } from '@/components/admin/upcoming-appointments'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard',
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function formatFullDate(): string {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Admin'

  const [
    totalMessages,
    newMessages,
    totalAppointments,
    pendingAppointments,
    totalPosts,
    publishedPosts,
    recentMessages,
    upcomingAppointments,
  ] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'new' } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'pendiente' } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, subject: true, status: true, createdAt: true },
    }),
    prisma.appointment.findMany({
      where: { date: { gte: new Date() } },
      take: 5,
      orderBy: { date: 'asc' },
      select: { id: true, clientName: true, date: true, time: true, service: true, status: true },
    }),
  ])

  return (
    <div>
      {/* Header con saludo contextual */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-900">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">{formatFullDate()}</p>
      </div>

      {/* Alertas de prioridad */}
      <div className="mb-6">
        <PriorityAlerts newMessages={newMessages} pendingAppointments={pendingAppointments} />
      </div>

      {/* Stat Cards - 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DashboardStatCard
          title="Mensajes"
          total={totalMessages}
          highlight={newMessages}
          highlightLabel="nuevos"
          icon={MessageSquare}
          href="/admin/mensajes"
          delay={0}
        />
        <DashboardStatCard
          title="Citas"
          total={totalAppointments}
          highlight={pendingAppointments}
          highlightLabel="pendientes"
          icon={CalendarDays}
          href="/admin/citas"
          delay={100}
        />
        <DashboardStatCard
          title="Artículos"
          total={totalPosts}
          highlight={publishedPosts}
          highlightLabel="publicados"
          icon={FileEdit}
          href="/admin/blog"
          createHref="/admin/blog/nuevo"
          delay={200}
        />
      </div>

      {/* Actividad reciente - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <RecentMessages messages={recentMessages} />
        <UpcomingAppointments appointments={upcomingAppointments} />
      </div>
    </div>
  )
}
