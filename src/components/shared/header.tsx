'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window?.scrollY > 20);
    };
    window?.addEventListener?.('scroll', handleScroll);
    return () => window?.removeEventListener?.('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {siteConfig.logo ? (
              <Image
                src={siteConfig.logo}
                alt={siteConfig.siteName}
                width={40}
                height={40}
                className="rounded-lg object-contain"
              />
            ) : (
              <div className="bg-primary-800 p-2.5 rounded-lg group-hover:bg-primary-700 transition-colors">
                {siteConfig.logoFallbackIcon && (
                  <siteConfig.logoFallbackIcon className="h-6 w-6 text-white" />
                )}
              </div>
            )}
            <div>
              <h1 className="text-xl font-serif font-bold text-primary-900">
                {siteConfig.siteNameLine1}
              </h1>
              {siteConfig.siteNameLine2 && (
                <p className="text-xs text-gray-600">{siteConfig.siteNameLine2}</p>
              )}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks?.map?.((link) => (
              <Link
                key={link?.href}
                href={link?.href ?? '/'}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  pathname === link?.href
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-800'
                }`}
              >
                {link?.label ?? 'Link'}
              </Link>
            )) ?? null}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-4 flex flex-col gap-1">
            {navLinks?.map?.((link) => (
              <Link
                key={link?.href}
                href={link?.href ?? '/'}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  pathname === link?.href
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-800'
                }`}
              >
                {link?.label ?? 'Link'}
              </Link>
            )) ?? null}
          </nav>
        )}
      </div>
    </header>
  );
}