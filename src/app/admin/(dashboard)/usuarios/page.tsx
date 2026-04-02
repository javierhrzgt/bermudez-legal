'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users, Plus, Trash2, Shield, X, CheckCircle2, AlertCircle } from 'lucide-react'

interface UserItem {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export default function UsuariosPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'editor' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const userRole = (session?.user as { role?: string })?.role

  useEffect(() => {
    if (session && userRole !== 'admin') {
      router.replace('/admin')
    }
  }, [session, userRole, router])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Error al crear usuario' })
      } else {
        setMessage({ type: 'success', text: 'Usuario creado exitosamente' })
        setFormData({ name: '', email: '', password: '', role: 'editor' })
        setShowForm(false)
        fetchUsers()
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexion' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`¿Eliminar al usuario ${email}?`)) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUsers()
        setMessage({ type: 'success', text: 'Usuario eliminado' })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Error al eliminar' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexion' })
    }
  }

  const toggleRole = async (user: UserItem) => {
    const newRole = user.role === 'admin' ? 'editor' : 'admin'
    const currentUserId = (session?.user as { id?: string })?.id
    if (user.id === currentUserId) {
      setMessage({ type: 'error', text: 'No puede cambiar su propio rol' })
      return
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) fetchUsers()
    } catch {
      // silent
    }
  }

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">No tiene permisos para acceder a esta seccion.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground text-sm">Gestion de usuarios del sistema</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMessage(null) }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {message && (
        <div className={`rounded-lg p-4 flex items-start gap-3 mb-6 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success'
            ? <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          }
          <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Contrasena *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Minimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="editor">Editor (limitado)</option>
                  <option value="admin">Administrador (completo)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Los editores no pueden crear usuarios ni eliminar publicaciones.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground">Cargando...</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Usuario</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Rol</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Creado</th>
                  <th className="text-right px-6 py-4 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const currentUserId = (session?.user as { id?: string })?.id
                  return (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">{user.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Editor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {new Date(user.createdAt).toLocaleDateString('es-GT')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.id !== currentUserId && (
                          <>
                            <button
                              onClick={() => toggleRole(user)}
                              className="p-2 text-muted-foreground hover:text-purple-600 transition-colors"
                              title={`Cambiar a ${user.role === 'admin' ? 'Editor' : 'Administrador'}`}
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, user.email)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
