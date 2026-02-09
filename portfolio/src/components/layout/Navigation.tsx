'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'

const navLinks = [
  { label: 'Hero', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
  { label: 'Blog', href: '/blog' },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks
      .filter((l) => l.href.startsWith('#'))
      .map((l) => l.href.slice(1))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const sorted = visible.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          )
          setActiveSection(sorted[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = useCallback(
    (href: string) => {
      setIsMobileOpen(false)
      if (href.startsWith('#')) {
        const el = document.getElementById(href.slice(1))
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    []
  )

  return (
    <>
      <motion.header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-colors duration-300',
          isScrolled
            ? 'border-b border-[var(--border-default)] bg-[var(--bg-primary)]/80 backdrop-blur-xl'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#hero')
            }}
            className="text-lg font-bold text-[var(--text-primary)]"
          >
            Portfolio
          </a>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href.startsWith('#') &&
                activeSection === link.href.slice(1)
              const isBlog = link.href === '/blog'

              return (
                <li key={link.href}>
                  {isBlog ? (
                    <a
                      href={link.href}
                      className={cn(
                        'relative rounded-lg px-3 py-2 text-sm transition-colors',
                        'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className={cn(
                        'relative rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--accent)]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col px-6 py-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href.startsWith('#') &&
                  activeSection === link.href.slice(1)
                const isBlog = link.href === '/blog'

                return (
                  <li key={link.href}>
                    {isBlog ? (
                      <a
                        href={link.href}
                        className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className={cn(
                          'block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                          isActive
                            ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
