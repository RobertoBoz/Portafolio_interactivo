import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { useGameStore } from './store/gameStore'
import { player } from './world/player'
import './styles/game.css'

declare global {
  interface Window {
    __portafolio?: { store: typeof useGameStore; player: typeof player }
  }
}

// ?debug expone el estado del juego en la consola para pruebas automatizadas.
if (new URLSearchParams(window.location.search).has('debug')) {
  window.__portafolio = { store: useGameStore, player }
}

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento #root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
