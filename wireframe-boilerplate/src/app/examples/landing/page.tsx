import { Header, Footer, Container } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'

const features = [
  {
    title: 'Lightning Fast',
    description: 'Turbopack으로 빌드된 초고속 개발 환경을 경험하세요.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Simple & Clean',
    description: 'Grayscale 디자인으로 구조에만 집중할 수 있습니다.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
  },
  {
    title: 'Fully Responsive',
    description: '모바일부터 데스크톱까지 완벽한 반응형 디자인.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
]

export default function LandingExample() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        navigation={[
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'About', href: '#about' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        }
        sticky
      />

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <Container size="md">
          <div className="text-center">
            <Badge className="mb-6">Now in Beta</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Build Faster with
              <br />
              <span className="text-neutral-400">Wireframes</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-xl mx-auto mb-10">
              아이디어를 몇 시간이 아닌 몇 분 만에 프로토타입으로 만드세요.
              고객에게 빠르게 시연하고 피드백을 받으세요.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">Watch Demo</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-neutral-950">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              빠른 프로토타이핑을 위한 모든 도구가 준비되어 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} variant="outlined" padding="lg">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <Container size="sm">
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-neutral-400 mb-8">
                지금 바로 시작하세요. 신용카드 없이 무료로 체험할 수 있습니다.
              </p>
              <Button size="lg">Start Building for Free</Button>
            </div>
          </Card>
        </Container>
      </section>

      {/* Footer */}
      <Footer
        links={[
          { label: 'Privacy', href: '#' },
          { label: 'Terms', href: '#' },
          { label: 'Contact', href: '#' },
        ]}
        social={[
          {
            icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
            href: '#',
            label: 'GitHub',
          },
          {
            icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
            href: '#',
            label: 'Twitter',
          },
        ]}
      />
    </div>
  )
}
