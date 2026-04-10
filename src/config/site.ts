import { Shield, FileText, Users, Briefcase, BookOpen, Scale } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ServiceItem {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export const siteConfig = {
  siteName: 'Bermudez Legal Consulting',
  siteDescription: 'Consultoría legal especializada en Guatemala. Protegemos sus intereses y acompañamos su crecimiento empresarial.',
  logo: '/logo.svg',
  favicon: '/favicon.svg',
  ogImage: '/og-image.png',

  hero: {
    title: 'Consultoría Legal de Confianza en Guatemala',
    subtitle: 'Protegemos sus intereses legales con experiencia, profesionalismo y dedicación. Especialistas en propiedad intelectual y derecho empresarial.',
    image: 'https://res.cloudinary.com/dlnn5kezq/image/upload/v1775102690/oficina_lf3v0g.webp',
    imageAlt: 'Oficina de Bermudez Legal Consulting',
    ctaPrimary: { label: 'Agendar Consulta', href: '/contacto' },
    ctaSecondary: { label: 'Nuestros Servicios', href: '/servicios' },
  },

  services: [
    {
      icon: Shield,
      title: 'Propiedad Intelectual',
      description: 'Protegemos sus activos intangibles más valiosos. Asesoramos en registro y defensa de marcas, patentes, derechos de autor y secretos comerciales.',
      features: ['Registro de marcas y patentes', 'Defensa contra infracciones', 'Licenciamiento y transferencia', 'Auditorías de PI'],
    },
    {
      icon: FileText,
      title: 'Contratos Empresariales',
      description: 'Redactamos y revisamos contratos que protegen sus intereses comerciales, minimizando riesgos y asegurando el cumplimiento legal.',
      features: ['Contratos de servicios profesionales', 'Contratos de compraventa mercantil', 'Acuerdos de confidencialidad (NDA)', 'Contratos laborales'],
    },
    {
      icon: Users,
      title: 'Asesoría Legal Corporativa',
      description: 'Acompañamiento legal integral para el día a día de su empresa, desde la constitución hasta la toma de decisiones estratégicas.',
      features: ['Constitución de sociedades', 'Gobierno corporativo', 'Cumplimiento regulatorio', 'Due diligence legal'],
    },
    {
      icon: Briefcase,
      title: 'Derecho Mercantil',
      description: 'Asesoría especializada en todas las áreas del derecho comercial guatemalteco para el correcto funcionamiento de su negocio.',
      features: ['Fusiones y adquisiciones', 'Resolución de disputas comerciales', 'Derecho bancario y financiero', 'Comercio internacional'],
    },
    {
      icon: BookOpen,
      title: 'Derecho Laboral',
      description: 'Orientamos a empleadores y empleados en el cumplimiento de la normativa laboral, previniendo conflictos y protegiendo derechos.',
      features: ['Elaboración de reglamentos internos', 'Negociación colectiva', 'Terminación de contratos laborales', 'Asesoría en prestaciones'],
    },
    {
      icon: Scale,
      title: 'Litigio y Resolución de Conflictos',
      description: 'Representación legal efectiva en procesos judiciales y mecanismos alternativos de resolución de controversias.',
      features: ['Mediación y arbitraje', 'Procesos civiles y mercantiles', 'Recursos administrativos', 'Negociación de acuerdos'],
    },
  ] satisfies ServiceItem[],

  serviciosPage: {
    title: 'Soluciones Legales Integrales',
    subtitle: 'Ofrecemos un portafolio completo de servicios legales diseñados para proteger y potenciar su negocio en Guatemala.',
    cta: { label: 'Solicitar Consulta', href: '/contacto' },
    ctaBottom: {
      title: '¿Listo para Proteger su Negocio?',
      subtitle: 'Contáctenos hoy para una consulta personalizada y descubra cómo podemos ayudarle.',
      cta: { label: 'Agendar Consulta', href: '/contacto' },
    },
  },

  cta: {
    title: '¿Necesita Asesoría Legal?',
    subtitle: 'Contáctenos para una consulta inicial. Estamos listos para ayudarle a proteger sus intereses y hacer crecer su negocio.',
    cta: { label: 'Agendar Consulta Ahora', href: '/contacto' },
  },

  contact: {
    email: 'bermudezlegalconsulting@gmail.com',
    phone: '+502 3056 6897',
    openingHours: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
    address: {
      street: '',
      streetNumber: '',
      zone: '',
      city: 'Ciudad de Guatemala',
      department: 'Guatemala',
      country: 'Guatemala',
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61876.51244988539!2d-90.55503245!3d14.6349149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a180655c3345%3A0x4a72c7815b1e7b10!2sCiudad%20de%20Guatemala!5e0!3m2!1ses!2sgt!4v1710000000000!5m2!1ses!2sgt',
  },

  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  },

  footer: {
    description: 'Consultoría legal especializada en Guatemala. Protegemos sus intereses y acompañamos su crecimiento empresarial.',
  },
} as const