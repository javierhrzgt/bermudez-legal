'use client'

import { useState } from 'react'
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CambiarContrasenaPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contrasena debe tener al menos 6 caracteres.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contrasenas nuevas no coinciden.' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Error al cambiar la contrasena.' })
      } else {
        setMessage({ type: 'success', text: 'Contrasena actualizada exitosamente.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexion. Intente de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary-100 p-3 rounded-xl">
          <Lock className="h-6 w-6 text-primary-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cambiar Contrasena</h1>
          <p className="text-muted-foreground text-sm">Actualice su contrasena de acceso</p>
        </div>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
                Contrasena Actual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all"
                placeholder="Ingrese su contrasena actual"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                Nueva Contrasena
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all"
                placeholder="Minimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirmar Nueva Contrasena
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all"
                placeholder="Repita la nueva contrasena"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualizando...' : 'Actualizar Contrasena'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
