'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { ImageUploader } from '@/components/shared/ImageUploader'
import { RichTextEditor } from '@/components/admin/rich-text-editor'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [form, setForm] = useState({
    title: '', slug: '', summary: '', content: '', date: '', tags: '', image: '', published: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          summary: data.summary ?? '',
          content: data.content ?? '',
          date: data.date ?? '',
          image: data.image ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          published: data.published ?? false,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const setField = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PUT',
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

  if (loading) return <div className="text-muted-foreground p-8">Cargando...</div>

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Editar Articulo</h1>
          <p className="text-muted-foreground mt-1">Modificar articulo existente</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-1">Titulo</label>
          <input
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">Slug (URL)</label>
            <input
              value={form.slug}
              onChange={(e) => setField('slug', e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-1">Resumen</label>
          <textarea
            value={form.summary}
            onChange={(e) => setField('summary', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-1">Contenido</label>
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
          <label className="block text-sm font-medium text-primary-900 mb-1">Etiquetas (separadas por comas)</label>
          <input
            value={form.tags}
            onChange={(e) => setField('tags', e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm"
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
          <label htmlFor="published" className="text-sm text-primary-900">Publicado</label>
        </div>
        <div className="flex gap-3 pt-4 border-t border-border">
          <Link
            href="/admin/blog"
            className="flex-1 text-center px-4 py-2.5 border border-input rounded-lg text-primary-900 hover:bg-muted transition-colors text-sm font-medium"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.slug}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-800 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
