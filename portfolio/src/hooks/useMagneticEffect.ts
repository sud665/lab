'use client'

import { useEffect, type RefObject } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

interface MagneticEffect {
  x: MotionValue<number>
  y: MotionValue<number>
}

export function useMagneticEffect(
  ref: RefObject<HTMLElement | null>,
  strength = 0.3
): MagneticEffect {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * strength)
      y.set((e.clientY - centerY) * strength)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, x, y, strength])

  return { x: springX, y: springY }
}
