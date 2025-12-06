import { useState, useEffect, useCallback } from 'react'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  projectId?: string
  stageId?: string
  system?: 'foundryos' | 'launchos'
}

export interface SyncEvent {
  type: 'add' | 'update' | 'delete'
  noteId: string
  note?: Note
  timestamp: number
}

const STORAGE_KEY = 'aviate_notes'
const SYNC_HISTORY_KEY = 'aviate_sync_history'

// Global sync event emitter
class SyncEventEmitter {
  private listeners: ((event: SyncEvent) => void)[] = []

  subscribe(callback: (event: SyncEvent) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  emit(event: SyncEvent) {
    this.listeners.forEach(listener => listener(event))
    this.recordSyncHistory(event)
  }

  private recordSyncHistory(event: SyncEvent) {
    try {
      const history: SyncEvent[] = JSON.parse(localStorage.getItem(SYNC_HISTORY_KEY) || '[]')
      history.push(event)
      // Keep last 100 sync events
      if (history.length > 100) history.shift()
      localStorage.setItem(SYNC_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Error recording sync history:', error)
    }
  }

  getSyncHistory(): SyncEvent[] {
    try {
      return JSON.parse(localStorage.getItem(SYNC_HISTORY_KEY) || '[]')
    } catch {
      return []
    }
  }
}

export const syncEmitter = new SyncEventEmitter()

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load notes from localStorage on mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setNotes(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      } catch (error) {
        console.error('Error saving notes:', error)
      }
    }
  }, [notes, isLoading])

  // Listen for storage changes from other windows/tabs or stage components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setNotes(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading notes from storage change:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Listen to external sync events
  useEffect(() => {
    const unsubscribe = syncEmitter.subscribe((event) => {
      if (event.type === 'add' && event.note) {
        setNotes((prev) => [event.note!, ...prev])
      } else if (event.type === 'update' && event.note) {
        setNotes((prev) =>
          prev.map((n) => (n.id === event.noteId ? event.note! : n))
        )
      } else if (event.type === 'delete') {
        setNotes((prev) => prev.filter((n) => n.id !== event.noteId))
      }
    })

    return unsubscribe
  }, [])

  // Listen for custom avioNoteUpdated events from AviateSyncService
  useEffect(() => {
    const handleAvioNoteUpdated = (event: any) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setNotes(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading notes from avioNoteUpdated event:', error)
      }
    }

    window.addEventListener('avioNoteUpdated', handleAvioNoteUpdated)
    return () => window.removeEventListener('avioNoteUpdated', handleAvioNoteUpdated)
  }, [])

  const createNote = useCallback((title: string = 'Untitled Note', projectId?: string, stageId?: string, system?: 'foundryos' | 'launchos') => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      projectId,
      stageId,
      system,
    }
    setNotes((prev) => [newNote, ...prev])
    syncEmitter.emit({ type: 'add', noteId: newNote.id, note: newNote, timestamp: Date.now() })
    return newNote
  }, [])

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes((prev) => {
      const updated = prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
      const updatedNote = updated.find((n) => n.id === id)
      if (updatedNote) {
        syncEmitter.emit({ type: 'update', noteId: id, note: updatedNote, timestamp: Date.now() })
      }
      return updated
    })
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    syncEmitter.emit({ type: 'delete', noteId: id, timestamp: Date.now() })
  }, [])

  const getNoteById = useCallback((id: string) => {
    return notes.find((note) => note.id === id)
  }, [notes])

  const getNotesByStage = useCallback((stageId: string) => {
    return notes.filter((note) => note.stageId === stageId)
  }, [notes])

  const getSyncHistory = useCallback(() => {
    return syncEmitter.getSyncHistory()
  }, [])

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesByStage,
    getSyncHistory,
  }
}
