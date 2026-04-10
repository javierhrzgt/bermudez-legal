'use client'

import { useEffect, useState, useCallback } from 'react'
import { Trash2, Mail, MailOpen, MessageSquare, Eye } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
}

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  read: 'Leido',
  replied: 'Respondido',
}

export default function MensajesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  const fetchAll = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((data) => { setMessages(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    if (selected?.id === id) setSelected(null)
    fetchAll()
  }

  const openMessage = (msg: Message) => {
    setSelected(msg)
    if (msg.status === 'new') updateStatus(msg.id, 'read')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Mensajes</h1>
        <p className="text-muted-foreground mt-1">Mensajes recibidos del formulario de contacto</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Lista de mensajes */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground">Cargando...</div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No hay mensajes</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border divide-y divide-border/50 overflow-hidden max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors ${selected?.id === msg.id ? 'bg-primary-800/5' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {msg.status === 'new'
                        ? <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        : <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      }
                      <p className={`text-sm truncate ${msg.status === 'new' ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                        {msg.name}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${statusColors[msg.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {statusLabels[msg.status] || msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {msg.subject || msg.message.slice(0, 60)}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString('es-GT')}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Panel de detalle */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-primary-900">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selected.email}{selected.phone ? ` · ${selected.phone}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selected.status}
                    onChange={(e) => {
                      updateStatus(selected.id, e.target.value)
                      setSelected({ ...selected, status: e.target.value })
                    }}
                    className="text-xs border border-input rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-700"
                  >
                    <option value="new">Nuevo</option>
                    <option value="read">Leido</option>
                    <option value="replied">Respondido</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {selected.subject && (
                <p className="text-sm font-medium text-foreground mb-3">{selected.subject}</p>
              )}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Recibido: {new Date(selected.createdAt).toLocaleString('es-GT')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <Eye className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Selecciona un mensaje para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
