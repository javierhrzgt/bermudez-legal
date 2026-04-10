import Link from 'next/link'
import { LucideIcon, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardStatCardProps {
  title: string
  total: number
  highlight: number
  highlightLabel: string
  icon: LucideIcon
  href: string
  delay?: number
  createHref?: string
}

export function DashboardStatCard({
  title,
  total,
  highlight,
  highlightLabel,
  icon: Icon,
  href,
  delay = 0,
  createHref,
}: DashboardStatCardProps) {
  return (
    <div className="block">
      <Card className="h-full hover:shadow-lg transition-all duration-200 animate-in fade-in" style={{ animationDelay: `${delay}ms` }}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Link href={href} className="bg-accent-50 p-3 rounded-lg hover:bg-accent-100 transition-colors">
              <Icon className="h-5 w-5 text-accent-600" />
            </Link>
            {createHref && (
              <Link
                href={createHref}
                className="p-2 rounded-lg text-muted-foreground hover:text-accent-600 hover:bg-accent-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Link>
            )}
          </div>
          
          <Link href={href} className="block">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-4xl font-bold text-primary-900">{total}</p>
            
            <p className="text-sm text-muted-foreground mt-2">
              {highlight > 0 ? (
                <>
                  <span className="text-accent-600 font-medium">{highlight}</span>{' '}
                  {highlightLabel} de {total}
                </>
              ) : (
                <>0 {highlightLabel}</>
              )}
            </p>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
