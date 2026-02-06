'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatPatternProps {
  title: string
  botName?: string
  messages: ChatMessage[]
  placeholder?: string
}

export function ChatPattern({
  title,
  botName = 'AI 어시스턴트',
  messages: initialMessages,
  placeholder = '메시지를 입력하세요...',
}: ChatPatternProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }

    const botMessage: ChatMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: '감사합니다. 말씀하신 내용을 확인하고 있습니다. 잠시만 기다려주세요.',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border-default)]">
        <Avatar size="sm" fallback="AI" />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-[var(--text-muted)]">{botName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 max-w-[80%]',
              message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            )}
          >
            {message.role === 'assistant' && <Avatar size="sm" fallback="AI" />}
            <div
              className={cn(
                'rounded-2xl px-4 py-2.5 text-sm',
                message.role === 'user'
                  ? 'bg-white/10 rounded-br-md'
                  : 'bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-bl-md'
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--border-default)]">
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-focus)] outline-none resize-none"
            rows={1}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
