'use client'

import { useState, useEffect, useCallback } from 'react'
import { Settings, CheckCircle2, AlertCircle, ChevronDown, Mail, Phone, MapPin, Globe, Clock, Save } from 'lucide-react'
import { SiteImageUploader } from '@/components/shared/SiteImageUploader'
import { BusinessHoursEditor, defaultBusinessHours, generateSummary, type BusinessHours } from '@/components/admin/business-hours-editor'
import { Button } from '@/components/ui/button'

interface SiteConfig {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  ogImage: string
  contactEmail: string
  contactPhone: string
  openingHours: string
  businessHours: BusinessHours | null
  street: string
  streetNumber: string
  zone: string
  department: string
  city: string
  postalCode: string
  country: string
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
}

interface Department {
  codigo: string
  nombre: string
  municipios: { codigo: string; nombre: string }[]
}

const defaultConfig: SiteConfig = {
  siteName: 'Bermudez Legal Consulting',
  siteDescription: '',
  logo: '',
  favicon: '',
  ogImage: '',
  contactEmail: '',
  contactPhone: '',
  openingHours: '',
  businessHours: null,
  street: '',
  streetNumber: '',
  zone: '',
  department: '',
  city: '',
  postalCode: '',
  country: 'Guatemala',
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
}

const sectionFields: Record<string, (keyof SiteConfig)[]> = {
  informacion: ['siteName', 'siteDescription', 'logo', 'favicon', 'ogImage'],
  contacto: ['contactEmail', 'contactPhone', 'openingHours', 'businessHours'],
  direccion: ['street', 'streetNumber', 'zone', 'postalCode', 'department', 'city', 'country'],
  redes: ['facebook', 'instagram', 'linkedin', 'twitter'],
}

export default function ConfiguracionSitioPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [departments, setDepartments] = useState<Department[]>([])
  const [municipios, setMunicipios] = useState<{ codigo: string; nombre: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [openSection, setOpenSection] = useState<string>('informacion')
  const [changedSections, setChangedSections] = useState<Set<string>>(new Set())

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/site-config')
      if (res.ok) {
        const data = await res.json()
        setConfig({ ...defaultConfig, ...data })
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch('/api/guatemala')
      if (res.ok) {
        const data = await res.json()
        setDepartments(data)
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    fetchConfig()
    fetchDepartments()
  }, [fetchConfig, fetchDepartments])

  useEffect(() => {
    if (config.department) {
      const dept = departments.find(d => d.nombre === config.department)
      if (dept) {
        setMunicipios(dept.municipios)
      } else {
        setMunicipios([])
      }
    } else {
      setMunicipios([])
    }
  }, [config.department, departments])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      setMessage({ type: 'success', text: 'Configuración guardada exitosamente.' })
      setChangedSections(new Set())
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection = async (sectionId: string) => {
    const fields = sectionFields[sectionId]
    const sectionData: Record<string, unknown> = {}
    
    fields.forEach(field => {
      const value = config[field]
      if (value === null || value === '' || value === undefined) {
        sectionData[field] = undefined
      } else {
        sectionData[field] = value
      }
    })

    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar')
      }
      setChangedSections(prev => {
        const next = new Set(prev)
        next.delete(sectionId)
        return next
      })
      setMessage({ type: 'success', text: `${sections.find(s => s.id === sectionId)?.title} guardado correctamente.` })
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      setSaving(false)
    }
  }

  const setField = (sectionId: string, field: keyof SiteConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    if (field === 'department') {
      setConfig(prev => ({ ...prev, city: '' }))
    }
    setChangedSections(prev => new Set([...prev, sectionId]))
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section)
  }

  const sections = [
    {
      id: 'informacion',
      title: 'Información del Sitio',
      icon: Settings,
      fields: (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre del Sitio</label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => setField('informacion', 'siteName', e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descripción (Meta Description)</label>
            <textarea
              value={config.siteDescription || ''}
              onChange={(e) => setField('informacion', 'siteDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
              placeholder="Descripción breve para SEO"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SiteImageUploader
              label="Logo"
              value={config.logo}
              onChange={(url) => setField('informacion', 'logo', url)}
            />
            <SiteImageUploader
              label="Favicon"
              value={config.favicon}
              onChange={(url) => setField('informacion', 'favicon', url)}
            />
            <SiteImageUploader
              label="Imagen Open Graph"
              value={config.ogImage}
              onChange={(url) => setField('informacion', 'ogImage', url)}
            />
          </div>
        </>
      ),
    },
    {
      id: 'contacto',
      title: 'Contacto',
      icon: Mail,
      fields: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email de Contacto</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => setField('contacto', 'contactEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={config.contactPhone}
                  onChange={(e) => setField('contacto', 'contactPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="+502 1234 5678"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Horario de Atención</label>
            <BusinessHoursEditor
              value={config.businessHours || defaultBusinessHours}
              onChange={(hours) => {
                setConfig((prev) => ({
                  ...prev,
                  businessHours: hours,
                  openingHours: generateSummary(hours),
                }))
                setChangedSections(prev => new Set([...prev, 'contacto']))
              }}
            />
          </div>
        </>
      ),
    },
    {
      id: 'direccion',
      title: 'Dirección',
      icon: MapPin,
      fields: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Calle/Avenida</label>
              <input
                type="text"
                value={config.street || ''}
                onChange={(e) => setField('direccion', 'street', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Av. La Reforma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Número</label>
              <input
                type="text"
                value={config.streetNumber || ''}
                onChange={(e) => setField('direccion', 'streetNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="123"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Zona/Colonia</label>
              <input
                type="text"
                value={config.zone || ''}
                onChange={(e) => setField('direccion', 'zone', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Zona 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Código Postal</label>
              <input
                type="text"
                value={config.postalCode || ''}
                onChange={(e) => setField('direccion', 'postalCode', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="01010"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Departamento</label>
              <select
                value={config.department || ''}
                onChange={(e) => setField('direccion', 'department', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="">Seleccionar</option>
                {departments.map(dept => (
                  <option key={dept.codigo} value={dept.nombre}>{dept.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Municipio</label>
              <select
                value={config.city || ''}
                onChange={(e) => setField('direccion', 'city', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                disabled={!config.department}
              >
                <option value="">Seleccionar</option>
                {municipios.map(mun => (
                  <option key={mun.codigo} value={mun.nombre}>{mun.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">País</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={config.country}
                  onChange={(e) => setField('direccion', 'country', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'redes',
      title: 'Redes Sociales',
      icon: Globe,
      fields: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Facebook</label>
              <input
                type="url"
                value={config.facebook || ''}
                onChange={(e) => setField('redes', 'facebook', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="https://facebook.com/tupagina"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Instagram</label>
              <input
                type="url"
                value={config.instagram || ''}
                onChange={(e) => setField('redes', 'instagram', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="https://instagram.com/tucuenta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">LinkedIn</label>
              <input
                type="url"
                value={config.linkedin || ''}
                onChange={(e) => setField('redes', 'linkedin', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="https://linkedin.com/company/tuempresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Twitter/X</label>
              <input
                type="url"
                value={config.twitter || ''}
                onChange={(e) => setField('redes', 'twitter', e.target.value)}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="https://twitter.com/tucuenta"
              />
            </div>
          </div>
        </>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración del Sitio</h1>
          <p className="text-muted-foreground text-sm">Administre la información pública de su sitio</p>
        </div>
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

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-4">
          {sections.map(section => {
            const Icon = section.icon
            const isOpen = openSection === section.id
            return (
              <div key={section.id} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{section.title}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 space-y-4 border-t border-border">
                    {section.fields}
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        onClick={() => handleSaveSection(section.id)}
                        disabled={saving || !changedSections.has(section.id)}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      )}
    </div>
  )
}
