import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/shared/contact-form";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="py-20 bg-linear-to-b from-primary-900 to-primary-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-serif font-bold text-white mb-6">
            Contáctenos
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarle. Agende una consulta o envíenos un mensaje.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
                  Información de Contacto
                </h2>
                <div className="space-y-6">
                  <a
                    href="mailto:bermudezlegalconsulting@gmail.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <Mail className="h-5 w-5 text-primary-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900">Email</h4>
                      <p className="text-gray-600 text-sm">bermudezlegalconsulting@gmail.com</p>
                    </div>
                  </a>

                  <a href="tel:+50230566897" className="flex items-start gap-4 group">
                    <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <Phone className="h-5 w-5 text-primary-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900">Teléfono</h4>
                      <p className="text-gray-600 text-sm">+502 3056 6897</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900">Dirección</h4>
                      <p className="text-gray-600 text-sm">Ciudad de Guatemala, Guatemala</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-primary-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900">Horario</h4>
                      <p className="text-gray-600 text-sm">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61876.51244988539!2d-90.55503245!3d14.6349149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a180655c3345%3A0x4a72c7815b1e7b10!2sCiudad%20de%20Guatemala!5e0!3m2!1ses!2sgt!4v1710000000000!5m2!1ses!2sgt"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Bermudez Legal Consulting"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                  Envíenos un Mensaje
                </h2>
                <p className="text-gray-600 mb-8">
                  Complete el formulario y nos pondremos en contacto con usted a la brevedad.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
