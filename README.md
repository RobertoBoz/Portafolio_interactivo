# Portafolio PS1 — Primera escena jugable

Portafolio interactivo de Roberto Bolaños inspirado en los survival horror de PlayStation 1: un cuarto abandonado de una empresa tecnológica, cámara fija, controles tipo tanque y un monitor CRT con el primer *developer log*.

## Cómo ejecutarlo

Requisitos: [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Otros comandos:

```bash
npm run build     # verifica TypeScript y genera dist/
npm run preview   # sirve el build de producción
```

Cada push a `main` se compila con el workflow de `.github/workflows/deploy.yml` y el resultado se publica en la rama `gh-pages`. Para verlo en línea, activa GitHub Pages una sola vez en **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / `(root)`**. Quedará en `https://robertoboz.github.io/Portafolio_interactivo/`.

## Controles

| Tecla | Acción |
| --- | --- |
| `W` / `↑` | Avanzar |
| `S` / `↓` | Retroceder |
| `A` / `←` | Girar a la izquierda |
| `D` / `→` | Girar a la derecha |
| `E` | Interactuar / cerrar |
| `Esc` | Cerrar la interfaz abierta |

## Arquitectura

```text
src/
├── App.tsx                     # Solo compone: canvas + HUD + teclas de interacción
├── main.tsx
├── components/
│   ├── GameCanvas.tsx          # <Canvas> a baja resolución + KeyboardControls
│   ├── FixedCamera.tsx         # Cámara fija en una esquina
│   ├── Room.tsx                # Piso, paredes, techo, mesa, archivero, cajas
│   ├── FluorescentLamp.tsx     # Luz de techo con parpadeo irregular
│   ├── Door.tsx                # Puerta cerrada + lector de tarjeta
│   ├── CRTMonitor.tsx          # Monitor con pantalla que brilla
│   ├── Character.tsx           # Movimiento tanque, colisiones y animación de caminar
│   ├── CharacterModel.tsx      # Modelo del personaje: polígonos facetados y texturas pintadas
│   └── ui/                     # Capa HTML: ayuda, indicador [E], diálogos
├── scenes/FirstRoom.tsx        # Niebla, luz ambiental y composición de la escena
├── store/gameStore.ts          # Zustand: interacción activa y objeto cercano
├── hooks/useInteractionKeys.ts # E / Esc abren y cierran interacciones
├── world/
│   ├── layout.ts               # Posiciones y medidas de todo el cuarto (fuente única)
│   ├── collision.ts            # Colisión círculo vs. paredes y cajas (AABB)
│   ├── interactions.ts         # Detección de monitor/puerta al alcance y de frente
│   ├── controls.ts             # Mapa de teclas de movimiento
│   ├── textures.ts             # Texturas de 32 px generadas en canvas (nearest)
│   ├── lowPoly.ts              # Geometrías y texturas del personaje (cara, camisa, cabello)
│   └── ps1Material.ts          # Vertex snapping estilo PS1
└── styles/game.css
```

- **Flujo de estado:** el personaje calcula cada fotograma qué objeto tiene al alcance y lo escribe en el store (`nearbyInteraction`). El hook `useInteractionKeys` lee el store al presionar `E` y abre o cierra `activeInteraction`. Mientras `isInteracting` es `true`, el personaje ignora el movimiento.
- **Colisiones:** el personaje es un círculo de 0.32 m. Cada eje se resuelve por separado para que se deslice por las paredes en lugar de quedarse atorado.
- **Sin modelos externos:** todo se construye con geometrías de three.js. Las texturas se generan en tiempo de ejecución, así que la carpeta `public/` no necesita assets todavía.

### Por qué cada librería

- **three / @react-three/fiber:** render 3D declarativo con React.
- **@react-three/drei:** `PerspectiveCamera` (cámara por defecto con `makeDefault`) y `KeyboardControls` (estado del teclado sin listeners manuales).
- **zustand:** estado compartido entre el canvas 3D y la interfaz HTML sin re-renderizar la escena.

### Decisiones respecto a la especificación

- **Cámara dentro del cuarto:** la posición sugerida `(6, 5, 8)` queda fuera de las paredes de un cuarto de 10 × 8 m. La cámara está en `(4.5, 2.9, 3.5)`, en la esquina junto al techo, mirando a `(-1, 0.6, -1)`. Así se ve el cuarto completo con perspectiva cinematográfica y la niebla de 4–14 m funciona como se planeó. Todo se ajusta en `src/world/layout.ts`.
- **Baja resolución:** el canvas se renderiza a unas 360 líneas verticales sin importar el tamaño de la ventana y se escala con `image-rendering: pixelated`. Se usa `flat` (sin tone mapping) para conservar colores planos.
- **Personaje:** prismas de 5–6 caras, torso hexagonal y cabeza facetada con `flatShading`. La cara (ojos, cejas, lentes) está pintada en una textura de 32 px proyectada de frente, como en los modelos de PS1. Lleva sombrero fedora, cabello largo, camisa negra arremangada y pantalón gris. Una luz de relleno desde la cámara lo mantiene legible en la penumbra.
- **Toques PS1 extra:** temblor de vértices (*vertex snapping*), animación de caminar cuantizada a pocos fotogramas, sombra circular simple, scanlines y viñeta.

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
