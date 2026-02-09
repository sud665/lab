'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading, Button, Input, Textarea } from '@/components/ui'
import { sendContactEmail } from '@/actions/contact'

interface ContactFormData {
  name: string
  email: string
  message: string
}

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { icon: Github, label: 'GitHub', value: 'github.com', href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com', href: 'https://linkedin.com' },
]

export function ContactSection() {
  const [submitState, setSubmitState] = useState<{
    status: 'idle' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await sendContactEmail(data)
      if (result.success) {
        setSubmitState({ status: 'success', message: result.message })
        reset()
      } else {
        setSubmitState({ status: 'error', message: result.message })
      }
    } catch {
      setSubmitState({ status: 'error', message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          title="Contact"
          subtitle="프로젝트 논의나 궁금한 점이 있다면 연락주세요"
        />

        <div className="grid gap-12 md:grid-cols-5">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <Input
                  id="name"
                  label="Name"
                  placeholder="홍길동"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-[var(--color-danger)]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="hello@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[var(--color-danger)]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  id="message"
                  label="Message"
                  placeholder="메시지를 입력하세요..."
                  rows={5}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'At least 10 characters' },
                  })}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-[var(--color-danger)]">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 sm:w-auto">
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </Button>

              {/* Status message */}
              {submitState.status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex items-center gap-2 rounded-lg p-3 text-sm',
                    submitState.status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  )}
                >
                  {submitState.status === 'success' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {submitState.message}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6 md:col-span-2"
          >
            <div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                Get in Touch
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                새로운 프로젝트, 협업 제안, 또는 단순한 인사도 환영합니다.
                가능한 빠른 시간 내에 답변 드리겠습니다.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] transition-colors group-hover:bg-[var(--accent-muted)]">
                    <Icon
                      size={18}
                      className="text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{label}</p>
                    <p className="text-sm text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
