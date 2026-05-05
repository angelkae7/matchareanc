import { useMemo } from "react"
import { motion } from "framer-motion"

const COLORS = ["#fffb00", "#95ff3e", "#cbff53", "#ffed4eb9", "#b5f700"]
const CHARS  = ["★", "✦", "✸", "⭐"]

function rand(min, max) {
  return min + Math.random() * (max - min)
}

export default function Stars({ origin }) {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id:       i,
      dx:       rand(-130, 130),
      dy:       rand(-200, -80),
      size:     rand(14, 26),
      delay:    rand(0, 0.2),
      duration: rand(0.6, 1.2),
      rotation: rand(-200, 200),
      scale:    rand(0.2, 0.8),
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
        zIndex: 9999,
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