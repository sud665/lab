'use client';

interface SidebarProps {
  onSelectTemplate: (template: string) => void;
  activeTemplate: string | null;
}

const templates = [
  { id: 'landing', icon: '🚀', label: 'Landing Page', prompt: 'Create a modern SaaS landing page with a hero section featuring gradient background, feature highlights with icons, pricing cards, testimonials, and a footer with links.' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard', prompt: 'Create a dashboard with a sidebar navigation, header with user profile, stat cards showing key metrics, a line chart area, and a recent activity table.' },
  { id: 'portfolio', icon: '👤', label: 'Portfolio', prompt: 'Create a personal portfolio page with a hero section, about me, skills grid, project showcase with cards, and contact section.' },
  { id: 'blog', icon: '📝', label: 'Blog', prompt: 'Create a blog homepage with a featured post hero, grid of article cards with thumbnails, categories sidebar, and newsletter signup.' },
  { id: 'ecommerce', icon: '🛒', label: 'E-commerce', prompt: 'Create a product listing page with a header, filter sidebar, product grid with cards showing images, prices, and ratings, and pagination.' },
  { id: 'contact', icon: '✉️', label: 'Contact', prompt: 'Create a contact page with a split layout: left side with company info and map placeholder, right side with a contact form.' },
];

export function Sidebar({ onSelectTemplate, activeTemplate }: SidebarProps) {
  return (
    <aside className="w-16 h-full flex flex-col items-center py-4 bg-[var(--bg-primary)] border-r border-[var(--border-default)]">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md">
        A
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-[var(--border-default)] mb-4" />

      {/* Templates */}
      <nav className="flex-1 flex flex-col gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.prompt)}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-lg
              transition-all duration-200 relative group
              ${activeTemplate === template.id
                ? 'bg-[var(--accent-light)] shadow-sm'
                : 'hover:bg-[var(--bg-tertiary)]'
              }
            `}
            title={template.label}
          >
            <span>{template.icon}</span>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              {template.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--text-primary)]" />
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col gap-2">
        <div className="w-8 h-px bg-[var(--border-default)] mb-2" />

        {/* Settings */}
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
