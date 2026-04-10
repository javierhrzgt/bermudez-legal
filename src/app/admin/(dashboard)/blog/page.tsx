'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Plus, Edit2, Trash2, Eye, EyeOff, FileEdit } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  tags: string[]
  createdAt: string
}

export default function BlogAdminPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const userRole = (session?.user as { role?: string })?.role ?? 'editor'

  const fetchAll = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    })
    fetchAll()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este articulo?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-1">Gestion de articulos del blog</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center gap-2 bg-primary-800 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Nuevo Articulo
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground">Cargando...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <FileEdit className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay articulos publicados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Titulo</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Etiquetas</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground">Fecha</th>
                  <th className="text-right px-6 py-4 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground text-xs">{post.tags?.join(', ') || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(post.createdAt).toLocaleDateString('es-GT')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => togglePublish(post)}
                        className="p-2 text-muted-foreground hover:text-primary-700 transition-colors"
                        title={post.published ? 'Ocultar' : 'Publicar'}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-2 text-muted-foreground hover:text-primary-700 transition-colors inline-block"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      {userRole === 'admin' && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
