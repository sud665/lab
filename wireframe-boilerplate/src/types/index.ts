// Navigation
export interface NavItem {
  label: string
  href: string
  active?: boolean
}

// Sidebar
export interface SidebarItem {
  icon?: React.ReactNode
  label: string
  href: string
  active?: boolean
}

// Footer
export interface FooterLink {
  label: string
  href: string
}

export interface SocialLink {
  icon: React.ReactNode
  href: string
  label: string
}

// Common
export type Size = 'sm' | 'md' | 'lg'
export type SizeWithXL = 'sm' | 'md' | 'lg' | 'xl'

// ====== V2 Types ======

// Theme
export type Theme = 'light' | 'dark'

// Dropdown
export interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

// Dialog
export type DialogType = 'alert' | 'confirm' | 'prompt'

// Table
export interface TableColumn<T = unknown> {
  key: keyof T | string
  header: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

// Chart
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export type ChartType = 'bar' | 'line' | 'pie'

// Board
export interface BoardItem {
  id: string | number
  title: string
  author: string
  date: string | Date
  views?: number
  comments?: number
  category?: string
  pinned?: boolean
}

// Auth Forms
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms?: boolean
}

// ====== AI Page Generator Types ======

// Image Marker
export interface ImageMarker {
  fullMatch: string
  description: string
  width: number
  height: number
  index: number
}

// Image Generation Result
export interface ImageGenerationResult {
  marker: ImageMarker
  url: string | null
  error?: string
}

// SSE Event Types for Image Generation
export type ImageSSEEventType =
  | 'image_start'
  | 'image_progress'
  | 'images_done'

export interface ImageStartEvent {
  type: 'image_start'
  total: number
}

export interface ImageProgressEvent {
  type: 'image_progress'
  current: number
  total: number
  description: string
  url: string | null
}

export interface ImagesDoneEvent {
  type: 'images_done'
  successful: number
  failed: number
}

export type ImageSSEEvent = ImageStartEvent | ImageProgressEvent | ImagesDoneEvent

// Generation State
export interface GenerationState {
  isGenerating: boolean
  isGeneratingImages: boolean
  code: string
  imageProgress: {
    current: number
    total: number
    description?: string
  } | null
}
