import Replicate from 'replicate'
import type { ImageMarker, ImageGenerationResult } from '@/types'
import { getPlaceholderUrl, validateDimensions } from './imageMarkers'

// Flux Schnell model - fast generation (~2-4 seconds)
const FLUX_MODEL = 'black-forest-labs/flux-schnell'

// Initialize Replicate client
function getReplicateClient(): Replicate | null {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    console.warn('REPLICATE_API_TOKEN not set, image generation will be skipped')
    return null
  }
  return new Replicate({ auth: token })
}

/**
 * Generate a single image using Flux model
 */
export async function generateImage(
  marker: ImageMarker
): Promise<ImageGenerationResult> {
  const replicate = getReplicateClient()

  if (!replicate) {
    return {
      marker,
      url: null,
      error: 'Replicate API token not configured',
    }
  }

  // Validate dimensions
  if (!validateDimensions(marker.width, marker.height)) {
    return {
      marker,
      url: getPlaceholderUrl(marker),
      error: `Invalid dimensions: ${marker.width}x${marker.height}`,
    }
  }

  try {
    // Enhance prompt for better web-suitable images
    const enhancedPrompt = `${marker.description}, high quality, professional, clean, modern, web design suitable`

    const output = await replicate.run(FLUX_MODEL, {
      input: {
        prompt: enhancedPrompt,
        // Flux schnell uses aspect_ratio instead of exact dimensions
        aspect_ratio: getAspectRatio(marker.width, marker.height),
        num_outputs: 1,
        output_format: 'webp',
        output_quality: 80,
      },
    })

    // Output is an array of URLs
    const urls = output as string[]

    if (!urls || urls.length === 0) {
      throw new Error('No image URL returned')
    }

    return {
      marker,
      url: urls[0],
    }
  } catch (error) {
    console.error('Image generation failed:', error)
    return {
      marker,
      url: getPlaceholderUrl(marker),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate multiple images in parallel with batching
 */
export async function generateImages(
  markers: ImageMarker[],
  onProgress?: (current: number, total: number, result: ImageGenerationResult) => void,
  batchSize: number = 3
): Promise<ImageGenerationResult[]> {
  const results: ImageGenerationResult[] = []
  let completed = 0

  // Process in batches to avoid rate limiting
  for (let i = 0; i < markers.length; i += batchSize) {
    const batch = markers.slice(i, i + batchSize)

    const batchResults = await Promise.all(
      batch.map(async (marker) => {
        const result = await generateImage(marker)
        completed++
        onProgress?.(completed, markers.length, result)
        return result
      })
    )

    results.push(...batchResults)
  }

  return results
}

/**
 * Convert dimensions to Flux-compatible aspect ratio
 */
function getAspectRatio(width: number, height: number): string {
  const ratio = width / height

  // Supported aspect ratios by Flux
  const aspectRatios = [
    { ratio: 1, value: '1:1' },
    { ratio: 16/9, value: '16:9' },
    { ratio: 9/16, value: '9:16' },
    { ratio: 4/3, value: '4:3' },
    { ratio: 3/4, value: '3:4' },
    { ratio: 21/9, value: '21:9' },
    { ratio: 9/21, value: '9:21' },
    { ratio: 3/2, value: '3:2' },
    { ratio: 2/3, value: '2:3' },
  ]

  // Find closest aspect ratio
  let closest = aspectRatios[0]
  let minDiff = Math.abs(ratio - closest.ratio)

  for (const ar of aspectRatios) {
    const diff = Math.abs(ratio - ar.ratio)
    if (diff < minDiff) {
      minDiff = diff
      closest = ar
    }
  }

  return closest.value
}

/**
 * Check if Replicate is configured
 */
export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN
}
