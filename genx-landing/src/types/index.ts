// Project types shared across components
export interface Project {
  id: string
  name: string
  os: 'foundryos' | 'launchos'
  createdAt: Date
  isActive: boolean
}
