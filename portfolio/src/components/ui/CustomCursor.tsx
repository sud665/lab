'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCursor } from '@/components/providers/CursorProvider'

function getIsTouchDevice() {
  if (typeof window === 'undefined') return true
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

let touchDevice = true
const touchListeners = new Set<() => void>()

function subscribeTouchDevice(cb: () => void) {
  touchListeners.add(cb)
  return () => { touchListeners.delete(cb) }
}

function getTouchSnapshot() {
  return touchDevice
}

function getTouchServerSnapshot() {
  return true
}

export function CustomCursor() {
  const { isHovering, cursorText } = useCursor()
  const isTouchDevice = useSyncExternalStore(subscribeTouchDevice, getTouchSnapshot, getTouchServerSnapshot)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const isVisible = useMotionValue(0)

  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 })

  useEffect(() => {
    const value = getIsTouchDevice()
    if (value !== touchDevice) {
      touchDevice = value
      touchListeners.forEach(l => l())
    }
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      isVisible.set(1)
    }

    const handleMouseLeave = () => isVisible.set(0)
    const handleMouseEnter = () => isVisible.set(1)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY, isTouchDevice, isVisible])

  if (isTouchDevice) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible,
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHovering ? 60 : 8,
            height: isHovering ? 60 : 8,
          }}
          transition={{ duration: 0.2 }}
        >
          {isHovering && cursorText && (
            <span className="flex h-full items-center justify-center text-xs font-medium text-black">
              {cursorText}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible,
        }}
      >
        <motion.div
          className="rounded-full border border-white/50"
          animate={{
            width: isHovering ? 0 : 32,
            height: isHovering ? 0 : 32,
            opacity: isHovering ? 0 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  )
}
