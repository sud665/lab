export interface Service {
  id: string
  name: string
  url: string
  description?: string
  status: 'active' | 'inactive' | 'pending'
  ga4Id?: string
  mixpanelToken?: string
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  serviceId: string
  date: string
  visitors: number
  pageViews: number
  avgSessionDuration: number
  bounceRate: number
  sources: TrafficSource[]
}

export interface TrafficSource {
  name: string
  visitors: number
  percentage: number
}

export interface DailyStats {
  date: string
  visitors: number
  pageViews: number
}

export interface ServiceRanking {
  service: Service
  totalVisitors: number
  totalPageViews: number
  avgSessionDuration: number
  bounceRate: number
  trend: number
  rank: number
}
