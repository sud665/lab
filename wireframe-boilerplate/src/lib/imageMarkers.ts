import type { ImageMarker, ImageGenerationResult } from '@/types'

/**
 * Image Marker Pattern
 * Format: {/* IMG: description | WIDTHxHEIGHT *\/}
 * Example: {/* IMG: A serene mountain landscape at sunset | 1200x800 *\/}
 */
const IMAGE_MARKER_REGEX = /\{\/\*\s*IMG:\s*([^|]+)\s*\|\s*(\d+)x(\d+)\s*\*\/\}/g

/**
 * Extract image markers from generated code
 */
export function extractImageMarkers(code: string): ImageMarker[] {
  const markers: ImageMarker[] = []
  let match: RegExpExecArray | null
  let index = 0

  // Reset regex state
  IMAGE_MARKER_REGEX.lastIndex = 0

  while ((match = IMAGE_MARKER_REGEX.exec(code)) !== null) {
    markers.push({
      fullMatch: match[0],
      description: match[1].trim(),
      width: parseInt(match[2], 10),
      height: parseInt(match[3], 10),
      index: index++,
    })
  }

  return markers
}

/**
 * Replace image markers with actual URLs
 */
export function replaceImageMarkers(
  code: string,
  results: ImageGenerationResult[]
): string {
  let updatedCode = code

  for (const result of results) {
    const url = result.url || getPlaceholderUrl(result.marker)
    // Escape special regex characters in the marker
    const escapedMarker = result.marker.fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    updatedCode = updatedCode.replace(new RegExp(escapedMarker, 'g'), url)
  }

  return updatedCode
}

/**
 * Get placeholder URL for failed image generation
 */
export function getPlaceholderUrl(marker: ImageMarker): string {
  const encodedText = encodeURIComponent(marker.description.slice(0, 30))
  return `https://placehold.co/${marker.width}x${marker.height}/1a1a1a/666666?text=${encodedText}`
}

/**
 * Validate image dimensions
 */
export function validateDimensions(width: number, height: number): boolean {
  const MIN_SIZE = 64
  const MAX_SIZE = 2048
  return (
    width >= MIN_SIZE &&
    width <= MAX_SIZE &&
    height >= MIN_SIZE &&
    height <= MAX_SIZE
  )
}

/**
 * Batch markers for parallel processing
 */
export function batchMarkers(markers: ImageMarker[], batchSize: number = 3): ImageMarker[][] {
  const batches: ImageMarker[][] = []
  for (let i = 0; i < markers.length; i += batchSize) {
    batches.push(markers.slice(i, i + batchSize))
  }
  return batches
}
