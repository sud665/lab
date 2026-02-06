'use client'

import { useState } from 'react'
import { Header, Footer, Container } from '@/components/layout'
import { Button, Card, Input, Modal } from '@/components/ui'

export default function FormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        navigation={[
          { label: 'Home', href: '/' },
          { label: 'Examples', href: '/examples/dashboard' },
          { label: 'Form', href: '/examples/form', active: true },
        ]}
        sticky
      />

      {/* Main Content */}
      <main className="flex-1 py-12">
        <Container size="sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-neutral-400">
              궁금한 점이 있으시면 아래 양식을 작성해 주세요.
            </p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Company"
                placeholder="Your company (optional)"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                  Message
                </label>
                <textarea
                  className="w-full h-32 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 transition-colors duration-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 resize-none"
                  placeholder="Tell us what you need..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" size="lg" className="flex-1">
                  Send Message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setFormData({ name: '', email: '', company: '', message: '' })}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>

          {/* Additional Form Examples */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">More Form Patterns</h2>

            <div className="space-y-6">
              {/* Login Form */}
              <Card
                header={<h3 className="font-semibold">Login Form</h3>}
              >
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="********"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-neutral-400">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-700 bg-neutral-900"
                      />
                      Remember me
                    </label>
                    <a href="#" className="text-sm text-neutral-400 hover:text-white">
                      Forgot password?
                    </a>
                  </div>
                  <Button className="w-full">Sign In</Button>
                </div>
              </Card>

              {/* Search Form */}
              <Card
                header={<h3 className="font-semibold">Search Form</h3>}
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for anything..."
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    }
                    className="flex-1"
                  />
                  <Button>Search</Button>
                </div>
              </Card>

              {/* Newsletter Form */}
              <Card
                header={<h3 className="font-semibold">Newsletter</h3>}
              >
                <p className="text-sm text-neutral-400 mb-4">
                  최신 소식과 업데이트를 받아보세요.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button>Subscribe</Button>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      {/* Success Modal */}
      <Modal
        open={submitted}
        onClose={() => setSubmitted(false)}
        title="Message Sent!"
        footer={
          <Button onClick={() => setSubmitted(false)}>Close</Button>
        }
      >
        <p className="text-neutral-400">
          메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.
        </p>
      </Modal>

      {/* Footer */}
      <Footer
        links={[
          { label: 'Home', href: '/' },
          { label: 'Examples', href: '/examples/dashboard' },
        ]}
      />
    </div>
  )
}
