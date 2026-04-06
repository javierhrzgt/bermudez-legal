'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { ImageUploader } from '@/components/shared/ImageUploader'
import { RichTextEditor } from '@/components/admin/rich-text-editor'

export default function NuevoBlogPage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    title: '', slug: '', summary: '', content: '', date: today, tags: '', image: '', published: false,
  })
  const [saving, setSaving] = useState(false)

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const setField = (k: string, v: string | boolean) => {
    setForm((p) => {
      const updated = { ...p, [k]: v }
      if (k === 'title' && typeof v === 'string') updated.slug = generateSlug(v)
      return updated
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        summary: form.summary,
        content: form.content,
        date: form.date,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        image: form.image,
        published: form.published,
      }),
    })
    if (res.ok) {
      router.push('/admin/blog')
    } else {
      setSaving(false)
      alert('Error al guardar el articulo')
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nuevo Articulo</h1>
          <p className="text-muted-foreground mt-1">Crear un nuevo articulo para el blog</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Titulo</label>
          <input
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="Titulo del articulo"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug (URL)</label>
            <input
              value={form.slug}
              onChange={(e) => setField('slug', e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Resumen</label>
          <textarea
            value={form.summary}
            onChange={(e) => setField('summary', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
            placeholder="Breve descripcion del articulo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Contenido</label>
          <RichTextEditor
            value={form.content}
            onChange={(value) => setField('content', value)}
            placeholder="Escribe el contenido del artículo..."
          />
        </div>

        <ImageUploader
          value={form.image}
          onChange={(url) => setField('image', url)}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Etiquetas (separadas por comas)</label>
          <input
            value={form.tags}
            onChange={(e) => setField('tags', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="Ej: Derecho Corporativo, Contratos"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setField('published', e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="published" className="text-sm text-foreground">Publicar inmediatamente</label>
        </div>
        <div className="flex gap-3 pt-4 border-t border-border">
          <Link
            href="/admin/blog"
            className="flex-1 text-center px-4 py-2.5 border border-input rounded-lg text-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.slug}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
