'use client'

import { useState, useRef, useCallback } from 'react'
import { Header, Footer, Container } from '@/components/layout'
import { Button, Card, Input } from '@/components/ui'
import { ThemeToggle } from '@/components/providers'
import type { GenerationState } from '@/types'

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    isGeneratingImages: false,
    code: '',
    imageProgress: null,
  })
  const [error, setError] = useState<string | null>(null)
  const codeRef = useRef<HTMLPreElement>(null)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || state.isGenerating) return

    setError(null)
    setState({
      isGenerating: true,
      isGeneratingImages: false,
      code: '',
      imageProgress: null,
    })

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventType = line.slice(7)
            const dataLine = lines[lines.indexOf(line) + 1]
            if (dataLine?.startsWith('data: ')) {
              const data = JSON.parse(dataLine.slice(6))
              handleSSEEvent(eventType, data)
            }
          } else if (line.startsWith('data: ')) {
            // Handle data without explicit event type
            try {
              const data = JSON.parse(line.slice(6))
              if (data.chunk) {
                setState(prev => ({
                  ...prev,
                  code: prev.code + data.chunk,
                }))
              }
            } catch {
              // Ignore parse errors for incomplete data
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState(prev => ({ ...prev, isGenerating: false, isGeneratingImages: false }))
    }
  }, [prompt, state.isGenerating])

  const handleSSEEvent = useCallback((event: string, data: unknown) => {
    const eventData = data as Record<string, unknown>

    switch (event) {
      case 'code':
        setState(prev => ({
          ...prev,
          code: prev.code + (eventData.chunk as string),
        }))
        break

      case 'code_done':
        setState(prev => ({
          ...prev,
          code: eventData.code as string,
        }))
        break

      case 'image_start':
        setState(prev => ({
          ...prev,
          isGeneratingImages: true,
          imageProgress: {
            current: 0,
            total: eventData.total as number,
          },
        }))
        break

      case 'image_progress':
        setState(prev => ({
          ...prev,
          imageProgress: {
            current: eventData.current as number,
            total: eventData.total as number,
            description: eventData.description as string,
          },
        }))
        break

      case 'images_done':
        setState(prev => ({
          ...prev,
          isGeneratingImages: false,
        }))
        break

      case 'done':
        setState(prev => ({
          ...prev,
          isGenerating: false,
          isGeneratingImages: false,
          code: eventData.code as string,
          imageProgress: null,
        }))
        break

      case 'error':
        setError(eventData.message as string)
        setState(prev => ({
          ...prev,
          isGenerating: false,
          isGeneratingImages: false,
        }))
        break
    }
  }, [])

  const copyCode = useCallback(() => {
    if (state.code) {
      navigator.clipboard.writeText(state.code)
    }
  }, [state.code])

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navigation={[
          { label: 'Components', href: '/' },
          { label: 'Generator', href: '/generator', active: true },
          { label: 'Examples', href: '/examples/dashboard' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
          </div>
        }
        sticky
      />

      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Page Generator</h1>
              <p className="text-[var(--text-secondary)]">
                Describe your page and let AI generate the code with images
              </p>
            </div>

            {/* Input Section */}
            <Card className="mb-6">
              <div className="space-y-4">
                <Input
                  label="What would you like to create?"
                  placeholder="e.g., A modern coffee shop landing page with hero section, menu, and contact form..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={state.isGenerating}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || state.isGenerating}
                    loading={state.isGenerating && !state.isGeneratingImages}
                  >
                    {state.isGenerating
                      ? state.isGeneratingImages
                        ? 'Generating Images...'
                        : 'Generating Code...'
                      : 'Generate Page'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="mb-6 border-red-500/50 bg-red-500/10">
                <p className="text-red-400">{error}</p>
              </Card>
            )}

            {/* Image Progress */}
            {state.imageProgress && (
              <Card className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Generating images...
                    </span>
                    <span className="text-sm font-mono">
                      {state.imageProgress.current} / {state.imageProgress.total}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{
                        width: `${(state.imageProgress.current / state.imageProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                  {state.imageProgress.description && (
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {state.imageProgress.description}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Code Output */}
            {state.code && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Generated Code</h2>
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    Copy Code
                  </Button>
                </div>
                <pre
                  ref={codeRef}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-neutral-300 max-h-[500px] overflow-y-auto"
                >
                  {state.code}
                </pre>
              </Card>
            )}
          </div>
        </Container>
      </main>

      <Footer
        links={[
          { label: 'Documentation', href: '#' },
          { label: 'GitHub', href: '#' },
        ]}
      />
    </div>
  )
}
