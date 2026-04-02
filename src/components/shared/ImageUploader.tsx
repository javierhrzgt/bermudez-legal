'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon, Loader2, Grid3X3 } from 'lucide-react'
import Image from 'next/image'

interface CloudinaryImage {
  url: string
  public_id: string
  created_at: string
  width: number
  height: number
  format: string
  bytes: number
}

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<CloudinaryImage[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchGallery = useCallback(async () => {
    setLoadingGallery(true)
    try {
      const res = await fetch('/api/admin/images')
      const data = await res.json()
      if (res.ok && data.images) {
        setGalleryImages(data.images)
      }
    } catch {
      // silent
    } finally {
      setLoadingGallery(false)
    }
  }, [])

  const openGallery = () => {
    setShowGallery(true)
    fetchGallery()
  }

  const selectFromGallery = (url: string) => {
    onChange(url)
    setShowGallery(false)
  }

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar 10MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir imagen')
      if (!data.url) throw new Error('No se obtuvo URL de la imagen')

      onChange(data.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }, [uploadFile])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Imagen</label>

      {/* Modal de galería */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-border shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Galería de imágenes</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {loadingGallery ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground text-sm">Cargando imágenes...</span>
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No hay imágenes cargadas aún</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img) => (
                    <button
                      key={img.public_id}
                      type="button"
                      onClick={() => selectFromGallery(img.url)}
                      className={`group relative rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                        value === img.url
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border'
                      }`}
                    >
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={img.url}
                          alt={img.public_id.split('/').pop() || 'Imagen'}
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-2 bg-white text-xs text-muted-foreground flex justify-between">
                        <span className="truncate">{img.public_id.split('/').pop()}</span>
                        <span className="flex-shrink-0 ml-1">{formatSize(img.bytes)}</span>
                      </div>
                      {value === img.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                            Seleccionada
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
          <div className="relative aspect-video">
            <Image
              src={value}
              alt="Imagen del artículo"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => { onChange(''); setError('') }}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="px-3 py-2 text-xs text-muted-foreground bg-white border-t border-border flex items-center justify-between">
            <span className="truncate">{value.length > 50 ? '...' + value.slice(-47) : value}</span>
            <button
              type="button"
              onClick={openGallery}
              className="text-primary hover:text-primary/80 font-medium flex-shrink-0 ml-2"
            >
              Cambiar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-muted rounded-full">
                  {dragActive ? (
                    <Upload className="h-8 w-8 text-primary" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {dragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — máx. 10MB</p>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={openGallery}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Grid3X3 className="h-4 w-4" />
            Seleccionar de galería
          </button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
