import { useState, useEffect, useCallback } from 'react'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'aviate_notes'

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

  const createNote = useCallback((title: string = 'Untitled Note') => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes((prev) => [newNote, ...prev])
    return newNote
  }, [])

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    )
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  const getNoteById = useCallback((id: string) => {
    return notes.find((note) => note.id === id)
  }, [notes])

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
  }
}
