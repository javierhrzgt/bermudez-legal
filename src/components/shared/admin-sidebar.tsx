'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, CalendarDays, FileEdit, MessageSquare,
  Settings, LogOut, ExternalLink, Menu, X, Users,
} from 'lucide-react'

const allNavItems = [
  { href: '/admin',               label: 'Dashboard',     icon: LayoutDashboard, roles: ['admin', 'editor'] },
  { href: '/admin/citas',         label: 'Citas',         icon: CalendarDays,    roles: ['admin', 'editor'] },
  { href: '/admin/blog',          label: 'Blog',          icon: FileEdit,        roles: ['admin', 'editor'] },
  { href: '/admin/mensajes',      label: 'Mensajes',      icon: MessageSquare,   roles: ['admin', 'editor'] },
  { href: '/admin/usuarios',      label: 'Usuarios',      icon: Users,           roles: ['admin']           },
  { href: '/admin/configuracion', label: 'Configuracion', icon: Settings,        roles: ['admin', 'editor'] },
]

export default function AdminSidebar({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = allNavItems.filter(item => item.roles.includes(userRole))

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href)
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight text-white">Bermudez Legal</h2>
            <p className="text-primary-foreground/60 text-xs">Panel Admin</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5 text-primary-foreground/80" />
          </button>
        </div>
      </div>

      {/* Navegacion */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-primary-foreground/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg
                     text-primary-foreground/80 hover:bg-white/10 hover:text-white
                     transition-all text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Ver Sitio Web</span>
        </Link>

        <div className="flex items-center gap-3 px-4 py-2 text-primary-foreground/60 text-sm">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center
                          text-xs font-bold flex-shrink-0 text-white">
            {userName?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <span className="truncate block text-white">{userName}</span>
            <span className="text-xs text-primary-foreground/50 capitalize">{userRole}</span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg
                     text-primary-foreground/80 hover:bg-red-500/20 hover:text-red-300
                     transition-all text-sm w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Barra superior mobile */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-primary flex items-center px-4 z-50 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
        <span className="font-bold text-white ml-3">Mi App</span>
      </div>

      {/* Overlay oscuro mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-primary text-white flex flex-col z-50
                    transition-transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
