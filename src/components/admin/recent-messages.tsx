import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  name: string
  subject: string | null
  status: string
  createdAt: Date
}

interface RecentMessagesProps {
  messages: Message[]
}

const statusConfig: Record<string, { variant: 'default' | 'secondary'; label: string }> = {
  new: { variant: 'default', label: 'Nuevo' },
  read: { variant: 'secondary', label: 'Leído' },
  replied: { variant: 'secondary', label: 'Respondido' },
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card className="h-full animate-in fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-serif">Mensajes Recientes</CardTitle>
            <CardDescription>Últimos mensajes recibidos</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/mensajes">Ver todos</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Mail className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No hay mensajes aún</p>
            <p className="text-xs mt-1">Los mensajes del sitio aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const config = statusConfig[message.status] || { variant: 'secondary', label: message.status }
              return (
                <div
                  key={message.id}
                  className="flex items-start justify-between gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {message.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {message.subject || message.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDate(message.createdAt)}
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
