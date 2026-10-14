# Portafolio PS1 — Oficina de desarrollo

Portafolio interactivo de Roberto Bolaños inspirado en los survival horror de PlayStation 1. Recorres de noche la planta baja de una oficina de desarrollo con cámaras fijas y controles tipo tanque. En cada cuarto hay una sección del portafolio: proyectos, contacto, sobre mí y CV.

![Plano de la planta baja](docs/plano-planta-baja.png)

## Cómo ejecutarlo

Requisitos: [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

```bash
npm run build     # verifica TypeScript y genera dist/
npm run preview   # sirve el build de producción
```

Cada push a `main` se compila con `.github/workflows/deploy.yml` y el resultado se publica en la rama `gh-pages`. Para verlo en línea, activa GitHub Pages una sola vez en **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / `(root)`**. Quedará en `https://robertoboz.github.io/Portafolio_interactivo/`.

### Parámetros de URL

- `?sala=desarrollo`: empieza en un cuarto construido (`lobby`, `recepcion`, `desarrollo`, `oficina`). Sirve para compartir un enlace directo a una sección.
- `?debug`: expone `window.__portafolio` (store y posición del personaje) para pruebas automatizadas.

## Controles

| Tecla | Acción |
| --- | --- |
| `W` / `↑` | Avanzar |
| `S` / `↓` | Retroceder |
| `A` / `←` | Girar a la izquierda |
| `D` / `→` | Girar a la derecha |
| `E` | Interactuar / continuar / cerrar |
| `M` | Abrir o cerrar el plano |
| `Esc` | Cerrar la interfaz abierta |

## Qué hay en cada cuarto

| # | Cuarto | Contenido | Estado |
| --- | --- | --- | --- |
| 1 | Lobby principal | Terminal con el *Developer Log* y el muro "Build · Ship · Improve" | ✅ |
| 2 | Recepción | Contacto (correo, GitHub, LinkedIn, portafolio clásico) y la tarjeta de acceso | ✅ |
| 3 | Oficina privada | Sobre mí, experiencia y expediente con CV descargable. Se abre con la tarjeta | ✅ |
| 4 | Desarrollo | Un monitor por proyecto: iTeamApp, Kontrolia, GtrackApp, app logística, comunicación interna y plataforma de cursos | ✅ |
| 5 | Sala de juntas | Liderazgo y prácticas de ingeniería | 🔒 |
| 6 | Comedor / Descanso | Lado personal | 🔒 |
| 7 | Sala de servidores | Stack y CI/CD | 🔒 |
| 8 | Baños | Easter egg | 🔒 |
| 9 | Almacén | Componentes reutilizables y automatización | 🔒 |
| 10 | Diseño UX/UI | Identidad visual e ilustración | 🔒 |
| 11 | Recursos humanos | Educación e idiomas | 🔒 |

Los textos están en `src/content/portfolio.ts` y usan las descripciones ajustadas a la confidencialidad de la empresa.

## Arquitectura

```text
src/
├── App.tsx                       # Solo compone: canvas + HUD + teclas
├── content/portfolio.ts          # Textos de terminales, proyectos y CV
├── store/gameStore.ts            # Zustand: cuarto actual, inventario, puertas, paneles, mapa, transiciones
├── hooks/useInteractionKeys.ts   # E, M y Esc
├── world/
│   ├── building.ts               # Cuartos, puertas, cámaras por zona, muebles sólidos (fuente única)
│   ├── collision.ts              # Colisión círculo vs. muros y muebles del cuarto actual
│   ├── interactions.ts           # Objetos interactuables y detección "al alcance y de frente"
│   ├── player.ts                 # Posición del personaje compartida fuera de React
│   ├── lowPoly.ts                # Geometrías y texturas del personaje
│   ├── officeTextures.ts         # Losetas, muros, madera, pantallas y letreros (32 px, nearest)
│   ├── textures.ts / ps1Material.ts
│   └── controls.ts
├── scenes/Office.tsx             # Niebla, luces globales, cámara, edificio y personaje
├── components/
│   ├── Building.tsx              # Monta los cuartos construidos; solo el actual es visible
│   ├── CameraRig.tsx             # Corta entre cámaras fijas según la zona del personaje
│   ├── Character.tsx / CharacterModel.tsx
│   ├── rooms/                    # RoomShell, DoorPanel, props y un archivo por cuarto
│   └── ui/                       # Terminal, mensajes, plano, título del cuarto, inventario, fundido
└── styles/game.css
public/cv/                        # CV en PDF que se descarga desde el expediente
```

- **Coordenadas:** el plano usa metros, con X hacia el este y Z hacia la entrada (sur). Cada cuarto es un rectángulo; las puertas viven en los muros compartidos.
- **Puertas:** al usar una puerta la pantalla funde a negro, el personaje aparece del otro lado mirando hacia dentro y se muestra el nombre del cuarto.
- **Cámaras:** cada cuarto tiene una o más zonas. El lobby tiene dos y la cámara corta de golpe al cruzar de una a otra. La cámara de cada cuarto está en la esquina opuesta a su puerta para que el personaje se vea al entrar.
- **Rendimiento:** solo el cuarto actual es visible, así que solo sus luces cuentan.
- **Para construir un cuarto nuevo:** márcalo `built: true` en `building.ts` con sus cámaras y obstáculos, cambia el `lock` de su puerta a `'none'`, crea su componente en `components/rooms/` y regístralo en `Building.tsx`.

### Personaje

Prismas de 5–6 caras, torso hexagonal y cabeza facetada con `flatShading`. La cara (ojos, cejas, lentes) está pintada en una textura de 32 px proyectada de frente, como en los modelos de PS1. Lleva sombrero fedora, cabello largo, camisa negra arremangada y pantalón gris.

### Estética

Render a unas 360 líneas escalado con `image-rendering: pixelated`, sin antialiasing ni tone mapping, *vertex snapping*, texturas diminutas, niebla, plafones que parpadean, scanlines y viñeta. Cada cuarto tiene una luz de relleno desde su cámara para que el personaje se lea en la penumbra.

### Librerías

- **three / @react-three/fiber:** render 3D declarativo con React.
- **@react-three/drei:** `PerspectiveCamera` y `KeyboardControls`.
- **zustand:** estado compartido entre la escena 3D y la interfaz HTML.

---

## Especificación original

## Objetivo

Crear una primera versión de un portafolio interactivo inspirado en los survival horror de PlayStation 1.

La primera entrega debe mostrar:

- Un cuarto 3D.
- Un personaje controlable.
- Cámara fija.
- Movimiento tipo tanque.
- Iluminación oscura.
- Niebla.
- Estética low-poly.
- Una puerta cerrada.
- Un monitor CRT interactivo.

No se deben implementar todavía inventario, mapa, múltiples habitaciones, combate ni enemigos.

---

## Stack

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- @react-three/drei
- Zustand

---

## Inicio del proyecto

```bash
npm create vite@latest portfolio-ps1 -- --template react-ts
cd portfolio-ps1
npm install
npm install three @react-three/fiber @react-three/drei zustand
npm install -D @types/three
npm run dev
```

---

## Estructura inicial

```text
portfolio-ps1/
├── public/
│   ├── models/
│   │   ├── room.glb
│   │   └── character.glb
│   ├── textures/
│   └── audio/
├── src/
│   ├── components/
│   │   ├── Character.tsx
│   │   ├── FixedCamera.tsx
│   │   ├── Room.tsx
│   │   ├── Door.tsx
│   │   └── CRTMonitor.tsx
│   ├── scenes/
│   │   └── FirstRoom.tsx
│   ├── store/
│   │   └── gameStore.ts
│   ├── styles/
│   │   └── game.css
│   ├── App.tsx
│   └── main.tsx
├── README.md
└── package.json
```

---

## Escena

La escena debe representar un cuarto abandonado de una empresa tecnológica.

Elementos mínimos:

- Piso de concreto.
- Cuatro paredes.
- Una lámpara fluorescente.
- Una mesa.
- Un monitor CRT.
- Una puerta cerrada.
- Un personaje low-poly.
- Niebla ligera.
- Luz ambiental tenue.

La escena puede construirse primero con geometrías simples de Three.js. No es obligatorio usar modelos de Blender en esta etapa.

---

## Personaje

El personaje debe:

- Estar visible en tercera persona.
- Poder girar a la izquierda y derecha.
- Avanzar y retroceder.
- No atravesar las paredes.
- Mantener los pies sobre el suelo.

Controles:

```text
W o Flecha arriba: avanzar
S o Flecha abajo: retroceder
A o Flecha izquierda: girar a la izquierda
D o Flecha derecha: girar a la derecha
E: interactuar
```

El movimiento debe sentirse pesado y lento, similar a los survival horror clásicos.

---

## Cámara

Usar una cámara fija colocada en una esquina del cuarto.

La cámara debe:

- Mostrar al personaje y los elementos principales.
- No seguir directamente al personaje.
- Mantener siempre el mismo ángulo.
- Tener una perspectiva cinematográfica.

Posición inicial sugerida:

```ts
camera.position.set(6, 5, 8);
camera.lookAt(0, 1, 0);
```

---

## Estética PS1

Aplicar una apariencia retro usando:

- Modelos low-poly.
- Texturas pequeñas.
- Renderizado a baja resolución.
- Niebla.
- Pocas luces.
- Sombras simples.
- Animaciones limitadas.

Configuración sugerida:

```tsx
<Canvas
  camera={{ position: [6, 5, 8], fov: 45 }}
  dpr={1}
  gl={{ antialias: false }}
>
```

Agregar niebla:

```tsx
<fog attach="fog" args={["#111111", 4, 14]} />
```

Usar filtrado nearest-neighbor para las texturas.

---

## Interacción con el monitor

Cuando el personaje esté cerca del monitor y presione `E`, mostrar una interfaz HTML.

Contenido:

```text
DEVELOPER LOG #001

Nombre: Roberto Bolaños
Rol: Mobile Tech Lead
Especialidad: Flutter y desarrollo móvil

Estado del sistema: operativo
```

La interfaz debe incluir una opción para cerrarse.

Mientras el monitor esté abierto:

- El personaje no debe moverse.
- La escena debe permanecer visible detrás.
- Puede agregarse un efecto CRT con scanlines.

---

## Puerta

La puerta debe permanecer cerrada.

Cuando el personaje se acerque y presione `E`, mostrar:

```text
La puerta está cerrada.

Parece necesitar una tarjeta de acceso.
```

En esta primera versión no existe todavía la tarjeta.

---

## Estado global

Crear un store sencillo con Zustand.

Estados mínimos:

```ts
type GameState = {
  isInteracting: boolean;
  activeInteraction: "monitor" | "door" | null;
  setInteraction: (
    interaction: "monitor" | "door" | null
  ) => void;
};
```

---

## Criterios de aceptación

La primera versión estará terminada cuando:

- El proyecto se ejecute con `npm run dev`.
- Se vea un cuarto completo.
- El personaje aparezca dentro del cuarto.
- El personaje pueda moverse con controles tipo tanque.
- El personaje no atraviese las paredes.
- La cámara permanezca fija.
- Exista iluminación oscura y niebla.
- El monitor pueda inspeccionarse.
- La puerta muestre un mensaje al interactuar.
- La interfaz funcione en escritorio.
- No existan errores en consola.

---

## Restricciones

- No copiar modelos, sonidos, nombres, logotipos ni escenarios de Resident Evil o Silent Hill.
- Crear una experiencia original.
- No implementar enemigos.
- No implementar combate.
- No implementar más habitaciones.
- No agregar librerías sin justificar su uso.
- Mantener los componentes pequeños y separados.
- Usar TypeScript estricto.
- Evitar lógica compleja dentro de `App.tsx`.

---

## Prompt para Claude Code o Codex

```text
Lee este README completo antes de modificar el proyecto.

Construye una primera escena jugable para un portafolio 3D inspirado en los survival horror de PlayStation 1.

Implementa únicamente:

1. Un cuarto 3D.
2. Un personaje visible.
3. Movimiento tipo tanque.
4. Cámara fija.
5. Colisiones básicas.
6. Iluminación oscura.
7. Niebla.
8. Una puerta cerrada.
9. Un monitor CRT interactivo.

Usa React, TypeScript, Vite, Three.js, React Three Fiber, Drei y Zustand.

Empieza usando geometrías simples. No dependas de modelos externos para que la escena funcione.

Divide el código en componentes:

- Character
- FixedCamera
- Room
- Door
- CRTMonitor
- FirstRoom

Antes de escribir código, explica brevemente la arquitectura que vas a utilizar.

Después implementa el proyecto completo.

No agregues inventario, mapa, enemigos, combate ni múltiples habitaciones.

Al terminar:

- Ejecuta el build.
- Corrige errores de TypeScript.
- Revisa que no existan errores en consola.
- Actualiza este README con las instrucciones para ejecutar el proyecto.
```

---

## Siguiente entrega

Después de completar esta primera escena se podrá implementar:

- Animación del personaje.
- Cambio de cámaras.
- Inventario.
- Tarjeta de acceso.
- Segunda habitación.
- Sistema de proyectos.
- Audio ambiental.
- Efectos CRT más avanzados.
