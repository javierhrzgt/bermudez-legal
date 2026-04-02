'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2, X, CalendarDays, Clock, User, Phone, FileText } from 'lucide-react'

interface Appointment {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  date: string
  time: string
  service: string
  status: string
  notes: string | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700',
  confirmada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  completada: 'bg-blue-100 text-blue-700',
}

const emptyForm = {
  clientName: '', clientEmail: '', clientPhone: '', date: '', time: '', service: '', status: 'pendiente', notes: '',
}

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchAll = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/appointments')
      .then((r) => r.json())
      .then((data) => { setAppointments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openNew = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (a: Appointment) => {
    setEditId(a.id)
    setForm({
      clientName: a.clientName,
      clientEmail: a.clientEmail,
      clientPhone: a.clientPhone ?? '',
      date: a.date.split('T')[0],
      time: a.time,
      service: a.service,
      status: a.status,
      notes: a.notes ?? '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/admin/appointments/${editId}` : '/api/admin/appointments'
    const method = editId ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setModalOpen(false)
    fetchAll()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return
    await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const setField = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Citas</h1>
          <p className="text-muted-foreground mt-1">Gestion de citas con clientes</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Nueva Cita
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground">Cargando...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay citas registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Fecha</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Hora</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Servicio</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Estado</th>
                  <th className="text-right px-6 py-4 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{a.clientName}</p>
                      <p className="text-muted-foreground text-xs">{a.clientEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {new Date(a.date).toLocaleDateString('es-GT')}
                    </td>
                    <td className="px-6 py-4 text-foreground">{a.time}</td>
                    <td className="px-6 py-4 text-foreground">{a.service}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(a)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{editId ? 'Editar Cita' : 'Nueva Cita'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre del Cliente</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={form.clientName}
                    onChange={(e) => setField('clientName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Nombre completo"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => setField('clientEmail', e.target.value)}
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Telefono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={form.clientPhone}
                      onChange={(e) => setField('clientPhone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Fecha</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setField('date', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Hora</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setField('time', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Servicio</label>
                <select
                  value={form.service}
                  onChange={(e) => setField('service', e.target.value)}
                  className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="">Seleccionar servicio</option>
                  <option value="Consultoria Corporativa">Consultoria Corporativa</option>
                  <option value="Derecho Inmobiliario">Derecho Inmobiliario</option>
                  <option value="Propiedad Intelectual">Propiedad Intelectual</option>
                  <option value="Litigios Comerciales">Litigios Comerciales</option>
                  <option value="Derecho Laboral">Derecho Laboral</option>
                  <option value="Consulta General">Consulta General</option>
                </select>
              </div>
              {editId && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                  <select
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value)}
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notas</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-input rounded-lg text-foreground hover:bg-muted transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.clientName || !form.date || !form.time || !form.service}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
