'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header, Footer, Container } from '@/components/layout'
import { Button, Card, Input, Modal, Badge, Avatar, Skeleton, Dropdown, DatePicker, TimePicker, Dialog, useDialog, Chart } from '@/components/ui'
import { ThemeToggle } from '@/components/providers'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDropdown, setSelectedDropdown] = useState<string>()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'alert' | 'confirm' | 'prompt'>('alert')
  const { alert, confirm, prompt, DialogComponent } = useDialog()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        navigation={[
          { label: 'Components', href: '#components', active: true },
          { label: 'Examples', href: '/examples/dashboard' },
          { label: 'GitHub', href: '#' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
            <Button size="sm">Get Started</Button>
          </div>
        }
        sticky
      />

      {/* Main Content */}
      <main className="flex-1 py-12">
        <Container>
          {/* Hero */}
          <section className="text-center mb-16">
            <Badge className="mb-4">Next.js 16 + Tailwind v4 + V2</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Wireframe Boilerplate V2
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              Grayscale 전용 와이어프레임 키트. 고객에게 빠르게 프로토타입을 시연하세요.
              이제 라이트/다크 모드, 차트, 폼, 테이블을 지원합니다.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg">Start Building</Button>
              <Button variant="outline" size="lg">View Examples</Button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Link href="/examples/auth">
                <Badge variant="outline">Auth Forms</Badge>
              </Link>
              <Link href="/examples/board">
                <Badge variant="outline">Board</Badge>
              </Link>
              <Link href="/examples/charts">
                <Badge variant="outline">Charts & Tables</Badge>
              </Link>
              <Link href="/examples/dashboard">
                <Badge variant="outline">Dashboard</Badge>
              </Link>
            </div>
          </section>

          {/* Buttons Section */}
          <section className="mb-12" id="components">
            <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
            <Card>
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <p className="text-sm text-neutral-400 mb-3">Variants</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="solid">Solid</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <p className="text-sm text-neutral-400 mb-3">Sizes</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* States */}
                <div>
                  <p className="text-sm text-neutral-400 mb-3">States</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button disabled>Disabled</Button>
                    <Button loading>Loading</Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Cards Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="default">
                <h3 className="font-semibold mb-2">Default Card</h3>
                <p className="text-sm text-neutral-400">
                  기본 카드 스타일입니다. 배경과 보더가 있습니다.
                </p>
              </Card>

              <Card variant="elevated">
                <h3 className="font-semibold mb-2">Elevated Card</h3>
                <p className="text-sm text-neutral-400">
                  그림자가 있는 띄워진 카드입니다.
                </p>
              </Card>

              <Card variant="outlined">
                <h3 className="font-semibold mb-2">Outlined Card</h3>
                <p className="text-sm text-neutral-400">
                  투명 배경에 보더만 있는 카드입니다.
                </p>
              </Card>
            </div>
          </section>

          {/* Card with Header/Footer */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Card with Header & Footer</h2>
            <Card
              header={<h3 className="font-semibold">Card Title</h3>}
              footer={
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button size="sm">Save</Button>
                </div>
              }
            >
              <p className="text-neutral-400">
                이 카드는 헤더와 푸터를 포함하고 있습니다.
                복잡한 컨텐츠를 구성할 때 유용합니다.
              </p>
            </Card>
          </section>

          {/* Form Elements Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Text Input" placeholder="Enter text..." />
                <Input label="Email" type="email" placeholder="email@example.com" />
                <Input label="Password" type="password" placeholder="********" />
                <Input
                  label="With Error"
                  placeholder="Invalid input"
                  error="This field is required"
                />
                <Input label="Disabled" placeholder="Disabled input" disabled />
                <Input
                  label="With Icon"
                  placeholder="Search..."
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  }
                />
              </div>
            </Card>
          </section>

          {/* Badges Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Badges</h2>
            <Card>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
              </div>
            </Card>
          </section>

          {/* Avatars Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Avatars</h2>
            <Card>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar size="sm" fallback="SM" />
                <Avatar size="md" fallback="MD" />
                <Avatar size="lg" fallback="LG" />
                <Avatar size="xl" fallback="XL" />
                <Avatar
                  size="lg"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="User"
                />
              </div>
            </Card>
          </section>

          {/* Skeleton Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Skeleton Loading</h2>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={120} />
                <div className="flex gap-2">
                  <Skeleton variant="rectangular" width={80} height={32} />
                  <Skeleton variant="rectangular" width={80} height={32} />
                </div>
              </div>
            </Card>
          </section>

          {/* Modal Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Modal</h2>
            <Card>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            </Card>

            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal Title"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>
                    Confirm
                  </Button>
                </>
              }
            >
              <p className="text-[var(--text-secondary)]">
                이것은 모달 컨텐츠입니다. ESC 키를 누르거나 배경을 클릭하면 닫힙니다.
              </p>
            </Modal>
          </section>

          {/* V2: Dropdown, DatePicker, TimePicker */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">V2: Form Pickers</h2>
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-2">Dropdown</p>
                  <Dropdown
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                      { value: 'option3', label: 'Option 3' },
                      { value: 'disabled', label: 'Disabled Option', disabled: true },
                    ]}
                    value={selectedDropdown}
                    onChange={setSelectedDropdown}
                    placeholder="Select an option..."
                    searchable
                    clearable
                  />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-2">DatePicker</p>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="Select a date..."
                  />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-2">TimePicker</p>
                  <TimePicker
                    value={selectedTime}
                    onChange={setSelectedTime}
                    placeholder="Select a time..."
                    step={30}
                  />
                </div>
              </div>
            </Card>
          </section>

          {/* V2: Dialog */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">V2: Dialog</h2>
            <Card>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={async () => {
                    await alert('Alert', 'This is an alert message.')
                    console.log('Alert closed')
                  }}
                >
                  Alert Dialog
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    const result = await confirm('Confirm', 'Are you sure you want to proceed?')
                    console.log('Confirm result:', result)
                  }}
                >
                  Confirm Dialog
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    const value = await prompt('Prompt', 'Enter your name:', '', 'Your name...')
                    console.log('Prompt result:', value)
                  }}
                >
                  Prompt Dialog
                </Button>
              </div>
            </Card>
            {DialogComponent}
          </section>

          {/* V2: Chart Preview */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">V2: Charts (Preview)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Bar Chart</h3>
                <Chart
                  type="bar"
                  data={[
                    { name: 'A', value: 400 },
                    { name: 'B', value: 300 },
                    { name: 'C', value: 600 },
                    { name: 'D', value: 200 },
                  ]}
                  height={200}
                  showLegend={false}
                />
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Line Chart</h3>
                <Chart
                  type="line"
                  data={[
                    { name: 'W1', value: 100 },
                    { name: 'W2', value: 300 },
                    { name: 'W3', value: 200 },
                    { name: 'W4', value: 400 },
                  ]}
                  height={200}
                  showLegend={false}
                />
              </Card>
            </div>
            <div className="mt-4 text-center">
              <Link href="/examples/charts">
                <Button variant="outline">View All Charts & Tables</Button>
              </Link>
            </div>
          </section>

          {/* Color Palette */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Color Palette (Grayscale Only)</h2>
            <Card>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400 mb-3">Background</p>
                  <div className="flex gap-2">
                    <div className="w-16 h-16 rounded-lg bg-black border border-neutral-800" title="#000000" />
                    <div className="w-16 h-16 rounded-lg bg-neutral-950" title="#0a0a0a" />
                    <div className="w-16 h-16 rounded-lg bg-neutral-900" title="#171717" />
                    <div className="w-16 h-16 rounded-lg bg-neutral-800" title="#262626" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 mb-3">Text & Border</p>
                  <div className="flex gap-2">
                    <div className="w-16 h-16 rounded-lg bg-white" title="#ffffff" />
                    <div className="w-16 h-16 rounded-lg bg-neutral-400" title="#a3a3a3" />
                    <div className="w-16 h-16 rounded-lg bg-neutral-500" title="#737373" />
                    <div className="w-16 h-16 rounded-lg bg-neutral-600" title="#525252" />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </Container>
      </main>

      {/* Footer */}
      <Footer
        links={[
          { label: 'Documentation', href: '#' },
          { label: 'Examples', href: '/examples/dashboard' },
          { label: 'GitHub', href: '#' },
        ]}
      />
    </div>
  )
}
