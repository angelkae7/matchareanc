import { useMemo } from "react"
import { motion } from "framer-motion"

const COLORS = ["#fffb00", "#95ff3e", "#cbff53", "#ffed4eb9", "#b5f700"]
const CHARS  = ["★", "✦", "✸", "⭐"]

function rand(min, max) {
  return min + Math.random() * (max - min)
}

export default function Stars({ origin }) {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id:       i,
      dx:       rand(-80, 80),
      dy:       rand(-280, -180),
      size:     rand(16, 28),
      delay:    rand(0, 0.15),
      duration: rand(0.8, 1.4),
      rotation: rand(-360, 360),
      scale:    rand(0.3, 1),
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      char:     CHARS[Math.floor(Math.random() * CHARS.length)],
    }))
  , [])

  if (!origin) return null

  return (
    <div
      style={{
        position: "fixed",
        left: origin.x,
        top: origin.y,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
          animate={{
            x:       p.dx,
            y:       p.dy,
            scale:   p.scale,
            rotate:  p.rotation,
            opacity: 0,
          }}
          transition={{
            duration: p.duration,
            delay:    p.delay,
            ease:     "easeOut",
          }}
          style={{
            position:   "absolute",
            left:       0,
            top:        0,
            fontSize:   p.size,
            color:      p.color,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  )
}