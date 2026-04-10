import Image from "next/image";
import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="py-20 bg-linear-to-b from-primary-900 to-primary-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Scale className="h-4 w-4" />
                <span>Nuestros Servicios</span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-white mb-6">
                {siteConfig.serviciosPage.title}
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed mb-8">
                {siteConfig.serviciosPage.subtitle}
              </p>
              <Link
                href={siteConfig.serviciosPage.cta.href}
                className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-lg"
              >
                <span>{siteConfig.serviciosPage.cta.label}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-4/3 relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={siteConfig.hero.image}
                  alt="Servicios legales de Bermudez Legal Consulting"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
                >
                  <div className="bg-primary-800 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-700 transition-colors">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-700 mt-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            {siteConfig.serviciosPage.ctaBottom.title}
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            {siteConfig.serviciosPage.ctaBottom.subtitle}
          </p>
          <Link
            href={siteConfig.serviciosPage.ctaBottom.cta.href}
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-lg"
          >
            <span>{siteConfig.serviciosPage.ctaBottom.cta.label}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}