# Bermudez Legal Consulting

Aplicación web full-stack para un bufete de consultoría legal en Guatemala.

---

## Acerca del Proyecto

Bermudez Legal Consulting es una plataforma web diseñada para una firma de abogados en Guatemala. El proyecto integra un sitio público de cara a los clientes con un sistema completo de administración interna, todo bajo una misma aplicación.

El **sitio público** presenta los servicios legales del bufete, un blog con artículos de valor para los clientes, y un formulario de contacto que notifica al equipo en tiempo real por correo electrónico. Está optimizado para motores de búsqueda y funciona correctamente en dispositivos móviles y de escritorio.

El **panel administrativo** permite al equipo del bufete gestionar mensajes entrantes, agendar y dar seguimiento a citas con clientes, publicar y editar artículos del blog con un editor de texto enriquecido, administrar los usuarios del sistema y personalizar por completo la información pública del sitio (datos de contacto, horarios, dirección, redes sociales) sin necesidad de modificar código.

---

## Funcionalidades Principales

### Sitio Público

- **Homepage** con sección hero, vista previa de los 3 servicios principales, los últimos 3 artículos del blog y llamado a la acción para contacto.
- **6 áreas de práctica legal**: Propiedad Intelectual, Contratos Empresariales, Asesoría Corporativa, Derecho Mercantil, Derecho Laboral, Litigio y Resolución de Conflictos.
- **Blog** con listado de artículos y filtrado interactivo por etiquetas (tags).
- **Detalle de artículo** con contenido enriquecido y botón para compartir en redes sociales.
- **Formulario de contacto** con validación en cliente y servidor, y notificación automática por email via Brevo.
- **Metadata dinámica** (SEO) cargada desde la base de datos: título, descripción, imagen Open Graph.

### Panel Administrativo

- **Dashboard** con saludo contextual, alertas de prioridad, tarjetas de estadísticas (mensajes, citas, artículos) y actividad reciente.
- **Gestión de mensajes** con visualización de detalle y actualización de estado (nuevo, leído, respondido).
- **Gestión de citas** con CRUD completo y seguimiento de estados (pendiente, confirmada, cancelada, completada).
- **Blog CRUD** con editor BlockNote, upload de imágenes a Cloudinary, gestión de etiquetas y toggle de publicación.
- **Gestión de usuarios** con creación, edición, eliminación y asignación de roles.
- **Configuración del sitio**: branding (nombre, logo, favicon, imagen OG), datos de contacto, horarios de atención, dirección en formato guatemalteco (zona, departamento, municipio) y enlaces a redes sociales.
- **Autenticación segura** con JWT, recuperación de contraseña por email y cambio de contraseña desde el panel.

---

## Capturas de Pantalla

**Homepage**
![Homepage](docs/screenshots/homepage.png)

**Servicios**
![Servicios](docs/screenshots/servicios.png)

**Blog**
![Blog](docs/screenshots/blog.png)

**Contacto**
![Contacto](docs/screenshots/contacto.png)

**Admin Dashboard**
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

**Editor de Blog**
![Editor de Blog](docs/screenshots/admin-blog-editor.png)

**Gestión de Citas**
![Gestión de Citas](docs/screenshots/admin-citas.png)

**Configuración del Sitio**
![Configuración del Sitio](docs/screenshots/admin-configuracion-sitio.png)

---

## Stack Tecnológico

| Categoría             | Tecnología               | Versión          |
| --------------------- | ------------------------ | ---------------- |
| Framework             | Next.js                  | 15.5.14          |
| Lenguaje              | TypeScript               | 5.x              |
| UI Library            | React                    | 19.2.5           |
| ORM                   | Prisma                   | 6.x              |
| Base de datos         | PostgreSQL               | 16 (Alpine)      |
| Autenticación         | NextAuth                 | 5.0.0-beta.30    |
| Estilos               | Tailwind CSS             | 4.x              |
| Componentes UI        | Radix UI + shadcn/ui     | 1.x / 4.x        |
| Iconos                | Lucide React             | 1.x              |
| Editor de texto       | BlockNote                | 0.47.x           |
| Formularios           | React Hook Form          | 7.72.x           |
| Validación            | Zod                      | 4.x              |
| Estado del servidor   | TanStack React Query     | 5.x              |
| Estado local          | Zustand                  | 5.x              |
| Imágenes CDN          | Cloudinary               | 2.x              |
| Email transaccional   | Brevo                    | 5.x              |
| Cifrado               | bcryptjs                 | 3.x              |
| Contenedor DB         | Docker + Docker Compose  | —                |
| Package manager       | pnpm                     | —                |

---

## Prerrequisitos

Antes de instalar el proyecto, asegurate de tener lo siguiente en tu sistema:

- **Node.js** 18 o superior
- **pnpm** — gestor de paquetes:
  ```bash
  npm install -g pnpm
  ```
- **Docker** y **Docker Compose** — para ejecutar PostgreSQL localmente
- **Red Docker `javinet`** — red externa requerida por `docker-compose.yml`:
  ```bash
  docker network create javinet
  ```
- **Cuenta Cloudinary** — para el almacenamiento y CDN de imágenes. Registro gratuito en [cloudinary.com](https://cloudinary.com)
- **Cuenta Brevo** — para el envío de emails transaccionales. Registro gratuito en [brevo.com](https://brevo.com)

---

## Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd bermudez_legal_consulting
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Crear la red Docker** (si no fue creada en los prerrequisitos):
   ```bash
   docker network create javinet
   ```

4. **Levantar la base de datos PostgreSQL con Docker:**
   ```bash
   pnpm db:up
   ```

5. **Crear el archivo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Luego editar `.env` con tus valores. Ver sección [Variables de Entorno](#variables-de-entorno).

6. **Generar el cliente de Prisma:**
   ```bash
   pnpm db:generate
   ```

7. **Ejecutar las migraciones de base de datos:**
   ```bash
   pnpm db:migrate
   ```

8. **Ejecutar el seed con datos iniciales:**
   ```bash
   pnpm db:seed
   ```
   Esto crea el usuario administrador inicial y la configuración base del sitio.

9. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

10. **Abrir la aplicación en el navegador:**
    - Sitio público: [http://localhost:3000](http://localhost:3000)
    - Panel admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Variables de Entorno

Copiar el archivo `.env.example` incluido en el repositorio y rellenarlo con tus valores:

```bash
cp .env.example .env
```

Variables disponibles:

| Variable               | Descripción                                                        | Requerida | Ejemplo                                  |
| ---------------------- | ------------------------------------------------------------------ | --------- | ---------------------------------------- |
| `DATABASE_URL`         | Cadena de conexión a PostgreSQL                                    | Sí        | `postgresql://postgres:postgres@localhost:5432/myapp_db` |
| `NEXTAUTH_URL`         | URL base de la aplicación                                          | Sí        | `http://localhost:3000`                  |
| `NEXTAUTH_SECRET`      | Clave secreta para firmar tokens JWT                               | Sí        | Generar con `openssl rand -base64 32`    |
| `CLOUDINARY_CLOUD_NAME`| Nombre del cloud en Cloudinary                                     | Sí        | `mi-cloud-name`                          |
| `CLOUDINARY_API_KEY`   | API Key de Cloudinary                                              | Sí        | `123456789012345`                        |
| `CLOUDINARY_API_SECRET`| API Secret de Cloudinary                                           | Sí        | `abc123xyz...`                           |
| `CLOUDINARY_FOLDER`    | Carpeta base para subir imágenes en Cloudinary                     | No        | `bermudez-legal`                         |
| `BREVO_API_KEY`        | API Key del servicio Brevo (email transaccional)                   | Sí        | `xkeysib-...`                            |
| `BREVO_SENDER_EMAIL`   | Email remitente para los correos enviados por Brevo                | Sí        | `noreply@example.com`                    |
| `BREVO_SENDER_NAME`    | Nombre que aparece como remitente en los emails                    | Sí        | `Bermudez Legal Consulting`              |
| `ADMIN_EMAIL`          | Email que recibe las notificaciones de contacto (si difiere del `SiteConfig`) | No | `admin@example.com`            |

**Ejemplo de `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

---

## Base de Datos

La base de datos corre en un contenedor Docker con PostgreSQL 16. La configuración se encuentra en `docker-compose.yml`.

**Contenedor:** `myapp_postgres`
**Puerto:** `5432:5432`
**Red Docker:** `javinet` (externa, debe existir antes de levantar el servicio)

### Comandos disponibles

| Comando          | Descripción                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `pnpm db:up`     | Levanta el contenedor de PostgreSQL en segundo plano             |
| `pnpm db:down`   | Detiene el contenedor de PostgreSQL                              |
| `pnpm db:reset`  | Destruye el volumen y vuelve a crear el contenedor (borra todos los datos) |
| `pnpm db:generate` | Genera el cliente Prisma a partir del schema                   |
| `pnpm db:push`   | Aplica cambios del schema directamente a la DB (sin migración)   |
| `pnpm db:migrate`| Crea y aplica una nueva migración                                |
| `pnpm db:studio` | Abre Prisma Studio en el navegador para explorar los datos       |
| `pnpm db:seed`   | Ejecuta el archivo `prisma/seed.ts` con datos iniciales          |

### Credenciales del seed

Tras ejecutar `pnpm db:seed`, el sistema tendrá disponible:

| Campo    | Valor                                  |
| -------- | -------------------------------------- |
| Email    | `admin@example.com`                    |
| Password | `admin123`                             |
| Rol      | `admin`                                |

> Cambiar la contraseña del administrador tras el primer inicio de sesión desde `/admin/cambiar-contrasena`.

---

## Comandos de Desarrollo

| Comando       | Descripción                                                       |
| ------------- | ----------------------------------------------------------------- |
| `pnpm dev`    | Inicia el servidor de desarrollo con hot reload en `localhost:3000` |
| `pnpm build`  | Genera el cliente Prisma y compila la aplicación para producción  |
| `pnpm start`  | Inicia el servidor de producción (requiere `pnpm build` previo)   |
| `pnpm lint`   | Ejecuta ESLint sobre el código fuente                             |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/                  # Rutas del sitio público
│   │   ├── page.tsx               # Homepage: hero, servicios, blog, CTA
│   │   ├── servicios/page.tsx     # Las 6 áreas de práctica legal
│   │   ├── blog/
│   │   │   ├── page.tsx           # Listado del blog con filtro por tags
│   │   │   ├── tag-filter.tsx     # Componente cliente de filtrado
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # Detalle del artículo
│   │   │       └── share-button.tsx  # Botón de compartir en redes
│   │   ├── contacto/page.tsx      # Formulario + mapa + info de contacto
│   │   └── layout.tsx             # Layout con header y footer públicos
│   │
│   ├── admin/
│   │   ├── login/page.tsx         # Inicio de sesión del panel admin
│   │   ├── forgot-password/page.tsx   # Solicitar recuperación de contraseña
│   │   ├── reset-password/page.tsx    # Establecer nueva contraseña
│   │   └── (dashboard)/           # Rutas protegidas del panel admin
│   │       ├── page.tsx           # Dashboard principal
│   │       ├── mensajes/page.tsx  # Gestión de mensajes de contacto
│   │       ├── citas/page.tsx     # Gestión de citas
│   │       ├── blog/
│   │       │   ├── page.tsx       # Listado de artículos
│   │       │   ├── nuevo/page.tsx # Crear artículo
│   │       │   └── [id]/page.tsx  # Editar artículo
│   │       ├── usuarios/page.tsx  # Gestión de usuarios
│   │       ├── configuracion/page.tsx       # Configuración personal
│   │       ├── configuracion-sitio/page.tsx # Configuración del sitio
│   │       ├── cambiar-contrasena/page.tsx  # Cambiar contraseña
│   │       └── layout.tsx         # Layout con barra lateral del admin
│   │
│   ├── api/
│   │   ├── auth/                  # Rutas de NextAuth y recuperación de contraseña
│   │   ├── contact/route.ts       # Formulario de contacto público
│   │   ├── config/route.ts        # Configuración pública del sitio
│   │   ├── guatemala/route.ts     # Datos geográficos de Guatemala
│   │   ├── signup/route.ts        # Registro de usuarios
│   │   ├── upload/cloudinary/route.ts  # Upload público a Cloudinary
│   │   └── admin/                 # Rutas protegidas del panel admin
│   │       ├── appointments/      # CRUD de citas
│   │       ├── blog/              # CRUD de artículos del blog
│   │       ├── messages/          # Gestión de mensajes
│   │       ├── users/             # Gestión de usuarios
│   │       ├── site-config/       # Configuración del sitio
│   │       ├── stats/             # Estadísticas del dashboard
│   │       ├── images/            # Listado de imágenes en Cloudinary
│   │       ├── change-password/   # Cambio de contraseña
│   │       └── upload/local/      # Upload de imágenes desde el admin
│   │
│   ├── globals.css                # Estilos globales con Tailwind CSS 4
│   └── layout.tsx                 # Layout raíz de la aplicación
│
├── components/
│   ├── admin/                     # Componentes exclusivos del panel admin
│   │   ├── business-hours-editor.tsx  # Editor de horarios por día
│   │   ├── dashboard-stat-card.tsx    # Tarjeta de estadística
│   │   ├── priority-alerts.tsx        # Alertas de mensajes/citas pendientes
│   │   ├── recent-messages.tsx        # Mensajes recientes en el dashboard
│   │   ├── rich-text-editor.tsx       # Editor BlockNote para el blog
│   │   └── upcoming-appointments.tsx  # Citas próximas en el dashboard
│   │
│   ├── shared/                    # Componentes compartidos entre secciones
│   │   ├── header.tsx             # Header del sitio público
│   │   ├── footer.tsx             # Footer del sitio público
│   │   ├── admin-sidebar.tsx      # Barra lateral del panel admin
│   │   ├── ArticleCard.tsx        # Tarjeta de artículo del blog
│   │   ├── contact-form.tsx       # Formulario de contacto público
│   │   ├── ImageUploader.tsx      # Uploader de imágenes (blog)
│   │   ├── SiteImageUploader.tsx  # Uploader de imágenes (configuración del sitio)
│   │   └── providers.tsx          # Proveedores globales (Query, Session, etc.)
│   │
│   └── ui/                        # Componentes base de shadcn/ui
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── table.tsx
│
├── lib/
│   ├── auth.ts                    # Configuración principal de NextAuth
│   ├── auth.config.ts             # Configuración edge-compatible de NextAuth
│   ├── brevo.ts                   # Cliente y funciones del servicio de email Brevo
│   ├── cloudinary.ts              # Cliente y funciones de Cloudinary
│   ├── prisma.ts                  # Singleton del cliente Prisma
│   └── utils.ts                   # Utilidades generales (cn, etc.)
│
├── data/
│   └── guatemala.json             # Departamentos y municipios de Guatemala
│
├── middleware.ts                  # Protección de rutas del panel admin
└── types/
    └── next-auth.d.ts             # Extensión de tipos de NextAuth (campo role)
```

---

## Despliegue

La forma recomendada de desplegar esta aplicación es **Vercel**, ya que ofrece integración nativa con Next.js.

**Consideraciones para producción:**

- La aplicación requiere una base de datos PostgreSQL externa (no incluida en el despliegue). Opciones recomendadas: [Neon](https://neon.tech), [Supabase](https://supabase.com) o [Railway](https://railway.app).
- Configurar todas las variables de entorno descritas en la sección correspondiente directamente en el panel de Vercel (Settings > Environment Variables).
- El script `pnpm build` ya incluye `prisma generate`, por lo que Vercel ejecutará la generación del cliente automáticamente durante el build.
- Actualizar `NEXTAUTH_URL` con la URL de producción del proyecto en Vercel.
- Ejecutar las migraciones de base de datos antes del primer despliegue o usar `pnpm db:push` si se prefiere no usar el sistema de migraciones.

---

## Licencia

MIT License — ver archivo `LICENSE`
