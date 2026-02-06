'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Button, Badge } from '@/components/ui'

export default function SettingsPage() {
  const [ga4GlobalId, setGa4GlobalId] = useState('')
  const [mixpanelGlobalToken, setMixpanelGlobalToken] = useState('')

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">트래킹 설정 및 연동 가이드</p>
      </div>

      {/* Global Tracking Settings */}
      <Card>
        <CardHeader>
          <CardTitle>글로벌 트래킹 설정</CardTitle>
          <CardDescription>
            모든 서비스에 공통으로 적용할 트래킹 ID를 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Google Analytics 4 기본 측정 ID"
            value={ga4GlobalId}
            onChange={(e) => setGa4GlobalId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
          />
          <Input
            label="Mixpanel 기본 Token"
            value={mixpanelGlobalToken}
            onChange={(e) => setMixpanelGlobalToken(e.target.value)}
            placeholder="your_mixpanel_token"
          />
          <Button>설정 저장</Button>
        </CardContent>
      </Card>

      {/* GA4 Integration Guide */}
      <Card id="tracking-guide">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Google Analytics 4 연동 가이드</CardTitle>
              <CardDescription>각 랜딩페이지에 GA4를 설치하는 방법</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">1. GA4 측정 ID 얻기</h4>
            <ol className="list-decimal list-inside text-sm text-[var(--text-secondary)] space-y-1">
              <li>Google Analytics 접속 → Admin → Property Settings</li>
              <li>Data Streams → Web → 측정 ID 복사 (G-XXXXXXXXXX 형식)</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Next.js 프로젝트에 설치</h4>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-[var(--text-secondary)]">
{`// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          \`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. 커스텀 이벤트 추적 (선택)</h4>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-[var(--text-secondary)]">
{`// 버튼 클릭 추적
const handleClick = () => {
  gtag('event', 'cta_click', {
    'event_category': 'engagement',
    'event_label': 'signup_button'
  });
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mixpanel Integration Guide */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Mixpanel 연동 가이드</CardTitle>
              <CardDescription>상세한 사용자 행동 분석을 위한 Mixpanel 설치</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">1. Mixpanel Token 얻기</h4>
            <ol className="list-decimal list-inside text-sm text-[var(--text-secondary)] space-y-1">
              <li>Mixpanel 접속 → Project Settings → Project Token 복사</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. npm 패키지 설치</h4>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
              <pre className="text-sm font-mono text-[var(--text-secondary)]">
{`npm install mixpanel-browser`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. 초기화 및 이벤트 추적</h4>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-[var(--text-secondary)]">
{`// lib/mixpanel.ts
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_PROJECT_TOKEN', {
  track_pageview: true,
  persistence: 'localStorage'
});

export const trackEvent = (name: string, props?: object) => {
  mixpanel.track(name, props);
};

export const identifyUser = (userId: string, traits?: object) => {
  mixpanel.identify(userId);
  if (traits) mixpanel.people.set(traits);
};

// 사용 예시
trackEvent('Button Clicked', { button_name: 'signup' });`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">4. 주요 추적 이벤트 예시</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                <Badge variant="info" size="sm" className="mb-2">Page View</Badge>
                <p className="text-[var(--text-secondary)]">페이지 조회 자동 추적</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                <Badge variant="info" size="sm" className="mb-2">CTA Click</Badge>
                <p className="text-[var(--text-secondary)]">버튼/링크 클릭 추적</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                <Badge variant="info" size="sm" className="mb-2">Form Submit</Badge>
                <p className="text-[var(--text-secondary)]">폼 제출 추적</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                <Badge variant="info" size="sm" className="mb-2">Scroll Depth</Badge>
                <p className="text-[var(--text-secondary)]">스크롤 깊이 추적</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vercel Analytics (Optional) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 22.525H0l12-21.05 12 21.05z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Vercel Analytics (추천)</CardTitle>
              <CardDescription>Vercel 배포 시 자동 연동되는 분석 도구</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. 패키지 설치</h4>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
              <pre className="text-sm font-mono text-[var(--text-secondary)]">
{`npm install @vercel/analytics`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. 컴포넌트 추가</h4>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-[var(--text-secondary)]">
{`// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}`}
              </pre>
            </div>
          </div>

          <div className="p-4 bg-[var(--color-info)]/10 border border-[var(--color-info)]/30 rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong>Tip:</strong> Vercel Analytics는 무료 플랜에서 월 2,500 이벤트까지 제공됩니다.
              간단한 검증에는 GA4 + Vercel Analytics 조합을 권장합니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 흐름</CardTitle>
          <CardDescription>각 랜딩페이지에서 Super Admin으로 데이터가 수집되는 과정</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
            <div className="flex items-center justify-between text-center">
              <div className="flex-1">
                <div className="w-16 h-16 mx-auto bg-[var(--chart-1)]/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-[var(--chart-1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <p className="text-sm font-medium">랜딩페이지</p>
                <p className="text-xs text-[var(--text-muted)]">GA4 + Mixpanel SDK</p>
              </div>
              <div className="flex-shrink-0 px-4">
                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="w-16 h-16 mx-auto bg-[var(--chart-2)]/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-[var(--chart-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <p className="text-sm font-medium">GA4 / Mixpanel</p>
                <p className="text-xs text-[var(--text-muted)]">데이터 수집/저장</p>
              </div>
              <div className="flex-shrink-0 px-4">
                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="w-16 h-16 mx-auto bg-[var(--chart-3)]/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-[var(--chart-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-[var(--text-muted)]">통합 대시보드</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-4">
            * 현재 버전은 Mock 데이터를 사용합니다. GA4/Mixpanel API 연동은 추후 업데이트 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
