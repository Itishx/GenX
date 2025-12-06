import { useEffect, useCallback } from 'react'
import AviateSyncService, { InsightSource } from '@/lib/AviateSyncService'

/**
 * Hook for integrating sync service with components
 * Automatically handles real-time updates across all systems
 */
export const useSyncInsights = () => {
  // Listen for AvioNote updates
  useEffect(() => {
    const handleAvioNoteUpdated = (event: any) => {
      console.log('📝 AvioNote updated:', event.detail)
      // Component can react to note updates if needed
    }

    // Listen for progress updates
    const handleProgressUpdated = (event: any) => {
      console.log('📊 Progress updated:', event.detail)
      // Component can react to progress updates if needed
    }

    window.addEventListener('avioNoteUpdated', handleAvioNoteUpdated)
    window.addEventListener('progressUpdated', handleProgressUpdated)

    return () => {
      window.removeEventListener('avioNoteUpdated', handleAvioNoteUpdated)
      window.removeEventListener('progressUpdated', handleProgressUpdated)
    }
  }, [])

  /**
   * Add an insight from any source
   * Automatically syncs to all systems
   */
  const addInsight = useCallback((
    content: string,
    stageId: string,
    projectId: string,
    type: 'chat' | 'ai-summary' | 'manual' = 'manual'
  ) => {
    if (!content.trim()) return

    AviateSyncService.addInsight({
      type,
      content,
      stageId,
      projectId,
      timestamp: Date.now(),
    })
  }, [])

  /**
   * Get memory context for current stage
   * Useful for LLM prompts
   */
  const getMemoryContext = useCallback((stageId?: string) => {
    const memory = AviateSyncService.getMemoryForLLM(stageId)
    
    return memory.map(m => `
[${m.type.toUpperCase()}] ${new Date(m.timestamp).toLocaleDateString()}
${m.content}
    `).join('\n---\n')
  }, [])

  /**
   * Get stage continuation context
   * Shows path taken through stages
   */
  const getStageContext = useCallback(() => {
    return AviateSyncService.getStageContext()
  }, [])

  return {
    addInsight,
    getMemoryContext,
    getStageContext,
  }
}

export default useSyncInsights
