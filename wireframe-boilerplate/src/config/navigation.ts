import { Icons, type IconName } from './icons'

export interface NavigationItem {
  id: string
  icon: IconName
  label: string
  href: string
}

export interface NavigationConfig {
  items: NavigationItem[]
  title: string
}

// Default navigation config
export const navigationConfig: NavigationConfig = {
  title: 'Wireframe',
  items: [
    { id: 'dashboard', icon: 'dashboard', label: '대시보드', href: '/dashboard' },
    { id: 'members', icon: 'users', label: '회원 관리', href: '/members' },
    { id: 'products', icon: 'package', label: '상품 관리', href: '/products' },
    { id: 'reservations', icon: 'calendar', label: '예약 관리', href: '/reservations' },
    { id: 'attendance', icon: 'clipboard', label: '출석 관리', href: '/attendance' },
    { id: 'board', icon: 'board', label: '게시판', href: '/board' },
    { id: 'chatbot', icon: 'chat', label: 'AI 챗봇', href: '/chatbot' },
    { id: 'notifications', icon: 'bell', label: '알림', href: '/notifications' },
    { id: 'profile', icon: 'profile', label: '마이페이지', href: '/profile' },
    { id: 'settings', icon: 'settings', label: '설정', href: '/settings' },
  ],
}

// Helper to convert to SidebarItem format
export function toSidebarItems(config: NavigationConfig, currentPath: string) {
  return config.items.map((item) => ({
    icon: Icons[item.icon],
    label: item.label,
    href: item.href,
    active: currentPath === item.href || currentPath.startsWith(item.href + '/'),
  }))
}
