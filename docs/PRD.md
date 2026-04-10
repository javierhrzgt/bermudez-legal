# Documento de Requisitos del Producto (PRD)
# Bermudez Legal Consulting

---

## 1. Información del Documento

| Campo               | Valor                         |
| ------------------- | ----------------------------- |
| Nombre del Proyecto | Bermudez Legal Consulting     |
| Versión             | 1.0                           |
| Fecha               | 2026-04-10                    |
| Estado              | En desarrollo                 |
| Autor               | Abraham Hernandez             |

---

## 2. Visión del Producto

Bermudez Legal Consulting es una aplicación web full-stack diseñada para una firma de consultoría legal con sede en Guatemala. La aplicación combina un sitio público informacional con un back-office de administración completo, permitiendo que el bufete proyecte presencia digital profesional y gestione de manera eficiente su operación interna desde un único sistema integrado.

El sitio público presenta los servicios legales de la firma, publica contenido de valor a través de un blog, y facilita el contacto directo entre clientes potenciales y el equipo legal. El panel de administración otorga al personal autorizado control total sobre los mensajes entrantes, las citas agendadas, el contenido del blog, los usuarios del sistema y la configuración general del sitio, sin depender de terceros para actualizaciones de contenido.

Se trata de un proyecto personal con potencial de implementación real en el sector legal guatemalteco. El stack tecnológico fue seleccionado para garantizar rendimiento, escalabilidad moderada y facilidad de mantenimiento por un equipo pequeño o un desarrollador individual.

---

## 3. Objetivos

1. **Establecer presencia digital profesional** para el bufete, con un sitio público que comunique los servicios ofrecidos, genere confianza en clientes potenciales y sea indexable por motores de búsqueda.

2. **Centralizar la gestión de contactos y citas** mediante un panel administrativo que permita dar seguimiento a mensajes y agendar citas sin depender de herramientas externas desconectadas.

3. **Habilitar la publicación autónoma de contenido** legal a través de un editor de texto enriquecido (BlockNote) que no requiera conocimientos técnicos para agregar o actualizar artículos del blog.

4. **Garantizar la seguridad del acceso administrativo** implementando autenticación con JWT, middleware de protección de rutas, hashing de contraseñas con bcrypt y flujo completo de recuperación de contraseña.

5. **Permitir la personalización del sitio sin código** mediante un módulo de configuración del sitio que controla nombre, logo, información de contacto, horarios de atención, dirección y redes sociales directamente desde la base de datos.

6. **Proveer una base técnica sólida y tipada** utilizando TypeScript, Prisma y Zod para reducir errores en tiempo de desarrollo y facilitar la incorporación de nuevas funcionalidades en fases posteriores.

---

## 4. Personas Objetivo

### 4.1 Visitante / Cliente Potencial

**Descripción:** Persona natural o representante de empresa en Guatemala que busca asesoría legal. Puede o no conocer el bufete previamente. Accede al sitio desde dispositivos móviles o de escritorio.

**Motivaciones:**
- Conocer los servicios legales disponibles antes de tomar contacto.
- Evaluar la credibilidad y experiencia del bufete a través de contenido publicado.
- Contactar al equipo de manera rápida sin barreras.

**Casos de uso:**
- Navegar la página de inicio y leer la descripción de servicios.
- Leer artículos del blog para entender temas legales relevantes.
- Enviar un mensaje de contacto o solicitar una cita.

---

### 4.2 Administrador del Bufete

**Descripción:** Abogado o asistente administrativo con acceso completo al panel de administración. Gestiona la operación diaria del sistema. Tiene el campo `role` con valor `"admin"` en el modelo `User`.

**Motivaciones:**
- Responder consultas de clientes de manera oportuna.
- Mantener el calendario de citas organizado.
- Actualizar la información pública del sitio sin intervención técnica.

**Casos de uso:**
- Revisar y actualizar el estado de mensajes de contacto entrantes.
- Crear, confirmar o cancelar citas con clientes.
- Publicar artículos en el blog y gestionar la imagen del sitio.
- Modificar horarios de atención, dirección y datos de contacto públicos.

---

### 4.3 Editor / Colaborador

**Descripción:** Persona con acceso al panel administrativo pero con un rol diferenciado. Utiliza el campo `role` del modelo `User` para distinguir niveles de acceso futuros. En el estado actual del sistema, todos los usuarios con acceso al admin comparten las mismas capacidades.

**Motivaciones:**
- Crear y editar contenido del blog de manera independiente.
- Consultar estadísticas e información operativa del bufete.

**Casos de uso:**
- Redactar y publicar artículos del blog usando el editor BlockNote.
- Subir imágenes para los artículos a través del servicio Cloudinary.
- Consultar el dashboard para tener contexto de la actividad reciente.

---

## 5. Historias de Usuario

### Visitante / Cliente Potencial

1. Como visitante, quiero ver una página de inicio clara con los servicios principales del bufete, para evaluar rápidamente si pueden atender mi necesidad legal.
2. Como visitante, quiero leer una descripción detallada de cada área de práctica legal, para entender el alcance de los servicios antes de contactar.
3. Como visitante, quiero leer artículos del blog filtrados por tema, para encontrar contenido legal relevante a mi situación específica.
4. Como visitante, quiero compartir un artículo del blog en redes sociales, para difundir información legal de valor en mi red de contactos.
5. Como visitante, quiero enviar un mensaje de contacto desde el sitio, para recibir respuesta del bufete sin necesidad de llamar por teléfono.
6. Como visitante, quiero ver la dirección, teléfono y horarios de atención del bufete, para saber cómo y cuándo visitarlos en persona.

### Administrador del Bufete

7. Como administrador, quiero iniciar sesión de manera segura en el panel de administración, para acceder a las funciones de gestión sin exponer datos sensibles.
8. Como administrador, quiero ver un dashboard con estadísticas de mensajes, citas y artículos, para tener una visión rápida del estado operativo del bufete.
9. Como administrador, quiero recibir alertas de prioridad en el dashboard cuando hay mensajes nuevos o citas pendientes, para no perder comunicaciones importantes.
10. Como administrador, quiero actualizar el estado de los mensajes de contacto (nuevo, leído, respondido), para llevar un registro del seguimiento de cada consulta.
11. Como administrador, quiero crear, editar y cancelar citas con clientes, para mantener la agenda del bufete organizada y actualizada.
12. Como administrador, quiero modificar la configuración del sitio (nombre, logo, contacto, horarios, dirección, redes sociales), para mantener la información pública actualizada sin tocar código.

### Editor / Colaborador

13. Como editor, quiero crear artículos de blog con un editor de texto enriquecido que soporte imágenes y formato, para publicar contenido legal de calidad de manera sencilla.
14. Como editor, quiero controlar si un artículo está publicado o en borrador, para preparar contenido con anticipación sin publicarlo prematuramente.
15. Como editor, quiero restablecer mi contraseña a través de un enlace enviado por correo electrónico, para recuperar el acceso al panel si olvido mis credenciales.

---

## 6. Requisitos Funcionales

### 6.1 Sitio Público

**RF-001 — Página de Inicio (Homepage)**
La página principal (`/`) debe mostrar: sección hero con texto de presentación del bufete, vista previa de los 3 principales servicios con enlace a la página completa, los últimos 3 artículos del blog publicados, y un llamado a la acción (CTA) para contactar al bufete. El contenido dinámico (blog posts) se obtiene desde la base de datos en tiempo de renderizado (RSC).

**RF-002 — Página de Servicios**
La página `/servicios` debe mostrar las 6 áreas de práctica legal que ofrece el bufete:
1. Propiedad Intelectual
2. Contratos Empresariales
3. Asesoría Corporativa
4. Derecho Mercantil
5. Derecho Laboral
6. Litigio y Resolución de Conflictos

Cada servicio debe presentarse con nombre, descripción y elementos visuales diferenciadores.

**RF-003 — Listado del Blog**
La página `/blog` debe mostrar todos los artículos publicados (`published: true`) con funcionalidad de filtrado por etiquetas (tags). Las etiquetas disponibles deben derivarse dinámicamente de los artículos existentes en la base de datos. El componente de filtro (`src/app/(public)/blog/tag-filter.tsx`) opera en el cliente.

**RF-004 — Detalle de Artículo del Blog**
La página `/blog/[slug]` debe mostrar el contenido completo del artículo renderizado desde formato BlockNote/JSON a HTML. Debe incluir un botón para compartir el artículo en redes sociales (`src/app/(public)/blog/[slug]/share-button.tsx`). La ruta se genera de manera dinámica basada en el campo `slug` único del modelo `BlogPost`.

**RF-005 — Página de Contacto**
La página `/contacto` debe incluir: un formulario de contacto con campos para nombre, email, teléfono (opcional), asunto y mensaje; información de contacto lateral con email, teléfono, dirección completa y horarios cargados desde `SiteConfig`; y un mapa de Google Maps embebido. El formulario se valida en el cliente con React Hook Form + Zod antes de enviarse a `POST /api/contact`.

**RF-006 — Notificación por Correo Electrónico**
Al recibir un mensaje de contacto válido a través del formulario público, el sistema debe enviar una notificación al correo configurado en `SiteConfig.contactEmail` usando el servicio Brevo (`src/lib/brevo.ts`). El mensaje debe confirmar la recepción al remitente.

---

### 6.2 Panel de Administración

**RF-007 — Autenticación y Protección de Rutas**
El panel de administración (`/admin`) debe estar protegido mediante NextAuth 5 con estrategia JWT edge-compatible. El middleware (`src/middleware.ts`) debe redirigir a `/admin/login` cualquier solicitud no autenticada a rutas bajo `/admin`. Las rutas de API administrativas bajo `/api/admin/*` deben validar la sesión activa antes de procesar cualquier operación.

**RF-008 — Recuperación de Contraseña**
El flujo de recuperación debe incluir: página `/admin/forgot-password` donde el usuario ingresa su email, generación de un token único almacenado en `User.resetToken` con expiración en `User.resetTokenExpiry`, envío de enlace por email via Brevo, y página `/admin/reset-password` donde el usuario establece una nueva contraseña. El token se invalida tras su uso.

**RF-009 — Dashboard Administrativo**
La página `/admin` (dashboard) debe mostrar: saludo contextual según la hora del día, alertas de prioridad para mensajes nuevos y citas pendientes (componente `src/components/admin/priority-alerts.tsx`), tarjetas de estadísticas con totales de mensajes, citas y artículos (componente `src/components/admin/dashboard-stat-card.tsx`), mensajes recientes (componente `src/components/admin/recent-messages.tsx`), y citas próximas (componente `src/components/admin/upcoming-appointments.tsx`).

**RF-010 — Gestión de Mensajes**
La página `/admin/mensajes` debe permitir: listar todos los mensajes de contacto ordenados por fecha, visualizar el detalle completo de cada mensaje, y actualizar el estado del mensaje entre los valores disponibles. La gestión se realiza a través de las rutas `/api/admin/messages` y `/api/admin/messages/[id]`.

**RF-011 — Gestión de Citas**
La página `/admin/citas` debe soportar operaciones CRUD completas sobre el modelo `Appointment`: crear nuevas citas con datos del cliente (nombre, email, teléfono), fecha, hora, servicio asociado y notas; editar citas existentes; actualizar el estado (pendiente, confirmada, cancelada, completada); y eliminar citas. La gestión se realiza a través de `/api/admin/appointments` y `/api/admin/appointments/[id]`.

**RF-012 — Gestión del Blog**
Las páginas bajo `/admin/blog` deben soportar CRUD completo del modelo `BlogPost`:
- Listado con toggle de publicación rápida.
- Creación de nuevo artículo en `/admin/blog/nuevo` con editor BlockNote (`src/components/admin/rich-text-editor.tsx`), upload de imagen de portada a Cloudinary, gestión de etiquetas, y control de estado publicado/borrador.
- Edición de artículo existente en `/admin/blog/[id]`.
- Eliminación de artículos.

La gestión se realiza a través de `/api/admin/blog` y `/api/admin/blog/[id]`.

**RF-013 — Gestión de Usuarios**
La página `/admin/usuarios` debe permitir listar, crear, editar y eliminar usuarios del sistema. Cada usuario tiene nombre, email, contraseña (hasheada con bcrypt) y rol. La gestión se realiza a través de `/api/admin/users` y `/api/admin/users/[id]`. La creación de usuarios adicionales también está disponible públicamente via `POST /api/signup`.

**RF-014 — Configuración del Sitio**
La página `/admin/configuracion-sitio` debe permitir editar todos los campos del modelo `SiteConfig`: información de branding (nombre, descripción, logo, favicon, imagen OG), datos de contacto (email, teléfono), horarios de atención (campo texto libre y estructura JSON de `businessHours`), dirección en formato guatemalteco (calle, número, zona, departamento, municipio, código postal, país), y enlaces a redes sociales (Facebook, Instagram, LinkedIn, Twitter/X). La gestión se realiza a través de `/api/admin/site-config`.

**RF-015 — Cambio de Contraseña**
La página `/admin/cambiar-contrasena` debe permitir al usuario autenticado cambiar su contraseña actual proporcionando la contraseña actual para verificación y la nueva contraseña dos veces para confirmación. La operación se realiza a través de `POST /api/admin/change-password`.

---

### 6.3 API — Tabla de Rutas

| Ruta                              | Métodos           | Protección | Descripción                                                  |
| --------------------------------- | ----------------- | ---------- | ------------------------------------------------------------ |
| `/api/contact`                    | POST              | Pública    | Recibe mensajes del formulario de contacto, los guarda en DB y envía notificación por email via Brevo |
| `/api/config`                     | GET               | Pública    | Retorna la configuración pública del sitio desde `SiteConfig` |
| `/api/guatemala`                  | GET               | Pública    | Retorna datos geográficos de Guatemala (departamentos, municipios) desde `src/data/guatemala.json` |
| `/api/signup`                     | POST              | Pública    | Crea un nuevo usuario en el sistema con contraseña hasheada  |
| `/api/upload/cloudinary`          | POST              | Pública    | Sube una imagen a Cloudinary y retorna la URL pública        |
| `/api/auth/[...nextauth]`         | GET, POST         | Pública    | Handler de NextAuth: gestiona login, logout y sesión JWT     |
| `/api/auth/forgot-password`       | POST              | Pública    | Genera token de recuperación y envía email con enlace        |
| `/api/auth/reset-password`        | POST              | Pública    | Valida token y actualiza contraseña del usuario              |
| `/api/admin/appointments`         | GET, POST         | Admin      | Lista todas las citas / Crea una nueva cita                  |
| `/api/admin/appointments/[id]`    | GET, PUT, DELETE  | Admin      | Obtiene / actualiza / elimina una cita por ID                |
| `/api/admin/blog`                 | GET, POST         | Admin      | Lista artículos del blog / Crea un nuevo artículo            |
| `/api/admin/blog/[id]`            | GET, PUT, DELETE  | Admin      | Obtiene / actualiza / elimina un artículo por ID             |
| `/api/admin/change-password`      | POST              | Admin      | Cambia la contraseña del usuario autenticado                 |
| `/api/admin/images`               | GET               | Admin      | Lista imágenes disponibles en Cloudinary                     |
| `/api/admin/messages`             | GET               | Admin      | Lista todos los mensajes de contacto                         |
| `/api/admin/messages/[id]`        | GET, PUT, DELETE  | Admin      | Obtiene / actualiza estado / elimina un mensaje por ID       |
| `/api/admin/site-config`          | GET, PUT          | Admin      | Obtiene / actualiza la configuración del sitio               |
| `/api/admin/stats`                | GET               | Admin      | Retorna estadísticas agregadas: totales de mensajes, citas y artículos |
| `/api/admin/upload/local`         | POST              | Admin      | Sube una imagen desde el panel admin                         |
| `/api/admin/users`                | GET, POST         | Admin      | Lista usuarios del sistema / Crea un nuevo usuario           |
| `/api/admin/users/[id]`           | GET, PUT, DELETE  | Admin      | Obtiene / actualiza / elimina un usuario por ID              |

---

## 7. Requisitos No Funcionales

**RNF-001 — Rendimiento**
Las páginas públicas del sitio deben aprovechar las capacidades de React Server Components (RSC) de Next.js 15 para minimizar el JavaScript enviado al cliente. Las imágenes se sirven a través de Cloudinary CDN con transformaciones automáticas. El tiempo de carga de la página de inicio no debe superar los 3 segundos en conexión 4G en condiciones normales.

**RNF-002 — Seguridad**
Las contraseñas de usuarios deben almacenarse hasheadas con `bcryptjs`. El acceso al panel administrativo y a todas las rutas `/api/admin/*` debe estar protegido por sesión JWT verificada en cada solicitud. Toda entrada de datos del usuario debe ser validada con esquemas Zod tanto en el cliente (React Hook Form) como en el servidor (rutas de API), previniendo inyecciones y datos malformados. Los tokens de recuperación de contraseña deben tener tiempo de expiración y ser de uso único.

**RNF-003 — SEO**
El sitio público debe implementar metadata dinámica utilizando la API de metadatos de Next.js 15. Los valores de `siteName`, `siteDescription` y `ogImage` configurados en `SiteConfig` deben reflejarse en las etiquetas `<title>`, `<meta name="description">` y `<meta property="og:*">` de las páginas. Las páginas de detalle de blog deben tener metadata específica basada en el artículo (`title`, `summary`, `image`).

**RNF-004 — Accesibilidad**
Los componentes de interfaz deben construirse sobre Radix UI y shadcn/ui, que implementan los patrones WAI-ARIA por defecto. Los formularios deben tener etiquetas (`<label>`) correctamente asociadas a sus campos. El contraste de colores debe cumplir con el estándar WCAG 2.1 nivel AA.

**RNF-005 — Mantenibilidad**
Todo el código fuente debe estar tipado con TypeScript estricto. Los modelos de la base de datos se gestionan exclusivamente a través de Prisma, garantizando tipos generados automáticamente. La arquitectura de componentes debe separar claramente la lógica de UI pública (`src/components/shared/`) de los componentes del panel admin (`src/components/admin/`). Los servicios externos (Brevo, Cloudinary) se encapsulan en módulos dedicados bajo `src/lib/`.

**RNF-006 — Localización**
Todo el contenido público del sitio debe estar en español. Los campos de dirección en `SiteConfig` utilizan la estructura administrativa de Guatemala: calle, número, zona, departamento, municipio y código postal. El modelo `Appointment` utiliza el término `"pendiente"` como estado por defecto, en español. Los datos geográficos disponibles vía `/api/guatemala` provienen del archivo `src/data/guatemala.json` con la estructura territorial del país.

---

## 8. Modelo de Datos

### User

| Campo             | Tipo       | Requerido | Por Defecto  | Notas                                      |
| ----------------- | ---------- | --------- | ------------ | ------------------------------------------ |
| `id`              | String     | Sí        | `cuid()`     | Clave primaria                             |
| `name`            | String?    | No        | —            | Nombre del usuario                         |
| `email`           | String     | Sí        | —            | Único en la tabla                          |
| `password`        | String     | Sí        | —            | Almacenada hasheada con bcrypt             |
| `role`            | String     | Sí        | `"admin"`    | Rol del usuario en el sistema              |
| `resetToken`      | String?    | No        | —            | Token de recuperación de contraseña, único |
| `resetTokenExpiry`| DateTime?  | No        | —            | Expiración del token de recuperación       |
| `createdAt`       | DateTime   | Sí        | `now()`      | —                                          |
| `updatedAt`       | DateTime   | Sí        | `@updatedAt` | Actualización automática                   |

### ContactMessage

| Campo       | Tipo     | Requerido | Por Defecto  | Notas                    |
| ----------- | -------- | --------- | ------------ | ------------------------ |
| `id`        | String   | Sí        | `cuid()`     | Clave primaria           |
| `name`      | String   | Sí        | —            | —                        |
| `email`     | String   | Sí        | —            | —                        |
| `phone`     | String?  | No        | —            | —                        |
| `subject`   | String   | Sí        | —            | —                        |
| `message`   | String   | Sí        | —            | Tipo `Text` en PostgreSQL |
| `status`    | String   | Sí        | `"new"`      | Estados: new, read, replied |
| `createdAt` | DateTime | Sí        | `now()`      | Índice para consultas     |
| `updatedAt` | DateTime | Sí        | `@updatedAt` | —                        |

Índices: `createdAt`, `status`

### Appointment

| Campo         | Tipo     | Requerido | Por Defecto    | Notas                    |
| ------------- | -------- | --------- | -------------- | ------------------------ |
| `id`          | String   | Sí        | `cuid()`       | Clave primaria           |
| `clientName`  | String   | Sí        | —              | —                        |
| `clientEmail` | String   | Sí        | —              | —                        |
| `clientPhone` | String?  | No        | —              | —                        |
| `date`        | DateTime | Sí        | —              | Índice para consultas     |
| `time`        | String   | Sí        | —              | Formato de hora libre     |
| `service`     | String   | Sí        | —              | Área de práctica legal   |
| `notes`       | String?  | No        | —              | Tipo `Text` en PostgreSQL |
| `status`      | String   | Sí        | `"pendiente"`  | Índice para consultas     |
| `createdAt`   | DateTime | Sí        | `now()`        | —                        |
| `updatedAt`   | DateTime | Sí        | `@updatedAt`   | —                        |

Índices: `date`, `status`

### BlogPost

| Campo       | Tipo      | Requerido | Por Defecto  | Notas                           |
| ----------- | --------- | --------- | ------------ | ------------------------------- |
| `id`        | String    | Sí        | `cuid()`     | Clave primaria                  |
| `slug`      | String    | Sí        | —            | Único, usado en la URL del artículo |
| `title`     | String    | Sí        | —            | —                               |
| `date`      | String    | Sí        | —            | Fecha en formato texto          |
| `summary`   | String    | Sí        | —            | Tipo `Text`, resumen corto      |
| `content`   | String    | Sí        | —            | Tipo `Text`, contenido BlockNote en JSON |
| `tags`      | String[]  | Sí        | —            | Array de etiquetas              |
| `image`     | String    | Sí        | `""`         | URL de imagen de portada (Cloudinary) |
| `published` | Boolean   | Sí        | `true`       | Índice para filtrado público    |
| `createdAt` | DateTime  | Sí        | `now()`      | —                               |
| `updatedAt` | DateTime  | Sí        | `@updatedAt` | —                               |

Índices: `slug`, `published`

### SiteConfig

| Campo             | Tipo    | Requerido | Por Defecto                     | Notas                              |
| ----------------- | ------- | --------- | -------------------------------- | ---------------------------------- |
| `id`              | String  | Sí        | `"default"`                     | Registro único (singleton)         |
| `siteName`        | String  | Sí        | `"Bermudez Legal Consulting"`   | —                                  |
| `siteDescription` | String? | No        | —                               | Tipo `Text`                        |
| `logo`            | String? | No        | —                               | URL del logo                       |
| `favicon`         | String? | No        | —                               | URL del favicon                    |
| `ogImage`         | String? | No        | —                               | URL de imagen para Open Graph      |
| `contactEmail`    | String? | No        | —                               | Email público de contacto          |
| `contactPhone`    | String? | No        | —                               | Teléfono público                   |
| `openingHours`    | String? | No        | —                               | Texto libre de horarios            |
| `businessHours`   | Json?   | No        | —                               | Estructura JSON de horarios por día |
| `street`          | String? | No        | —                               | Dirección: calle                   |
| `streetNumber`    | String? | No        | —                               | Dirección: número                  |
| `zone`            | String? | No        | —                               | Zona (formato guatemalteco)        |
| `department`      | String? | No        | —                               | Departamento de Guatemala          |
| `city`            | String? | No        | —                               | Municipio                          |
| `postalCode`      | String? | No        | —                               | Código postal                      |
| `country`         | String  | Sí        | `"Guatemala"`                   | —                                  |
| `facebook`        | String? | No        | —                               | URL de página Facebook             |
| `instagram`       | String? | No        | —                               | URL de perfil Instagram            |
| `linkedin`        | String? | No        | —                               | URL de perfil LinkedIn             |
| `twitter`         | String? | No        | —                               | URL de perfil Twitter/X            |
| `updatedAt`       | DateTime| Sí        | `@updatedAt`                    | Actualización automática           |

---

## 9. Arquitectura Técnica

### Estructura de Rutas (Route Groups)

Next.js 15 utiliza route groups para organizar las páginas sin afectar la URL:

- **`(public)`** — Agrupa las páginas del sitio público: `/`, `/servicios`, `/blog`, `/blog/[slug]`, `/contacto`. Comparten el layout `src/app/(public)/layout.tsx` que incluye el header y footer globales.
- **`admin/(dashboard)`** — Agrupa las páginas del panel administrativo protegidas: dashboard, mensajes, citas, blog, usuarios, configuración. Comparten el layout `src/app/admin/(dashboard)/layout.tsx` que incluye la barra lateral (`src/components/shared/admin-sidebar.tsx`).
- Las páginas de autenticación del admin (`/admin/login`, `/admin/forgot-password`, `/admin/reset-password`) viven directamente bajo `src/app/admin/` sin el layout del dashboard.

### Estrategia de Renderizado

- Las páginas públicas utilizan **React Server Components (RSC)** por defecto, realizando consultas a la base de datos en el servidor mediante Prisma y sin exponer lógica al cliente.
- Los componentes interactivos (filtro de tags, formulario de contacto, editor BlockNote, formulario de configuración) se marcan con `"use client"` y se hidratan en el navegador.
- El cliente del panel admin utiliza **TanStack React Query** para la gestión del estado del servidor y la caché de datos, y **Zustand** para el estado local de la UI.

### Autenticación

- **NextAuth 5 beta.30** con estrategia JWT edge-compatible, configurada en `src/lib/auth.ts` y `src/lib/auth.config.ts`.
- El tipo de sesión se extiende en `src/types/next-auth.d.ts` para incluir el campo `role` del usuario.
- El middleware `src/middleware.ts` intercepta todas las solicitudes a rutas bajo `/admin` y redirige a login si no hay sesión válida.

### Servicios Externos

- **Cloudinary** — Almacenamiento y CDN para imágenes del blog y del sitio. Configurado en `src/lib/cloudinary.ts`. Las imágenes se suben via `POST /api/upload/cloudinary` (público) y `POST /api/admin/upload/local` (admin).
- **Brevo** — Servicio de email transaccional para notificaciones de contacto y recuperación de contraseña. Configurado en `src/lib/brevo.ts` utilizando el SDK `@getbrevo/brevo`.

### Stack Tecnológico Completo

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

## 10. Métricas de Éxito

1. **Tasa de conversión del formulario de contacto** — Porcentaje de visitantes únicos que completan y envían el formulario de contacto. Objetivo inicial: 2% o superior.

2. **Tiempo de respuesta a mensajes** — Tiempo promedio entre la recepción de un mensaje de contacto y su cambio de estado a "respondido" en el panel admin. Objetivo: menos de 24 horas hábiles.

3. **Volumen de artículos publicados** — Número de artículos de blog publicados por mes. Un flujo constante de contenido indica adopción del editor por parte del equipo.

4. **Citas gestionadas** — Número de citas creadas y confirmadas mensualmente a través del panel admin. Indica el uso activo del módulo de agenda.

5. **Disponibilidad del sitio** — Uptime del sistema en producción. Objetivo: 99.5% o superior medido mensualmente.

6. **Velocidad de carga (Core Web Vitals)** — LCP (Largest Contentful Paint) menor a 2.5 segundos y CLS (Cumulative Layout Shift) menor a 0.1, medido con Google PageSpeed Insights.

7. **Completitud de la configuración del sitio** — Porcentaje de campos del modelo `SiteConfig` que han sido completados. Un `SiteConfig` completamente configurado indica que el bufete ha adoptado la plataforma para su operación real.

---

## 11. Hoja de Ruta

### Fase 1 — MVP (Estado Actual)

Funcionalidades implementadas y disponibles en la versión `1.0`:

- Sitio público completo: homepage, servicios, blog con filtro por tags, detalle de artículo con share, página de contacto con formulario.
- Notificaciones por email via Brevo al recibir mensajes de contacto.
- Panel administrativo con autenticación JWT y middleware de protección.
- Flujo completo de recuperación de contraseña por email.
- Dashboard con estadísticas, alertas de prioridad y actividad reciente.
- Gestión completa de mensajes de contacto.
- Gestión completa de citas (CRUD + estados).
- CRUD completo de blog con editor BlockNote, upload de imágenes a Cloudinary y control de publicación.
- Gestión de usuarios del sistema con roles.
- Configuración del sitio: branding, contacto, horarios, dirección guatemalteca, redes sociales.
- Cambio de contraseña desde el panel.
- Configuración personal del administrador.
- Base de datos PostgreSQL 16 en Docker con migraciones Prisma y datos de prueba (seed).

### Fase 2 — Mejoras Operativas

Funcionalidades planificadas para la siguiente iteración:

- Formulario de solicitud de cita público para que los clientes potenciales agenden directamente desde el sitio, sin intervención del administrador.
- Confirmación automática de citas por email al cliente y notificación al administrador al crearse una nueva solicitud.
- Sistema de comentarios en los artículos del blog con moderación desde el panel admin.
- Exportación de mensajes y citas a CSV desde el panel admin.

### Fase 3 — Portal del Cliente y Análisis

- Portal de cliente autenticado donde los usuarios pueden consultar el historial de sus citas y comunicaciones con el bufete.
- Dashboard de analíticas con visualizaciones de tendencias de mensajes, citas por servicio y tráfico del blog.
- Internacionalización (i18n) del sitio público al inglés para atender clientes extranjeros con operaciones en Guatemala.
- Optimización de SEO avanzada: sitemap dinámico, schema.org para servicios legales y artículos de blog.

### Fase 4 — Automatización y Monetización

- Módulo CRM básico para seguimiento del ciclo de vida del cliente: prospecto, consulta, cliente activo, caso cerrado.
- Generación automatizada de documentos legales básicos (contratos, poderes) a partir de plantillas configurables.
- Integración con pasarela de pagos para cobro de consultas iniciales o servicios en línea.
- Facturación electrónica integrada con los requerimientos del SAT de Guatemala.
