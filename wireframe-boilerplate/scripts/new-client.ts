#!/usr/bin/env npx tsx

import { input, select, checkbox } from '@inquirer/prompts'
import { execSync } from 'child_process'
import { writeFileSync, rmSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dirname, '..')

// Page definitions
const ALL_PAGES = [
  { id: 'dashboard', label: '대시보드', icon: 'dashboard', href: '/dashboard', path: 'src/app/(pages)/dashboard' },
  { id: 'members', label: '회원 관리', icon: 'users', href: '/members', path: 'src/app/(pages)/members' },
  { id: 'products', label: '상품 관리', icon: 'package', href: '/products', path: 'src/app/(pages)/products' },
  { id: 'reservations', label: '예약 관리', icon: 'calendar', href: '/reservations', path: 'src/app/(pages)/reservations' },
  { id: 'attendance', label: '출석 관리', icon: 'clipboard', href: '/attendance', path: 'src/app/(pages)/attendance' },
  { id: 'board', label: '게시판', icon: 'board', href: '/board', path: 'src/app/(pages)/board' },
  { id: 'chatbot', label: 'AI 챗봇', icon: 'chat', href: '/chatbot', path: 'src/app/(pages)/chatbot' },
  { id: 'notifications', label: '알림', icon: 'bell', href: '/notifications', path: 'src/app/(pages)/notifications' },
  { id: 'profile', label: '마이페이지', icon: 'profile', href: '/profile', path: 'src/app/(pages)/profile' },
  { id: 'settings', label: '설정', icon: 'settings', href: '/settings', path: 'src/app/(pages)/settings' },
] as const

// Preset definitions
const PRESETS: Record<string, string[]> = {
  admin: ['dashboard', 'members', 'products', 'settings'],
  platform: ['dashboard', 'members', 'products', 'reservations', 'chatbot', 'notifications', 'profile', 'settings'],
  academy: ['dashboard', 'members', 'attendance', 'products', 'settings'],
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function main() {
  console.log('\n🏗️  Wireframe Factory - 새 고객 와이어프레임\n')

  // 1. Client name
  const clientName = await input({
    message: '고객명을 입력하세요:',
    validate: (v) => v.length > 0 || '고객명은 필수입니다',
  })

  const slug = toSlug(clientName)
  const branchName = `client/${slug}`

  console.log(`\n→ 브랜치: ${branchName}\n`)

  // 2. Preset selection
  const preset = await select({
    message: '프로젝트 타입을 선택하세요:',
    choices: [
      { name: '관리자 대시보드', value: 'admin', description: '대시보드, 회원관리, 상품관리, 설정' },
      { name: '서비스 플랫폼', value: 'platform', description: '대시보드, 회원, 상품, 예약, 챗봇, 알림, 마이페이지, 설정' },
      { name: '학원/도장 관리', value: 'academy', description: '대시보드, 학생관리, 출석관리, 상품, 설정' },
      { name: '커스텀 (직접 선택)', value: 'custom', description: '필요한 페이지를 직접 선택합니다' },
    ],
  })

  // 3. Page selection
  let selectedPages: string[]

  if (preset === 'custom') {
    selectedPages = await checkbox({
      message: '포함할 페이지를 선택하세요:',
      choices: ALL_PAGES.map((p) => ({
        name: p.label,
        value: p.id,
        checked: p.id === 'dashboard' || p.id === 'settings',
      })),
    })
  } else {
    selectedPages = PRESETS[preset]
    console.log(`\n✅ 선택된 페이지: ${selectedPages.map((id) => ALL_PAGES.find((p) => p.id === id)?.label).join(', ')}`)
  }

  // 4. Create branch
  console.log('\n→ 브랜치 생성 중...')
  execSync(`git checkout -b ${branchName}`, { cwd: ROOT, stdio: 'pipe' })

  // 5. Remove unselected pages
  const pagesToRemove = ALL_PAGES.filter((p) => !selectedPages.includes(p.id))
  for (const page of pagesToRemove) {
    const pagePath = join(ROOT, page.path)
    if (existsSync(pagePath)) {
      rmSync(pagePath, { recursive: true, force: true })
      console.log(`  ✖ 제거: ${page.label}`)
    }
  }

  // 6. Update navigation.ts
  const selectedNavItems = ALL_PAGES
    .filter((p) => selectedPages.includes(p.id))
    .map((p) => `    { id: '${p.id}', icon: '${p.icon}' as const, label: '${p.label}', href: '${p.href}' },`)
    .join('\n')

  const navContent = `import { Icons, type IconName } from './icons'

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

export const navigationConfig: NavigationConfig = {
  title: '${clientName}',
  items: [
${selectedNavItems}
  ],
}

export function toSidebarItems(config: NavigationConfig, currentPath: string) {
  return config.items.map((item) => ({
    icon: Icons[item.icon],
    label: item.label,
    href: item.href,
    active: currentPath === item.href || currentPath.startsWith(item.href + '/'),
  }))
}
`

  writeFileSync(join(ROOT, 'src/config/navigation.ts'), navContent)
  console.log(`\n✅ 네비게이션 설정 업데이트 (${selectedPages.length}개 메뉴)`)

  // 7. Commit & Push
  console.log('\n→ Commit & Push...')
  execSync('git add -A', { cwd: ROOT, stdio: 'pipe' })
  execSync(`git commit -m "feat: setup wireframe for ${clientName}"`, { cwd: ROOT, stdio: 'pipe' })

  try {
    execSync(`git push -u origin ${branchName}`, { cwd: ROOT, stdio: 'pipe' })
    console.log('\n✅ Push 완료!')
    console.log(`\n🌐 Vercel Preview가 자동으로 배포됩니다.`)
    console.log(`   브랜치: ${branchName}`)
  } catch {
    console.log('\n⚠️  Push 실패 - 수동으로 push해주세요:')
    console.log(`   git push -u origin ${branchName}`)
  }

  console.log('\n🎉 완료!\n')
}

main().catch(console.error)
