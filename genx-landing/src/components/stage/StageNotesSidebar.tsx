import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Loader, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Note } from '../../hooks/notes/useNotes'
import '../notes/NoteEditor.css'

interface StageNotesSidebarProps {
  stageId: string
  stageName: string
  onClose: () => void
  isOpen: boolean
}

const StageNotesSidebar: React.FC<StageNotesSidebarProps> = ({
  stageId,
  stageName,
  onClose,
  isOpen,
}) => {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const STAGE_NOTE_ID = `stage-${stageId}`
  const STORAGE_KEY = 'aviate_notes'

  // Initialize editor FIRST, before other effects
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'note-editor__prose',
      },
    },
    onUpdate: ({ editor }) => {
      if (note && isInitialized) {
        setIsSaving(true)
        const timeoutId = setTimeout(() => {
          updateNoteInStorage(note.id, {
            title: title || 'Untitled Note',
            content: editor.getHTML(),
          })
          setIsSaving(false)
          setLastSaved(Date.now())
        }, 500)
        return () => clearTimeout(timeoutId)
      }
    },
  })

  // Initialize or load stage note
  useEffect(() => {
    const loadOrCreateNote = () => {
      try {
        const isLaunch = window.location.pathname.startsWith('/launch/')
        const system = isLaunch ? 'launchos' : 'foundryos'
        const projectId = sessionStorage.getItem('currentProjectId') || 'default-project'

        const stored = localStorage.getItem(STORAGE_KEY)
        const notes: Note[] = stored ? JSON.parse(stored) : []
        
        let stageNote = notes.find(n => n.id === STAGE_NOTE_ID)
        
        if (!stageNote) {
          stageNote = {
            id: STAGE_NOTE_ID,
            title: `Stage: ${stageName}`,
            content: '<p></p>',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            projectId: projectId,
            stageId: stageId,
            system: system,
          }
          notes.push(stageNote)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
        }
        
        setNote(stageNote)
        setTitle(stageNote.title)
        setLastSaved(stageNote.updatedAt)
        
        // Set editor content after note is loaded
        if (editor && stageNote.content) {
          editor.commands.setContent(stageNote.content)
        }
        
        setIsInitialized(true)
      } catch (error) {
        console.error('Error loading stage note:', error)
        setIsInitialized(true)
      }
    }

    loadOrCreateNote()
  }, [stageId, stageName, editor])

  // Listen for storage changes from other tabs/windows or external updates
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      const notes: Note[] = stored ? JSON.parse(stored) : []
      const updatedNote = notes.find(n => n.id === STAGE_NOTE_ID)
      
      if (updatedNote && updatedNote.updatedAt !== note?.updatedAt) {
        setNote(updatedNote)
        setTitle(updatedNote.title)
        setLastSaved(updatedNote.updatedAt)
        // Update editor if content changed from external source
        if (editor && updatedNote.content !== editor.getHTML()) {
          editor.commands.setContent(updatedNote.content)
        }
      }
    }

    // Listen to storage changes
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [note?.updatedAt, STAGE_NOTE_ID, editor])

  // Listen for custom avioNoteUpdated events from AviateSyncService
  useEffect(() => {
    const handleAvioNoteUpdated = (event: any) => {
      const updatedNote = event.detail?.note
      if (updatedNote && updatedNote.id === STAGE_NOTE_ID) {
        setNote(updatedNote)
        setTitle(updatedNote.title)
        setLastSaved(updatedNote.updatedAt)
        // Update editor with new content
        if (editor && updatedNote.content !== editor.getHTML()) {
          editor.commands.setContent(updatedNote.content)
        }
      }
    }

    window.addEventListener('avioNoteUpdated', handleAvioNoteUpdated)
    return () => window.removeEventListener('avioNoteUpdated', handleAvioNoteUpdated)
  }, [editor, STAGE_NOTE_ID])

  useEffect(() => {
    if (editor && note && note.content) {
      const currentContent = editor.getHTML()
      if (currentContent !== note.content) {
        editor.commands.setContent(note.content)
      }
    }
  }, [editor, note?.updatedAt])

  const updateNoteInStorage = (noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const notes: Note[] = stored ? JSON.parse(stored) : []
      
      const updatedNotes = notes.map(n =>
        n.id === noteId
          ? { ...n, ...updates, updatedAt: Date.now() }
          : n
      )
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes))
      
      // Trigger storage event to notify other windows/tabs
      window.dispatchEvent(new Event('storage'))
      
      const updatedNote = updatedNotes.find(n => n.id === noteId)
      if (updatedNote) {
        setNote(updatedNote)
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (note && isInitialized) {
      setIsSaving(true)
      const timeoutId = setTimeout(() => {
        updateNoteInStorage(note.id, {
          title: newTitle || 'Untitled Note',
          content: editor?.getHTML() || '<p></p>',
        })
        setIsSaving(false)
        setLastSaved(Date.now())
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }

  if (!isInitialized || !note) {
    return null
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: isOpen ? '50%' : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="overflow-hidden border-l border-gray-200 bg-white flex flex-col"
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 pt-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AvioNote</h2>
        </div>
      </div>

      {/* Editor Content */}
      <div className="note-editor flex flex-col flex-1 overflow-hidden">
        <div className="note-editor__scroll flex-1 overflow-y-auto">
          {/* Hero Title Section - Scaled for sidebar */}
          <div className="note-editor__hero" style={{ padding: '40px 32px 24px 32px' }}>
            <div className="note-editor__hero-content">
              {/* Emoji */}
              <div className="note-editor__emoji" style={{ fontSize: '40px', marginBottom: '12px' }}>
                📘
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled"
                className="note-editor__title"
                style={{ fontSize: '28px', marginBottom: '12px' }}
                spellCheck="false"
              />

              {/* Metadata */}
              <div className="note-editor__metadata">
                {lastSaved && !isSaving ? (
                  <span className="text-xs text-gray-500">
                    Saved {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                ) : isSaving ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader size={12} className="animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">
                    Created {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="note-editor__content" style={{ padding: '20px 32px', maxWidth: 'none' }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex-shrink-0">
        <p className="text-xs text-gray-500">
          ✨ Synced with AvioNote workspace
        </p>
      </div>
    </motion.div>
  )
}

export default StageNotesSidebar
