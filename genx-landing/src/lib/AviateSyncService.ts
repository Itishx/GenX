import { syncEmitter, Note } from '@/hooks/notes/useNotes'

/**
 * Unified Sync Service
 * Handles real-time propagation of insights/notes across:
 * 1. AvioNote main workspace
 * 2. Homepage Kanban progress tracking
 * 3. Memory storage for LLM context
 * 4. Stage-to-stage continuity
 */

export interface InsightSource {
  type: 'chat' | 'ai-summary' | 'manual'
  content: string
  stageId: string
  projectId: string
  timestamp: number
}

export interface SyncContext {
  stageId: string
  projectId: string
  stageName: string
  osType: 'foundryos' | 'launchos'
}

const MEMORY_KEY = 'aviate_memory'
const STAGE_CONTEXT_KEY = 'aviate_stage_context'

class AviateSyncService {
  /**
   * Add insight from any source (chat, AI summary, or manual)
   * Automatically syncs to all systems
   */
  static addInsight(source: InsightSource) {
    try {
      const htmlContent = this.convertToHTML(source.content)
      
      // 1. Update AvioNote
      this.syncToAvioNote(source, htmlContent)
      
      // 2. Update progress indicator in Kanban
      this.updateProgressIndicator(source.stageId, source.projectId)
      
      // 3. Store in memory for LLM
      this.storeInMemory(source)
      
      // 4. Update stage continuity
      this.updateStageContinuity(source)
      
      // 5. Emit sync event for real-time updates
      this.emitSyncEvent(source.stageId)
      
      console.log('✨ Insight synced across all systems', source)
    } catch (error) {
      console.error('❌ Sync failed:', error)
    }
  }

  /**
   * Convert plain text to HTML with proper formatting
   */
  private static convertToHTML(content: string): string {
    if (!content) return '<p></p>'
    
    // Split by double newlines for paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    
    return paragraphs
      .map(para => {
        // Handle bullet points
        if (para.trim().startsWith('-') || para.trim().startsWith('•')) {
          const items = para.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'))
          const listHTML = items
            .map(item => `<li>${item.replace(/^[-•]\s*/, '').trim()}</li>`)
            .join('')
          return `<ul>${listHTML}</ul>`
        }
        
        // Handle numbered lists
        if (para.trim().match(/^\d+\./)) {
          const items = para.split('\n').filter(l => l.trim().match(/^\d+\./))
          const listHTML = items
            .map(item => `<li>${item.replace(/^\d+\.\s*/, '').trim()}</li>`)
            .join('')
          return `<ol>${listHTML}</ol>`
        }
        
        // Regular paragraph
        return `<p>${para.trim().replace(/\n/g, '<br>')}</p>`
      })
      .join('')
  }

  /**
   * Sync to AvioNote (stage note page)
   */
  private static syncToAvioNote(source: InsightSource, htmlContent: string) {
    try {
      const STAGE_NOTE_ID = `stage-${source.stageId}`
      const STORAGE_KEY = 'aviate_notes'
      
      const stored = localStorage.getItem(STORAGE_KEY)
      const notes: Note[] = stored ? JSON.parse(stored) : []
      
      let stageNote = notes.find(n => n.id === STAGE_NOTE_ID)
      
      if (!stageNote) {
        // Create if doesn't exist
        const os = source.projectId.includes('foundry') ? 'foundryos' : 'launchos'

        stageNote = {
          id: STAGE_NOTE_ID,
          title: `Stage: ${source.stageId}`,
          content: htmlContent,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          projectId: source.projectId,
          stageId: source.stageId,
          system: os,
        }
        notes.push(stageNote)
      } else {
        // Append to existing
        const separator = stageNote.content && stageNote.content !== '<p></p>' ? '<hr class="my-4">' : ''
        stageNote.content = stageNote.content === '<p></p>' 
          ? htmlContent 
          : `${stageNote.content}${separator}${htmlContent}`
        stageNote.updatedAt = Date.now()
        stageNote.projectId = source.projectId
        if (!stageNote.system) {
          stageNote.system = source.projectId.includes('foundry') ? 'foundryos' : 'launchos'
        }
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      
      // Notify listeners
      window.dispatchEvent(new CustomEvent('avioNoteUpdated', {
        detail: { noteId: STAGE_NOTE_ID, note: stageNote }
      }))
    } catch (error) {
      console.error('Failed to sync to AvioNote:', error)
    }
  }

  /**
   * Update progress indicator on homepage Kanban
   */
  private static updateProgressIndicator(stageId: string, projectId: string) {
    try {
      const PROGRESS_KEY = `progress-${projectId}`
      const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
      
      // Auto-mark as in-progress if not started
      if (!progress[stageId]) {
        progress[stageId] = 'in-progress'
      }
      
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
      
      // Notify progress listeners
      window.dispatchEvent(new CustomEvent('progressUpdated', {
        detail: { projectId, progress }
      }))
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  /**
   * Store in memory for LLM context
   */
  private static storeInMemory(source: InsightSource) {
    try {
      const memories: InsightSource[] = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]')
      
      memories.push({
        ...source,
        timestamp: Date.now()
      })
      
      // Keep last 50 insights
      if (memories.length > 50) memories.shift()
      
      localStorage.setItem(MEMORY_KEY, JSON.stringify(memories))
    } catch (error) {
      console.error('Failed to store in memory:', error)
    }
  }

  /**
   * Update stage continuity for smooth transitions
   */
  private static updateStageContinuity(source: InsightSource) {
    try {
      const context: SyncContext[] = JSON.parse(localStorage.getItem(STAGE_CONTEXT_KEY) || '[]')
      
      // Add current stage context
      context.push({
        stageId: source.stageId,
        projectId: source.projectId,
        stageName: source.stageId.charAt(0).toUpperCase() + source.stageId.slice(1),
        osType: source.projectId.includes('launch') ? 'launchos' : 'foundryos',
      })
      
      // Keep last 20 stages
      if (context.length > 20) context.shift()
      
      localStorage.setItem(STAGE_CONTEXT_KEY, JSON.stringify(context))
    } catch (error) {
      console.error('Failed to update stage continuity:', error)
    }
  }

  /**
   * Emit event for real-time sync across components
   */
  private static emitSyncEvent(stageId: string) {
    const STAGE_NOTE_ID = `stage-${stageId}`
    const STORAGE_KEY = 'aviate_notes'
    
    const stored = localStorage.getItem(STORAGE_KEY)
    const notes: Note[] = stored ? JSON.parse(stored) : []
    const updatedNote = notes.find(n => n.id === STAGE_NOTE_ID)

    if (updatedNote) {
      syncEmitter.emit({
        type: 'update',
        noteId: STAGE_NOTE_ID,
        note: updatedNote,
        timestamp: Date.now()
      })
    }
  }

  /**
   * Get memory for LLM context
   */
  static getMemoryForLLM(stageId?: string): InsightSource[] {
    try {
      const memories: InsightSource[] = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]')
      
      if (stageId) {
        // Get relevant memories for current stage
        const stageMemories = memories.filter(m => m.stageId === stageId)
        // Also include previous stage memories for continuity
        return [...stageMemories, ...memories.slice(-10)]
      }
      
      return memories
    } catch {
      return []
    }
  }

  /**
   * Get stage context for continuity
   */
  static getStageContext(): SyncContext[] {
    try {
      return JSON.parse(localStorage.getItem(STAGE_CONTEXT_KEY) || '[]')
    } catch {
      return []
    }
  }

  /**
   * Clear all sync data (for testing)
   */
  static clear() {
    localStorage.removeItem(MEMORY_KEY)
    localStorage.removeItem(STAGE_CONTEXT_KEY)
  }
}

export default AviateSyncService
