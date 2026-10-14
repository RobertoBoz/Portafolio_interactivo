/**
 * Contenido del portafolio que aparece en terminales, pizarrones y archivadores.
 * Todo sale del CV. Las descripciones son genéricas por la confidencialidad de la empresa.
 * Lo que no está en el CV se marca como contenido de ejemplo para sustituirlo.
 */

export type Line = string | { label: string; value: string }
export type LinkItem = { label: string; href: string }

export type PanelSection = {
  heading?: string
  lines?: Line[]
  paragraphs?: string[]
  bullets?: string[]
  links?: LinkItem[]
  download?: LinkItem
  /** Aviso destacado, p. ej. contenido de ejemplo por sustituir. */
  note?: string
}

export type PanelContent = {
  title: string
  subtitle?: string
  sections: PanelSection[]
}

const CV_URL = `${import.meta.env.BASE_URL}cv/Roberto-Bolanos-Zepeda-CV.pdf`
const CONFIDENTIAL = 'Sin capturas ni enlaces públicos por la confidencialidad del cliente.'

/* -------------------------------- Proyectos -------------------------------- */

type Project = {
  id: string
  name: string
  tech: string
  description: string
  contribution?: string
  highlights: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 'iteam',
    name: 'iTeamApp',
    tech: 'Flutter',
    description: 'App para equipos que trabajan fuera de oficina, con captura de información y funcionamiento sin conexión.',
    contribution: 'Responsable como Tech Lead: arquitectura, estándares del equipo y desarrollo.',
    highlights: ['Funciona sin conexión y sincroniza después', 'Geolocalización y mapas', 'Almacenamiento local'],
  },
  {
    id: 'kontrolia',
    name: 'Kontrolia',
    tech: 'Flutter',
    description: 'App de autoservicio para colaboradores, con registro de asistencia y trámites desde el celular.',
    contribution: 'Responsable como Tech Lead: arquitectura, estándares del equipo y desarrollo.',
    highlights: ['Reconocimiento facial', 'Trámites y consulta de documentos', 'Notificaciones push'],
  },
  {
    id: 'gtrack',
    name: 'GtrackApp',
    tech: 'Flutter',
    description: 'App de seguimiento de ubicación en tiempo real.',
    contribution: 'Responsable como Tech Lead: arquitectura, estándares del equipo y desarrollo.',
    highlights: ['Seguimiento en tiempo real', 'Geolocalización y mapas'],
  },
  {
    id: 'logistica',
    name: 'App logística (legado)',
    tech: 'Kotlin',
    description: 'App nativa para registrar operaciones con evidencia fotográfica y uso sin conexión.',
    contribution: 'Mantenimiento del proyecto legado.',
    highlights: ['Evidencia fotográfica', 'Funcionamiento sin conexión'],
  },
  {
    id: 'comunicacion',
    name: 'Comunicación interna (legado)',
    tech: 'Kotlin y Swift',
    description: 'App nativa en Android e iOS con mensajería y notificaciones push.',
    contribution: 'Mantenimiento del proyecto legado en ambas plataformas.',
    highlights: ['Android e iOS nativos', 'Notificaciones push'],
  },
  {
    id: 'cursos',
    name: 'Plataforma de cursos',
    tech: 'Ionic',
    description: 'App híbrida de cursos en línea, adaptada a la identidad de la organización.',
    highlights: ['Basada en una versión personalizada de MoodleApp', 'Marca y acceso propios'],
  },
  {
    id: 'componentes',
    name: 'Componentes móviles',
    tech: 'Flutter',
    description: 'Componentes reutilizables para acelerar nuevos proyectos.',
    highlights: ['Autenticación biométrica', 'Captura con cámara', 'Mapas con rutas'],
  },
  {
    id: 'automatizacion',
    name: 'Automatización',
    tech: 'Python y GitLab',
    description: 'Scripts e integraciones para automatizar tareas repetitivas del equipo de desarrollo.',
    highlights: ['Gestión de issues', 'Reportes de métricas', 'Sincronización de datos'],
  },
]

function projectPanel(project: Project): PanelContent {
  return {
    title: project.name.toUpperCase(),
    subtitle: project.tech,
    sections: [
      { paragraphs: [project.description] },
      ...(project.contribution ? [{ heading: 'Mi contribución', paragraphs: [project.contribution] }] : []),
      { heading: 'Puntos clave', bullets: project.highlights },
      { note: CONFIDENTIAL },
    ],
  }
}

/* ---------------------------------- Stack ---------------------------------- */

/** Un escritorio de la sala de Desarrollo por categoría, en el orden de los escritorios. */
export const STACK: { id: string; title: string; items: string[] }[] = [
  { id: 'multiplataforma', title: 'Móvil multiplataforma', items: ['Flutter', 'Dart', 'BLoC / Cubit', 'Ionic'] },
  { id: 'nativo', title: 'Móvil nativo', items: ['Android (Kotlin / Java)', 'iOS (Swift)'] },
  { id: 'backend', title: 'Backend y scripts', items: ['Node.js', 'Python', 'APIs REST'] },
  { id: 'persistencia', title: 'Persistencia local', items: ['ObjectBox', 'SQLite', 'Floor'] },
  {
    id: 'integraciones',
    title: 'Integraciones',
    items: ['Geolocalización y mapas', 'OCR', 'Reconocimiento facial', 'Notificaciones push'],
  },
  {
    id: 'flujo',
    title: 'Flujo de trabajo',
    items: ['GitLab Flow', 'Conventional Commits', 'Plantillas de merge request', 'Checklists de revisión'],
  },
]

/* --------------------------------- Paneles --------------------------------- */

const STATIC_PANELS: Record<string, PanelContent> = {
  welcome: {
    title: 'DEVELOPER LOG #001',
    subtitle: 'Terminal del lobby',
    sections: [
      {
        lines: [
          { label: 'Nombre', value: 'Roberto Bolaños Zepeda' },
          { label: 'Rol', value: 'Tech Lead Mobile' },
          { label: 'Base', value: 'Pachuca, Hidalgo · remoto' },
          { label: 'Estado del sistema', value: 'operativo' },
        ],
      },
      {
        heading: 'Planta baja',
        bullets: [
          'Recepción: presentación y contacto.',
          'Desarrollo: tecnologías y herramientas.',
          'Archivo de proyectos: proyectos destacados.',
          'Laboratorio técnico: arquitectura y decisiones.',
          'Sala de juntas: experiencia y liderazgo.',
          'Sala de servidores: CI/CD y automatización.',
          'Oficina privada: perfil y CV. Requiere tarjeta.',
          'M abre el plano. Esc pausa.',
        ],
      },
    ],
  },
  intro: {
    title: 'BIENVENIDA',
    subtitle: 'Recepción',
    sections: [
      {
        paragraphs: [
          'Soy Roberto Bolaños, Tech Lead Mobile e ingeniero de software. Construyo soluciones empresariales para móviles y backend con Flutter, Kotlin, Swift, Node.js y Python.',
          'Lidero un equipo de cuatro desarrolladores y combino desarrollo directo con arquitectura, análisis técnico y mentoría.',
        ],
      },
      { heading: 'Pista', paragraphs: ['Dejaron una tarjeta de acceso sobre el escritorio. Abre la oficina privada.'] },
    ],
  },
  contact: {
    title: 'DIRECTORIO',
    subtitle: 'Contacto',
    sections: [
      {
        lines: [{ label: 'Correo', value: 'robertobolanoszepeda@gmail.com' }],
        links: [
          { label: 'Escribir un correo', href: 'mailto:robertobolanoszepeda@gmail.com' },
          { label: 'GitHub · RobertoBoz', href: 'https://github.com/RobertoBoz' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roberto-bola%C3%B1os-zepeda-63614519b/' },
          { label: 'Portafolio clásico', href: 'https://robertoboz.github.io/Portafolio/' },
        ],
      },
    ],
  },
  about: {
    title: 'PERFIL',
    subtitle: 'Tech Lead Mobile · Ingeniero de Software',
    sections: [
      {
        paragraphs: [
          'Tech Lead e ingeniero de software especializado en soluciones empresariales para plataformas móviles y backend. Trabajo con Flutter, Android (Kotlin/Java), iOS (Swift), Node.js y Python.',
          'He participado en la evolución y migración de plataformas empresariales con geolocalización, OCR, reconocimiento facial, notificaciones push, APIs REST y almacenamiento local. Me enfoco en software mantenible y en convertir necesidades de negocio en soluciones técnicas robustas.',
        ],
      },
      {
        heading: 'Trayectoria',
        lines: [
          { label: 'IT Strategy · 2024 – hoy', value: 'Tech Lead Mobile (promovido)' },
          { label: 'IT Strategy · 2021 – 2024', value: 'Desarrollador Flutter' },
          { label: 'IOFractal · 2020 – 2021', value: 'Desarrollador de apps móviles' },
          { label: 'IOFractal · 2019', value: 'Desarrollador Flutter (prácticas)' },
        ],
      },
    ],
  },
  cv: {
    title: 'EXPEDIENTE',
    subtitle: 'Roberto Bolaños Zepeda',
    sections: [
      {
        heading: 'Educación e idiomas',
        lines: [
          { label: 'Carrera universitaria', value: '2017 – 2020, créditos al 100 %' },
          { label: 'Idiomas', value: 'Español nativo · inglés básico' },
        ],
        download: { label: 'Descargar CV (PDF)', href: CV_URL },
      },
    ],
  },
  'juntas:experiencia': {
    title: 'EXPERIENCIA',
    subtitle: 'Sala de juntas · proyector',
    sections: [
      {
        heading: 'IT Strategy · Tech Lead Mobile · 2024 – hoy',
        bullets: [
          'Responsable de iTeamApp, Kontrolia y GtrackApp, y del mantenimiento de proyectos legados en Kotlin y Swift.',
          'Defino arquitectura y estándares compartidos entre apps.',
          'Integro geolocalización, OCR, reconocimiento facial, notificaciones push, APIs REST y almacenamiento local.',
        ],
      },
      {
        heading: 'IT Strategy · Desarrollador Flutter · 2021 – 2024',
        bullets: ['Desarrollo de aplicaciones móviles empresariales en Flutter.'],
      },
      {
        heading: 'IOFractal · 2019 – 2021',
        bullets: ['Desarrollo de aplicaciones móviles en Flutter, desde prácticas hasta jornada completa.'],
      },
    ],
  },
  'juntas:equipo': {
    title: 'LIDERAZGO Y EQUIPO',
    subtitle: 'Sala de juntas · pizarrón',
    sections: [
      {
        paragraphs: [
          'Lidero un equipo de cuatro desarrolladores junior y semi-senior en apps Flutter y nativas, combinando desarrollo directo con mentoría.',
        ],
      },
      {
        heading: 'Cómo trabajo con el equipo',
        bullets: [
          'Guías, plantillas y checklists que el equipo aprende mientras los usa, sin bloquear el trabajo diario.',
          'Plantillas de merge request y checklists de revisión.',
          'Decisiones de arquitectura registradas en ADRs en todos los repositorios.',
        ],
      },
    ],
  },
  'servidores:cicd': {
    title: 'CI/CD',
    subtitle: 'Rack 01',
    sections: [
      {
        bullets: [
          'Flujo de CI/CD en GitLab con tres ramas de entorno.',
          'Conventional Commits y back-merges automáticos.',
          'GitLab Flow como estrategia de ramas.',
        ],
      },
    ],
  },
  'servidores:calidad': {
    title: 'CALIDAD Y SEGURIDAD',
    subtitle: 'Rack 02',
    sections: [
      {
        bullets: [
          'Pruebas E2E de humo con Maestro.',
          'Análisis de seguridad estático (SAST) con Semgrep en GitLab CI.',
          'Semgrep como etapa no bloqueante, desplegada por fases y con políticas documentadas.',
        ],
      },
    ],
  },
  'servidores:operacion': {
    title: 'OPERACIÓN',
    subtitle: 'Rack 03',
    sections: [
      {
        bullets: [
          'Migración del monitoreo de errores de Crashlytics a Sentry.',
          'Kill-switch con Remote Config para desactivar funciones en producción sin publicar una nueva versión.',
          'Shorebird para actualizaciones.',
        ],
      },
    ],
  },
  'servidores:automatizacion': {
    title: 'AUTOMATIZACIÓN',
    subtitle: 'Rack 04',
    sections: [
      {
        bullets: [
          'Scripts e integraciones en Python para automatizar tareas repetitivas del equipo.',
          'Integraciones con GitLab: gestión de issues, reportes de métricas y sincronización de datos.',
        ],
      },
    ],
  },
  'lab:arquitectura': {
    title: 'ARQUITECTURA',
    subtitle: 'Laboratorio técnico · pizarrón',
    sections: [
      {
        bullets: [
          'BLoC / Cubit con una guía común para todas las apps.',
          'Decisiones registradas en ADRs en todos los repositorios.',
          'Estándares compartidos entre apps: plantillas de merge request y checklists de revisión.',
        ],
      },
    ],
  },
  'lab:decisiones': {
    title: 'DECISIONES TÉCNICAS',
    subtitle: 'Laboratorio técnico · terminal',
    sections: [
      {
        heading: 'Rendimiento medido',
        paragraphs: [
          'Análisis de red con archivos HAR para decidir optimizaciones. Las mejoras vinieron de paralelizar llamadas y reducir latencia.',
        ],
      },
      {
        heading: 'Operación confiable',
        paragraphs: ['Kill-switch con Remote Config para apagar funciones en producción sin publicar una versión.'],
      },
      {
        heading: 'Seguridad gradual',
        paragraphs: ['Semgrep entró como etapa no bloqueante y se desplegó por fases.'],
      },
    ],
  },
  'lab:experimentos': {
    title: 'EXPERIMENTOS',
    subtitle: 'Laboratorio técnico · banco de pruebas',
    sections: [
      {
        heading: 'Este portafolio',
        paragraphs: [
          'Nivel 3D con React Three Fiber, Three.js y Zustand: geometría procedural, texturas de 32 px, temblor de vértices y render a baja resolución al estilo PS1.',
        ],
        links: [{ label: 'Código en GitHub', href: 'https://github.com/RobertoBoz/Portafolio_interactivo' }],
      },
      {
        heading: 'Componentes móviles',
        paragraphs: ['Componentes reutilizables de autenticación biométrica, cámara y mapas para acelerar nuevos proyectos.'],
      },
    ],
  },
  'comedor:pizarron': {
    title: 'TABLERO DE CORCHO',
    subtitle: 'Comedor / Descanso',
    sections: [
      {
        heading: 'Identidad visual',
        paragraphs: [
          'El personaje de este portafolio parte de una ilustración propia. Mi portafolio clásico usa una estética inspirada en Tim Burton.',
        ],
        links: [{ label: 'Portafolio clásico', href: 'https://robertoboz.github.io/Portafolio/' }],
      },
      {
        heading: 'Fuera del trabajo',
        bullets: ['Gustos y pasatiempos', 'Lo que estoy aprendiendo', 'Recomendaciones'],
        note: 'Contenido de ejemplo: sustituir en src/content/portfolio.ts (panel "comedor:pizarron").',
      },
    ],
  },
  'comedor:cafe': {
    title: 'CAFETERA',
    sections: [{ paragraphs: ['Todavía tibia. Alguien trabajó hasta tarde.'] }],
  },
}

export type PanelId = string

export function panelContent(id: PanelId): PanelContent {
  if (id.startsWith('project:')) {
    const project = PROJECTS.find((p) => p.id === id.slice('project:'.length))
    if (project) return projectPanel(project)
  }
  if (id.startsWith('stack:')) {
    const group = STACK.find((s) => s.id === id.slice('stack:'.length))
    if (group) {
      return {
        title: group.title.toUpperCase(),
        subtitle: 'Sala de desarrollo',
        sections: [{ bullets: group.items }],
      }
    }
  }
  return STATIC_PANELS[id] ?? { title: 'SIN DATOS', sections: [{ paragraphs: ['Este registro está vacío.'] }] }
}

/** Título corto de un panel, para listas e índices. */
export function panelTitle(id: PanelId): string {
  const content = panelContent(id)
  const title = content.title.charAt(0) + content.title.slice(1).toLowerCase()
  return title
}
