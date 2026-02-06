import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { extractCodeFromMarkdown } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.create({
            model,
            max_tokens: 8192,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
          });

          let fullText = '';

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const text = event.delta.text;
              fullText += text;

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'code_delta', content: text })}\n\n`)
              );
            }
          }

          // Extract code from markdown if Claude wrapped it
          const extractedCode = extractCodeFromMarkdown(fullText);

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done', code: extractedCode })}\n\n`)
          );
          controller.close();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
