# exFutura - Documentación Técnica y de Arquitectura

Bienvenido a la documentación técnica del portfolio de **exFutura**. Este proyecto es una aplicación web de alto rendimiento orientada a presentar los servicios, la misión y el contacto de la agencia. 

## 1. Arquitectura del Proyecto

El proyecto está construido utilizando un stack moderno y eficiente diseñado para sitios estáticos e interactivos:

- **Astro**: Framework principal. Permite generar sitios estáticos ultrarrápidos (SSG), integrando componentes UI y enviando 0 JavaScript al cliente de forma predeterminada.
- **ViewTransitions (ClientRouter)**: Funcionalidad nativa de Astro que provee una experiencia SPA (Single Page Application) al navegar, realizando animaciones de crossfade entre páginas sin recargar el navegador.
- **Tailwind CSS**: Framework de utilidades para el estilado.
- **Diseño Responsive**: Mobile-first y escalable a pantallas Ultra-Wide.

### Estructura de Directorios (Astro Standard)
- `/src/pages`: Contiene las rutas de la aplicación (`index.astro`, `about.astro`, `contact.astro`, etc.). Los archivos aquí con corchetes (ej. `/services/[id].astro`) generan rutas dinámicas en tiempo de compilación.
- `/src/components`: Componentes de UI reutilizables (Botones, Tarjetas, Secciones, Preloader).
- `/src/layouts`: Componentes envolventes (wrappers) que definen la estructura global del HTML (como `Layout.astro`).
- `/src/styles`: Archivos CSS globales (`globals.css`).
- `/src/data`: Información estática de la web. Aquí vive `services.js`, que funciona como la base de datos de los servicios.
- `/public`: Archivos estáticos accesibles directamente desde la raíz (imágenes, logos, iconos).

---

## 2. Sistema de Diseño: "Dark Glassmorphism"

El sitio fue refactorizado para adoptar una estética **"Dark Glassmorphism"** (Minimalista, oscura, corporativa y elegante).

### Principios de Diseño
1. **Glassmorphism (Paneles de Cristal Oscuro)**: En lugar de fondos sólidos, los componentes flotan sobre fondos fotográficos mediante paneles translúcidos. 
   - Utilidad en CSS: `.glass-panel` (Aplica `backdrop-filter: blur`, borde semitransparente, sombra sutil y un fondo con muy baja opacidad).
2. **Tipografía Premium**:
   - **Display/Headings**: `Syne` (Brinda un toque moderno, arquitectónico y único a los títulos grandes).
   - **Cuerpo/UI**: `Plus Jakarta Sans` (Extremadamente legible en pantallas pequeñas, geométrico y profesional).
   - **Acentos**: `Space Mono` (Utilizado para listas de tecnologías o etiquetas, aportando un toque "tech").
3. **Esquema de Color**:
   - **Fondo General**: `zinc-950` (Casi negro).
   - **Texto Principal**: Blanco (`text-white`) y `zinc-300` a `zinc-400` para descripciones, creando jerarquía.
   - **Acento**: Rojo exFutura (`red-600` / `red-400` / `red-500/10` para fondos sutiles).

### Utilidades Globales (`src/styles/globals.css`)
- `@layer components`: Definición de `.glass-panel` y `.glass-panel-light`.
- Variables CSS para colores consistentes si se requiere expansión en el futuro.

### Navegación Inteligente (`Header.astro`)
El componente de cabecera detecta automáticamente la ruta activa:
- **Estado Activo**: Resalta el enlace actual con color blanco y una línea de acento roja fija.
- **Prevención de Redundancia**: Si el usuario intenta navegar a la página en la que ya se encuentra, el enlace bloquea la acción para evitar recargas innecesarias y asegurar la fluidez de la interfaz.

---

## 3. Optimización de Carga e Imágenes

Debido al uso de fondos fotográficos pesados (`mac.webp`, `puzzle.webp`, `email.webp`), la carga inicial es vital para la percepción de calidad del usuario.

### El Preloader (`Preloader.astro`)
Para garantizar una experiencia premium, el sitio implementa un **Preloader Global**.
- **Comportamiento**: Un `div` fijo oscuro (`bg-black`) que cubre toda la pantalla con el logo de exFutura pulsando. 
- **Lógica de Persistencia**: Utiliza la directiva `transition:persist` de Astro. Esto permite que el loader se cargue una sola vez. Una vez oculto, permanece en estado `display: none` durante el resto de la navegación por el sitio, evitando parpadeos negros al cambiar de página.
- **Lógica de Ejecución**: Escucha el evento `astro:page-load`. Se oculta rápidamente tras la carga inicial (o tras un fallback de seguridad de 1000ms) para no entorpecer la navegación.
- **ViewTransitions**: El preloader está optimizado para funcionar con el ruteo suave de Astro, asegurando que la primera impresión sea perfecta pero que el resto de la navegación sea instantánea.

### Atributos y Fluidos en Imágenes
Las imágenes del sitio están optimizadas para una transición suave:
- **`transition:name`**: Aplicado a los contenedores de las imágenes en los servicios para que los bordes redondeados y los overlays oscuros viajen de forma fluida entre la lista y el detalle.
- **`transition:persist`**: Los fondos críticos (como `mac.webp`) están persistidos entre las páginas de servicios para evitar que la imagen "parpadee" o se recargue al navegar entre servicios.
- **Placeholder**: Se utiliza un color de fondo `bg-zinc-800/50` como skeleton mientras las imágenes terminan de renderizarse, eliminando saltos visuales.
- **Configuración**: `loading="eager"` para elementos visibles de inmediato y `decoding="async"` para no bloquear el renderizado.

---

## 4. Guía de Desarrollo: Cómo agregar contenido

### Modificar Servicios
La arquitectura de servicios es **completamente dinámica**. Si exFutura ofrece un nuevo servicio, **no necesitas crear una nueva página**.

1. Abre el archivo `src/data/services.js`.
2. Agrega un nuevo objeto al array `services`.
3. Asegúrate de incluir el campo `id` (slug de la URL, ej. `"nuevo-servicio"`).
4. Abre `src/pages/services/[id].astro` y agrega el nuevo ID en la función `getStaticPaths`:
   ```javascript
   export async function getStaticPaths() {
     return [
       // ...rutas anteriores
       { params: { id: "nuevo-servicio" } },
     ];
   }
   ```
Al compilar, Astro automáticamente generará la tarjeta en `/services` y la página detallada en `/services/nuevo-servicio`.

---

## 5. Posibles Mejoras Futuras (Roadmap)

Aunque la aplicación está altamente optimizada, aquí hay áreas donde el proyecto puede escalar en el futuro:

### A. Migración a `astro:assets` (Imágenes)
Actualmente, las imágenes residen en la carpeta `/public` y se usan en tags `<img>` normales. 
- **Mejora**: Mover las imágenes a `src/assets` e importarlas directamente en los componentes (ej. `import heroImg from '../assets/mac.webp';`).
- **Beneficio**: Esto permite usar el componente nativo `<Image />` de Astro, el cual procesa las imágenes durante el *build*, creando variaciones de resolución responsivas (srcset) automáticamente, optimizando aún más el ancho de banda para usuarios en móviles.

### B. Integración con un CMS (Content Management System)
Actualmente los servicios viven en un archivo `.js`.
- **Mejora**: Integrar **Astro Content Collections** (archivos Markdown/MDX) o un Headless CMS externo (como Sanity, Strapi o Decap CMS).
- **Beneficio**: Permitirá que personas no técnicas (equipo de marketing o redactores) modifiquen los textos, agreguen proyectos o editen FAQs sin tocar el código fuente del repositorio.

### C. Accesibilidad (a11y) y SEO Avanzado
- **A11y**: Asegurar que todos los enlaces tengan etiquetas `aria-label` descriptivas y comprobar el enfoque interactivo mediante teclado en el menú móvil y los modales.
- **SEO**: Agregar un componente dinámico de `<SEO />` en el `<head>` de `Layout.astro` que inyecte etiquetas `OpenGraph` (para que al compartir el link en WhatsApp o LinkedIn aparezca una tarjeta bonita con una imagen del sitio en lugar de solo texto).

### D. Formularios
- El formulario en `/contact` funciona con *Formspree*. A futuro, se puede integrar una API *Serverless* nativa de Astro (Astro SSR) con Resend o Nodemailer para no depender de servicios externos gratuitos, teniendo control absoluto sobre el diseño del correo electrónico que recibe el cliente.
