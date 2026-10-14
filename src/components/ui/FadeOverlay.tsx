import { useGameStore } from '../../store/gameStore'

/** Fundido a negro al cruzar puertas. */
export function FadeOverlay() {
  const transitioning = useGameStore((state) => state.transitioning)
  return <div className={`fade${transitioning ? ' fade--on' : ''}`} aria-hidden="true" />
}
