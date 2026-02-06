import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE } from '@/lib/prompts'
import { extractImageMarkers, replaceImageMarkers } from '@/lib/imageMarkers'
import { generateImages, isReplicateConfigured } from '@/lib/replicate'
import type { ImageGenerationResult } from '@/types'

// Initialize Anthropic client
const anthropic = new Anthropic()

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const stream = new ReadableStream({
      async start(controller) {
        // Helper to send SSE events
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          )
        }

        let generatedCode = ''

        try {
          // Phase 1: Generate code with Claude
          sendEvent('status', { phase: 'generating', message: 'Generating code...' })

          const messageStream = await anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8192,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: USER_PROMPT_TEMPLATE(prompt),
              },
            ],
          })

          // Stream code chunks
          for await (const event of messageStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text
              generatedCode += text
              sendEvent('code', { chunk: text })
            }
          }

          sendEvent('code_done', { code: generatedCode })

          // Phase 2: Extract and process image markers
          const markers = extractImageMarkers(generatedCode)

          if (markers.length === 0 || !isReplicateConfigured()) {
            // No images or Replicate not configured
            if (markers.length > 0 && !isReplicateConfigured()) {
              sendEvent('status', {
                phase: 'skipped',
                message: 'Image generation skipped (Replicate not configured)',
              })
            }
            sendEvent('done', { code: generatedCode, imagesGenerated: 0 })
            controller.close()
            return
          }

          // Phase 3: Generate images
          sendEvent('image_start', { total: markers.length })
          sendEvent('status', {
            phase: 'images',
            message: `Generating ${markers.length} image(s)...`,
          })

          const results: ImageGenerationResult[] = []
          let successful = 0
          let failed = 0

          await generateImages(
            markers,
            (current, total, result) => {
              results.push(result)
              if (result.url && !result.error) {
                successful++
              } else {
                failed++
              }
              sendEvent('image_progress', {
                current,
                total,
                description: result.marker.description,
                url: result.url,
                error: result.error,
              })
            }
          )

          // Replace markers with actual URLs
          const finalCode = replaceImageMarkers(generatedCode, results)

          sendEvent('images_done', { successful, failed })
          sendEvent('done', {
            code: finalCode,
            imagesGenerated: successful,
            imagesFailed: failed,
          })
        } catch (error) {
          console.error('Generation error:', error)
          sendEvent('error', {
            message: error instanceof Error ? error.message : 'Generation failed',
          })
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Request error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
