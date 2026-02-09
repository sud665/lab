import { Github, Linkedin, Mail } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
