'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface CursorContextType {
  isHovering: boolean
  cursorText: string
  setCursorHover: (hovering: boolean, text?: string) => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')

  const setCursorHover = useCallback((hovering: boolean, text = '') => {
    setIsHovering(hovering)
    setCursorText(text)
  }, [])

  return (
    <CursorContext.Provider value={{ isHovering, cursorText, setCursorHover }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}
