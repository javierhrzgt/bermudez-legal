import Link from 'next/link'
import { Calendar, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Appointment {
  id: string
  clientName: string
  date: Date
  time: string
  service: string
  status: string
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
}

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'outline'; label: string }> = {
  pendiente: { variant: 'default', label: 'Pendiente' },
  confirmada: { variant: 'secondary', label: 'Confirmada' },
  completada: { variant: 'outline', label: 'Completada' },
  cancelada: { variant: 'outline', label: 'Cancelada' },
}

function formatDate(date: Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <Card className="h-full animate-in fade-in" style={{ animationDelay: '300ms' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-serif">Próximas Citas</CardTitle>
            <CardDescription>Citas programadas</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/citas?new=true">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/citas">Ver todas</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No hay citas programadas</p>
            <p className="text-xs mt-1">Las próximas citas aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => {
              const config = statusConfig[appointment.status] || { variant: 'secondary', label: appointment.status }
              return (
                <div
                  key={appointment.id}
                  className="flex items-start justify-between gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {appointment.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {appointment.service}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDate(appointment.date)} · {appointment.time}
                    </p>
                  </div>
                  <Badge variant={config.variant} className="flex-shrink-0">
                    {config.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
