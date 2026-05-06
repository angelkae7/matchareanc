// Utility pour créer et jouer des sons simples avec Web Audio API
let audioContext = null
let lastSoundTime = 0

const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('AudioContext not supported:', e)
      return null
    }
  }

  // Resume context if suspended (required by some browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(e => console.warn('Failed to resume AudioContext:', e))
  }

  return audioContext
}

const playSound = (frequency, duration = 200, type = 'sine', volume = 0.3) => {
  const ctx = getAudioContext()
  if (!ctx) return

  // Simple debouncing to prevent too many sounds at once
  const now = Date.now()
  if (now - lastSoundTime < 50) return
  lastSoundTime = now

  try {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration / 1000)
  } catch (e) {
    console.warn('Sound playback error:', e)
  }
}

// Sons pour différentes actions
export const soundClick = () => playSound(800, 100, 'sine', 0.2)
export const soundDragStart = () => playSound(600, 150, 'sine', 0.25)
export const soundDropCorrect = () => {
  playSound(800, 100, 'sine', 0.3)
  setTimeout(() => playSound(1000, 100, 'sine', 0.3), 100)
  setTimeout(() => playSound(1200, 100, 'sine', 0.3), 200)
}
export const soundDropWrong = () => {
  playSound(300, 200, 'sine', 0.3)
  setTimeout(() => playSound(250, 200, 'sine', 0.3), 150)
}
export const soundWin = () => {
  playSound(800, 200, 'sine', 0.3)
  setTimeout(() => playSound(1000, 200, 'sine', 0.3), 150)
  setTimeout(() => playSound(1200, 300, 'sine', 0.3), 300)
}
export const soundLose = () => {
  playSound(400, 300, 'sine', 0.3)
  setTimeout(() => playSound(350, 300, 'sine', 0.3), 200)
  setTimeout(() => playSound(300, 400, 'sine', 0.3), 400)
}
