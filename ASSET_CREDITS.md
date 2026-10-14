# Créditos de recursos

El nivel no usa modelos, texturas, sonidos ni imágenes de terceros. Todo se genera en el código:

| Recurso | Origen | Licencia | Notas |
| --- | --- | --- | --- |
| Geometría de cuartos, muebles, puertas y personaje | Procedural, en `src/components` y `src/world/lowPoly.ts` | Propia | Primitivas de three.js (cajas, cilindros, conos, esferas) |
| Texturas (losetas, muros, madera, pantallas, letreros, pizarrones, corcho, racks) | Generadas en canvas de 8–128 px, en `src/world/officeTextures.ts`, `textures.ts` y `lowPoly.ts` | Propia | Filtrado `NearestFilter` |
| Fuente **VT323** | Peter Hull, servida por [Google Fonts](https://fonts.google.com/specimen/VT323) | [SIL Open Font License 1.1](https://openfontlicense.org) | Se carga desde Google Fonts en `index.html`; sin modificaciones. Si no carga, se usa la monoespaciada del sistema |
| `docs/plano-planta-baja.png` | Imagen de referencia del autor del portafolio | Del autor | Solo documentación; no se usa en el juego |
| `public/cv/Roberto-Bolanos-Zepeda-CV.pdf` | CV del autor | Del autor | — |

No se usan recursos de Resident Evil, Silent Hill ni de otros juegos comerciales. La oficina, su distribución, los letreros y los carteles son originales.

## Si se agregan recursos externos

1. Verifica la licencia en la página original del recurso; no supongas que es CC0.
2. Prioriza CC0 (por ejemplo Kenney, Poly Haven, ambientCG, Quaternius) y descarga el archivo al repositorio en lugar de enlazarlo.
3. Agrega una fila a esta tabla con nombre, autor, URL, licencia y modificaciones.
