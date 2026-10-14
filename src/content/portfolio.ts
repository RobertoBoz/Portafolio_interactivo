/**
 * Contenido del portafolio que aparece en las terminales y documentos.
 * Descripciones genéricas, ajustadas a la confidencialidad de la empresa.
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
}

export type PanelContent = {
  title: string
  subtitle?: string
  sections: PanelSection[]
}

export type ProjectId = 'iteam' | 'kontrolia' | 'gtrack' | 'logistica' | 'comunicacion' | 'cursos'

export type PanelId = 'welcome' | 'contact' | 'about' | 'cv' | `project:${ProjectId}`

const CV_URL = `${import.meta.env.BASE_URL}cv/Roberto-Bolanos-Zepeda-CV.pdf`

export const PROJECTS: Record<ProjectId, { name: string; tech: string; description: string; highlights: string[] }> = {
  iteam: {
    name: 'iTeamApp',
    tech: 'Flutter',
    description: 'App para equipos que trabajan fuera de oficina, con captura de información y funcionamiento sin conexión.',
    highlights: ['Sincronización al recuperar conexión', 'Geolocalización y mapas', 'Almacenamiento local'],
  },
  kontrolia: {
    name: 'Kontrolia',
    tech: 'Flutter',
    description: 'App de autoservicio para colaboradores, con registro de asistencia y trámites desde el celular.',
    highlights: ['Reconocimiento facial', 'Solicitudes y consulta de documentos', 'Notificaciones push'],
  },
  gtrack: {
    name: 'GtrackApp',
    tech: 'Flutter',
    description: 'App de seguimiento de ubicación en tiempo real.',
    highlights: ['Línea de tiempo de ubicaciones', 'Registro de incidencias', 'Mapas'],
  },
  logistica: {
    name: 'App logística (legado)',
    tech: 'Kotlin',
    description: 'App nativa para registrar operaciones con evidencia fotográfica y uso sin conexión.',
    highlights: ['Evidencia fotográfica', 'Funcionamiento sin conexión', 'Mantenimiento de código legado'],
  },
  comunicacion: {
    name: 'Comunicación interna (legado)',
    tech: 'Kotlin y Swift',
    description: 'App nativa en Android e iOS con mensajería y notificaciones push.',
    highlights: ['Android e iOS nativos', 'Notificaciones push', 'Mesa de ayuda'],
  },
  cursos: {
    name: 'Plataforma de cursos',
    tech: 'Ionic',
    description: 'App híbrida de cursos en línea, adaptada a la identidad de la organización.',
    highlights: ['Basada en MoodleApp personalizada', 'Marca y acceso propios'],
  },
}

/** Qué proyecto muestra cada monitor de la sala de Desarrollo, en el orden de los escritorios. */
export const DEV_MONITORS: ProjectId[] = ['iteam', 'kontrolia', 'gtrack', 'logistica', 'comunicacion', 'cursos']

const STATIC_PANELS: Record<Exclude<PanelId, `project:${ProjectId}`>, PanelContent> = {
  welcome: {
    title: 'DEVELOPER LOG #001',
    sections: [
      {
        lines: [
          { label: 'Nombre', value: 'Roberto Bolaños Zepeda' },
          { label: 'Rol', value: 'Tech Lead Mobile' },
          { label: 'Especialidad', value: 'Flutter y desarrollo móvil' },
          { label: 'Base', value: 'Pachuca, Hidalgo · remoto' },
          { label: 'Estado del sistema', value: 'operativo' },
        ],
      },
      {
        heading: 'Indicaciones',
        bullets: [
          'Desarrollo: proyectos en los que he trabajado.',
          'Recepción: datos de contacto.',
          'Oficina privada: sobre mí y CV. Requiere tarjeta de acceso.',
          'Presiona M para ver el plano de la planta.',
        ],
      },
    ],
  },
  contact: {
    title: 'DIRECTORIO',
    subtitle: 'Terminal de recepción',
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
    title: 'SOBRE MÍ',
    subtitle: 'Tech Lead Mobile · Ingeniero de Software',
    sections: [
      {
        paragraphs: [
          'Tech Lead e ingeniero de software especializado en soluciones empresariales para plataformas móviles y backend. Trabajo con Flutter, Android (Kotlin/Java), iOS (Swift), Node.js y Python.',
          'Lidero un equipo de cuatro desarrolladores y combino desarrollo directo con arquitectura, análisis técnico y mentoría. Me enfoco en software mantenible y en convertir necesidades de negocio en soluciones técnicas robustas.',
        ],
      },
      {
        heading: 'Experiencia',
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
        heading: 'Habilidades',
        bullets: [
          'Móvil: Flutter · Dart · BLoC/Cubit · Kotlin · Swift · Ionic',
          'Backend y scripts: Node.js · Python · APIs REST',
          'Calidad: GitLab CI/CD · Maestro (E2E) · Semgrep (SAST) · Sentry',
        ],
      },
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
}

export function panelContent(id: PanelId): PanelContent {
  if (id.startsWith('project:')) {
    const project = PROJECTS[id.slice('project:'.length) as ProjectId]
    return {
      title: project.name.toUpperCase(),
      subtitle: project.tech,
      sections: [{ paragraphs: [project.description] }, { heading: 'Puntos clave', bullets: project.highlights }],
    }
  }
  return STATIC_PANELS[id as keyof typeof STATIC_PANELS]
}
