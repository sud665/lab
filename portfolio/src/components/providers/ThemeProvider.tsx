'use client'

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

let themeValue: Theme = 'dark'
const themeListeners = new Set<() => void>()

function notifyListeners() {
  themeListeners.forEach(l => l())
}

function subscribeTheme(cb: () => void) {
  themeListeners.add(cb)
  return () => { themeListeners.delete(cb) }
}

function getThemeSnapshot() {
  return themeValue
}

function getServerThemeSnapshot() {
  return 'dark' as Theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot)

  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme') as Theme | null
    if (stored && stored !== themeValue) {
      themeValue = stored
      notifyListeners()
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    themeValue = themeValue === 'dark' ? 'light' : 'dark'
    notifyListeners()
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
