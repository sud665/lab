'use client'

import { ChatPattern } from '@/components/patterns'
import { mockChatMessages } from '@/data/mock'

export default function ChatbotPage() {
  const messages = mockChatMessages.map((m, index) => ({
    id: index + 1,
    role: (m.isOwn ? 'user' : 'assistant') as 'user' | 'assistant',
    content: m.message,
    timestamp: new Date(m.timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  return (
    <ChatPattern
      title="챗봇 상담"
      botName="AI 어시스턴트"
      messages={messages}
      placeholder="메시지를 입력하세요..."
    />
  )
}
