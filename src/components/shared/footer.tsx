'use client';

import Link from "next/link";
import { Scale, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const siteNameParts = siteConfig.siteName.split(' ');

  const address = [
    siteConfig.contact.address.street,
    siteConfig.contact.address.streetNumber,
    siteConfig.contact.address.zone,
  ].filter(Boolean).join(', ');

  const location = [
    siteConfig.contact.address.city,
    siteConfig.contact.address.department,
    siteConfig.contact.address.country,
  ].filter(Boolean).join(', ');

  return (
    <footer className="bg-linear-to-b from-gray-50 to-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-800 p-2 rounded-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-primary-900">
                  {siteNameParts[0]} {siteNameParts[1]}
                </h3>
                <p className="text-xs text-gray-600">{siteNameParts.slice(2).join(' ')}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {siteConfig.footer.description}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-primary-900 mb-4">Contacto</h4>
            <div className="space-y-3">
              {siteConfig.contact.email && (
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-primary-800 transition-colors group"
                >
                  <Mail className="shrink-0 h-4 w-4 text-primary-700 group-hover:text-primary-800" />
                  <span className="text-sm min-w-0 break-all">{siteConfig.contact.email}</span>
                </a>
              )}
              {siteConfig.contact.phone && (
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-primary-800 transition-colors group"
                >
                  <Phone className="h-4 w-4 text-primary-700 group-hover:text-primary-800" />
                  <span className="text-sm">{siteConfig.contact.phone}</span>
                </a>
              )}
              {location && (
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-primary-700 mt-0.5" />
                  <div className="text-sm">
                    {address && <p>{address}</p>}
                    <p>{location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-primary-900 mb-4">Enlaces Rápidos</h4>
            <nav className="space-y-2">
              <Link
                href="/servicios"
                className="block text-sm text-gray-600 hover:text-primary-800 transition-colors"
              >
                Servicios
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-gray-600 hover:text-primary-800 transition-colors"
              >
                Blog Legal
              </Link>
              <Link
                href="/contacto"
                className="block text-sm text-gray-600 hover:text-primary-800 transition-colors"
              >
                Agendar Cita
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} {siteConfig.siteName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}