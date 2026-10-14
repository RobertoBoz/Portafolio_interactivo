import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: el build funciona igual en local y en GitHub Pages
// (https://robertoboz.github.io/Portafolio_interactivo/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
