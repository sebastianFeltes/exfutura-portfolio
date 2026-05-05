# exFutura - Documentación Técnica y de Arquitectura

Bienvenido a la documentación técnica del portfolio de **exFutura**. Este proyecto es una aplicación web de alto rendimiento orientada a presentar los servicios, la misión y el contacto de la agencia. 

## 1. Arquitectura del Proyecto

El proyecto está construido utilizando un stack moderno y eficiente diseñado para sitios estáticos e interactivos:

- **Astro**: Framework principal. Permite generar sitios estáticos ultrarrápidos (SSG), integrando componentes UI y enviando 0 JavaScript al cliente de forma predeterminada.
- **ViewTransitions (ClientRouter)**: Funcionalidad nativa de Astro que provee una experiencia SPA (Single Page Application) al navegar, realizando animaciones de crossfade entre páginas sin recargar el navegador.
- **Tailwind CSS v4**: Framework de utilidades para el estilado, integrado mediante el plugin `@tailwindcss/vite`.
- **Astro Content Collections**: Sistema de gestión de contenido basado en archivos Markdown, con validación de esquemas mediante Zod.
- **`astro:assets`**: Pipeline de optimización de imágenes nativo de Astro para procesamiento automático en build.
- **Diseño Responsive**: Mobile-first y escalable a pantallas Ultra-Wide.

### Estructura de Directorios

```
src/
├── assets/              # Imágenes optimizadas por astro:assets (WebP, PNG, SVG)
├── components/          # Componentes de UI reutilizables
│   ├── ui/              # Componentes atómicos (Button, ButtonLink, SocialMediaLink)
│   ├── Header.astro     # Navbar con iconos, detección de ruta activa y menú móvil
│   ├── Hero.astro       # Sección principal con animaciones de tipeo
│   ├── SEO.astro        # Componente de metadatos OpenGraph/Twitter
│   ├── ThemeToggle.astro # Selector de tema claro/oscuro
│   ├── ServicesCard.astro
│   ├── ServicesSection.astro
│   ├── AboutSection.astro
│   ├── Footer.astro
│   └── Preloader.astro
├── content/             # Astro Content Collections
│   ├── config.ts        # Esquema Zod de validación
│   └── services/        # Archivos Markdown por servicio
│       ├── desarrollo-fullstack.md
│       ├── inteligencia-artificial.md
│       ├── aplicaciones-mobile.md
│       ├── transformacion-digital.md
│       ├── consultoria-tecnica.md
│       └── hosting-web.md
├── layouts/             # Layout principal (Layout.astro)
├── pages/               # Rutas de la aplicación
│   ├── index.astro
│   ├── about.astro
│   ├── contact.astro
│   ├── services.astro
│   └── services/[id].astro  # Rutas dinámicas generadas desde Content Collections
├── styles/              # Archivos CSS globales (globals.css)
└── types/               # Tipos TypeScript
```

- `/public`: Archivos estáticos accesibles directamente desde la raíz (favicon, imagen OG). **Nota**: Las imágenes de contenido ya NO viven aquí; fueron migradas a `src/assets/`.

---

## 2. Sistema de Diseño: "Dark Glassmorphism" con Modo Claro

El sitio adopta una estética **"Dark Glassmorphism"** (minimalista, oscura, corporativa y elegante) como tema por defecto, con soporte completo para un **modo claro**.

### Sistema de Temas (`src/styles/globals.css`)

El theming está implementado mediante **variables CSS** en `:root` (oscuro) y `[data-theme="light"]` (claro), permitiendo que todos los componentes respondan automáticamente al cambio de tema.

#### Variables principales:
| Variable | Dark | Light |
|---|---|---|
| `--bg-primary` | `#09090b` (zinc-950) | `#fafafa` (zinc-50) |
| `--bg-secondary` | `#18181b` (zinc-900) | `#f4f4f5` (zinc-100) |
| `--text-primary` | `#f4f4f5` (zinc-100) | `#09090b` (zinc-950) |
| `--text-secondary` | `#a1a1aa` (zinc-400) | `#52525b` (zinc-600) |
| `--accent-red` | `#dc2626` (red-600) | `#e11d48` (rose-600) |
| `--glass-bg` | `rgba(0,0,0,0.4)` | `rgba(255,255,255,0.7)` |
| `--overlay-color` | `rgba(9,9,11,0.7)` | `rgba(250,250,250,0.8)` |

#### ThemeToggle (`ThemeToggle.astro`)
- Iconos de sol/luna con transiciones suaves.
- Persiste la preferencia en `localStorage`.
- Funciona con múltiples instancias (desktop y móvil) gracias a `querySelectorAll`.
- La preferencia se restaura instantáneamente en el `<head>` del Layout (script `is:inline`) para evitar flashes de tema incorrecto.
- Se sincroniza automáticamente entre navegaciones vía `astro:after-swap`.

### Principios de Diseño

1. **Glassmorphism (Paneles de Cristal)**:
   - `.glass-panel`: `backdrop-filter: blur(16px)`, borde semitransparente, sombra profunda y fondo con baja opacidad.
   - `.glass-panel-light`: Versión más sutil para el navbar y elementos secundarios.

2. **Tipografía Premium**:
   - **Display/Headings**: `Syne` (toque moderno y arquitectónico).
   - **Cuerpo/UI**: `Plus Jakarta Sans` (legible, geométrico, profesional).
   - **Acentos**: `Space Mono` (etiquetas de tecnología, pronunciación fonética).

3. **Esquema de Color**: Adaptable entre oscuro y claro mediante las variables CSS. El acento rojo se ajusta ligeramente en modo claro para mantener contraste adecuado.

### Navegación Inteligente (`Header.astro`)

- **Iconos Lucide**: Cada enlace del navbar incluye un ícono SVG inline (Layers, Users, Mail).
- **Estado Activo**: Detección automática de la ruta actual. Resalta el enlace con color primario y una línea de acento roja fija.
- **Prevención de Redundancia**: Si el usuario intenta navegar a la página actual, se bloquea la acción (`event.preventDefault()`).
- **Menú Móvil**: Overlay con animaciones de entrada, gestión completa de foco (`aria-expanded`, `aria-controls`, `role="dialog"`), cierre con tecla Escape, y bloqueo de scroll del body.

---

## 3. SEO y OpenGraph (`SEO.astro`)

El componente `SEO.astro` se inyecta en el `<head>` de cada página a través del Layout y gestiona automáticamente:

- **Meta tags primarios**: `title`, `description`, `canonical URL`.
- **OpenGraph** (Facebook, WhatsApp, LinkedIn): `og:title`, `og:description`, `og:image`, `og:site_name`, `og:type`.
- **Twitter Cards**: `twitter:card` (summary_large_image), `twitter:image`.
- **Favicon**: Logo de exFutura (`/xF-logo.png`).
- **Theme Color**: `#09090b`.

### Imagen OG
El archivo `public/og-image.png` es un banner de alta calidad con la estética de exFutura (fondo oscuro, acentos de neón rojo, logo). Al compartir cualquier link del sitio en redes sociales o mensajería, se muestra automáticamente esta tarjeta visual.

### Configuración del sitio
El campo `site` en `astro.config.mjs` está configurado como `https://exfutura.dev`. Esto permite que las URLs canónicas y de imágenes OG sean absolutas.

---

## 4. Optimización de Imágenes (`astro:assets`)

Todas las imágenes del sitio han sido migradas de `/public` a `src/assets/` y se sirven mediante el componente `<Image />` de Astro.

### Beneficios
- **Optimización automática**: Astro procesa las imágenes en build, generando versiones optimizadas en WebP con dimensiones adecuadas.
- **Prevención de CLS**: Las dimensiones se conocen en tiempo de compilación, evitando saltos de layout.
- **Type-safety**: Las imágenes importadas como módulos JS son verificadas por TypeScript.

### Componentes que usan `<Image />`
| Componente | Imagen | Uso |
|---|---|---|
| `Header.astro` | `xF-logo.png` | Logo del navbar |
| `Hero.astro` | `puzzle.webp` | Fondo del hero |
| `ServicesCard.astro` | Dinámico (desde Content Collections) | Portada de cada servicio |
| `services.astro` | `mac.webp` | Fondo de la sección servicios |
| `services/[id].astro` | `mac.webp` + servicio | Fondo + imagen del servicio |
| `about.astro` | `bulb.webp` | Fondo de sobre nosotros |
| `contact.astro` | `email.webp` | Fondo de contacto |
| `SocialMediaLink.astro` | `instagram-icon.png`, `whatsapp-icon.png` | Íconos de redes sociales |

### Configuración de carga
- **`loading="eager"`**: Elementos LCP (fondos principales).
- **`decoding="async"`**: No bloquea el renderizado.
- **`fetchpriority="high"`**: Prioridad máxima para fondos visibles de inmediato.

---

## 5. El Preloader (`Preloader.astro`)

Para garantizar una experiencia premium, el sitio implementa un **Preloader Global**.

- **Comportamiento**: Un `div` fijo oscuro (`bg-black`) que cubre toda la pantalla con el logo de exFutura pulsando.
- **Lógica de Persistencia**: Utiliza `transition:persist` de Astro. El loader se carga una sola vez; una vez oculto, permanece en `display: none` durante el resto de la navegación.
- **Lógica de Ejecución**: Escucha `astro:page-load`. Se oculta rápidamente tras la carga inicial (o un fallback de 1000ms).
- **ViewTransitions**: Optimizado para el ruteo suave de Astro.

---

## 6. Content Collections (Servicios)

Los servicios se gestionan mediante **Astro Content Collections**, ofreciendo una arquitectura escalable y mantenible.

### Esquema (`src/content/config.ts`)

```typescript
const servicesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    bgImage: image(),
    technologies: z.array(z.object({ name: z.string(), link: z.string().optional() })),
    longDescription: z.string(),
    features: z.array(z.string()),
    targetAudience: z.array(z.string()),
    benefits: z.array(z.string()),
    process: z.array(z.string()),
    projects: z.array(z.object({ ... })).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    cta: z.string().optional(),
  }),
});
```

### Cómo agregar un nuevo servicio

1. Crear un archivo `src/content/services/nombre-del-servicio.md`.
2. Agregar el frontmatter YAML con todos los campos obligatorios del esquema.
3. Incluir la imagen en `src/assets/` y referenciarla como ruta relativa en `bgImage`.
4. **No se necesitan cambios en ningún otro archivo**. Astro generará automáticamente:
   - La tarjeta en `/services`.
   - La página de detalle en `/services/nombre-del-servicio`.

### Ejemplo de frontmatter

```yaml
---
title: "Nuevo Servicio"
subtitle: "Descripción corta"
description: "Descripción para la tarjeta de la lista."
bgImage: "../../assets/nueva-imagen.webp"
technologies:
  - name: "Tecnología A"
    link: "https://ejemplo.com"
  - name: "Tecnología B"
longDescription: "Descripción extendida para la página de detalle."
features:
  - "🚀 Característica 1"
  - "🛠️ Característica 2"
targetAudience:
  - "🏢 Público objetivo 1"
benefits:
  - "💰 Beneficio 1"
process:
  - "📞 Paso 1"
faqs:
  - q: "¿Pregunta frecuente?"
    a: "Respuesta."
cta: "¿Querés saber más? <a href='/contact'>Contactanos</a>."
---
```

### Cómo se consumen los datos

- **Lista de servicios** (`services.astro`): Usa `getCollection("services")` para listar todos los servicios.
- **Detalle de servicio** (`services/[id].astro`): Usa `getStaticPaths()` + `getEntry("services", id)` para generar las rutas dinámicas y obtener los datos de cada servicio.

---

## 7. Animaciones del Hero (`Hero.astro`)

El Hero implementa varias animaciones sutiles para dar vida a la landing page:

### Efecto Typewriter
- Un script JS alterna el sufijo del subtítulo entre frases como "a medida", "para empresas", "para vos", manteniendo fijo el prefijo "Soluciones digitales ".
- El cursor parpadeante (pseudo-elemento `::after`) refuerza la estética de terminal/código.
- Se inicia con un delay de 2 segundos para sincronizar con las animaciones de entrada.

### Animaciones CSS
| Clase | Efecto | Delay |
|---|---|---|
| `.animate-fade-in` | Fade-in desde opacidad 0 | 0.5s |
| `.animate-slide-up` | Slide-up de 20px + fade-in | 0.8s |
| `.h1-text` | Text-glow pulsante (rojo sutil) | Infinito, 4s ciclo |

---

## 8. Accesibilidad (a11y)

### Etiquetas ARIA
- Todos los enlaces del navbar tienen `aria-label` descriptivos (ej: `"Ver sección de Servicios"`).
- Los botones del Hero incluyen `aria-label` contextual.
- Las tarjetas de servicio tienen `aria-label` con el nombre del servicio.
- Los enlaces de redes sociales incluyen `aria-label` y `rel="noopener noreferrer"`.
- Los íconos decorativos están marcados con `aria-hidden="true"`.

### Menú Móvil
- `aria-expanded` se actualiza dinámicamente al abrir/cerrar.
- `aria-controls` conecta el botón con el overlay del menú.
- `role="dialog"` y `aria-modal="true"` en el overlay.
- **Gestión de foco**: Al abrir, el foco se mueve al primer enlace. Al cerrar, vuelve al botón.
- **Tecla Escape**: Cierra el menú.
- **Scroll Lock**: Se bloquea el scroll del `body` cuando el menú está abierto.

### Focus Visible
- Las tarjetas de servicios y los enlaces de redes sociales tienen `focus:ring-2 focus:ring-accent-red` para indicar foco visual via teclado.

---

## 9. Posibles Mejoras Futuras (Roadmap)

### A. Integración con un CMS Externo
- **Mejora**: Integrar un Headless CMS (Sanity, Strapi o Decap CMS) que alimente las Content Collections.
- **Beneficio**: Permitirá que personas no técnicas modifiquen textos sin tocar el repositorio.

### B. Formularios Serverless
- El formulario en `/contact` funciona con *Formspree*. A futuro, se puede integrar una API Serverless nativa de Astro (SSR) con Resend o Nodemailer para tener control absoluto sobre el correo.

### C. Internacionalización (i18n)
- Agregar soporte para inglés usando el sistema de i18n de Astro, duplicando las Content Collections por idioma.

### D. Analytics
- Integrar Google Analytics o Plausible para medir tráfico y conversiones del formulario de contacto.
