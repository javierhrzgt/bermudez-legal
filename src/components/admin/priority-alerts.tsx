import Link from 'next/link'
import { Mail, Calendar } from 'lucide-react'

interface PriorityAlertsProps {
  newMessages: number
  pendingAppointments: number
}

export function PriorityAlerts({ newMessages, pendingAppointments }: PriorityAlertsProps) {
  const hasAlerts = newMessages > 0 || pendingAppointments > 0

  if (!hasAlerts) {
    return null
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in fade-in">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {newMessages > 0 && (
          <Link
            href="/admin/mensajes"
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="font-medium">{newMessages}</span>
            <span>{newMessages === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}</span>
          </Link>
        )}

        {newMessages > 0 && pendingAppointments > 0 && (
          <span className="text-amber-300">·</span>
        )}

        {pendingAppointments > 0 && (
          <Link
            href="/admin/citas"
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{pendingAppointments}</span>
            <span>{pendingAppointments === 1 ? 'cita pendiente' : 'citas pendientes'}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
