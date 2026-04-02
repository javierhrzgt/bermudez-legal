import Image from 'next/image';
import Link from 'next/link';
import { Scale, Shield, FileText, Users, ArrowRight, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const services = [
    {
      icon: Shield,
      title: 'Propiedad Intelectual',
      description: 'Registro y protección de marcas, patentes y derechos de autor en Guatemala.',
    },
    {
      icon: FileText,
      title: 'Contratos Empresariales',
      description: 'Redacción y revisión de contratos comerciales, laborales y de servicios.',
    },
    {
      icon: Users,
      title: 'Asesoría Legal Corporativa',
      description: 'Acompañamiento legal integral para empresas y emprendedores.',
    },
  ];

  let latestPosts: BlogPost[] = [];
  try {
    latestPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch {
    latestPosts = [];
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-gray-50 to-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-primary-900 leading-tight">
                Consultoría Legal de <span className="text-primary-700">Confianza</span> en Guatemala
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Protegemos sus intereses legales con experiencia, profesionalismo y dedicación. Especialistas en propiedad intelectual y derecho empresarial.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-primary-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>Agendar Consulta</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 bg-white text-primary-800 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all border-2 border-primary-800"
                >
                  <span>Nuestros Servicios</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/dlnn5kezq/image/upload/v1775102690/oficina_lf3v0g.webp"
                  alt="Oficina de Bermudez Legal Consulting"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Scale className="h-4 w-4" />
              <span>Áreas de Práctica</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Servicios Especializados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Brindamos asesoría legal integral adaptada a las necesidades de su negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services?.map?.((service: typeof services[number], index: number) => {
              const Icon = service?.icon;
              return (
                <div
                  key={index}
                  className="bg-linear-to-b from-gray-50 to-white p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
                >
                  <div className="bg-primary-800 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-700 transition-colors">
                    {Icon && <Icon className="h-7 w-7 text-white" />}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-primary-900 mb-3">
                    {service?.title ?? 'Servicio'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service?.description ?? ''}
                  </p>
                </div>
              );
            }) ?? null}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-primary-800 font-medium hover:gap-3 transition-all"
            >
              <span>Ver todos los servicios</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              <span>Conocimiento Legal</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Últimos Artículos del Blog
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Información práctica sobre propiedad intelectual y temas legales en Guatemala
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts?.map?.((post: BlogPost) => (
              <Link
                key={post?.slug}
                href={`/blog/${post?.slug ?? ''}`}
                className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
              >
                <div className="aspect-3/2 relative bg-gray-100">
                  {post?.image ? (
                    <Image
                      src={post.image}
                      alt={post?.title ?? 'Artículo'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-primary-700 mb-3">
                    <span>{post?.date ?? ''}</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {post?.title ?? 'Título'}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {post?.summary ?? ''}
                  </p>
                </div>
              </Link>
            )) ?? null}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-800 font-medium hover:gap-3 transition-all"
            >
              <span>Ver todos los artículos</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            ¿Necesita Asesoría Legal?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Contáctenos para una consulta inicial. Estamos listos para ayudarle a proteger sus intereses y hacer crecer su negocio.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Agendar Consulta Ahora</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
