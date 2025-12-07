import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import { Loader, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Note } from '../../hooks/notes/useNotes'
import { supabase } from '../../lib/supabaseClient'
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
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashPosition, setSlashPosition] = useState<{ x: number; y: number } | null>(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const STAGE_NOTE_ID = `stage-${stageId}`
  const STORAGE_KEY = 'aviate_notes'

  // Initialize editor FIRST, before other effects
  const editor = useEditor({
    extensions: [StarterKit, TiptapImage.configure({ HTMLAttributes: { class: 'note-editor__image' } })],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'note-editor__prose',
      },
      handleKeyDown(view, event) {
        if (event.key === '/' && !event.shiftKey) {
          const { left, top } = view.coordsAtPos(view.state.selection.from)
          setSlashPosition({ x: left, y: top + 20 })
          setShowSlashMenu(true)
        }
        if (event.key === 'Escape' && showSlashMenu) {
          setShowSlashMenu(false)
          return true
        }
        return false
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

  const insertImageByUrl = () => {
    if (!editor || !imageUrlInput.trim() || !note) return
    editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run()
    updateNoteInStorage(note.id, {
      title: title || 'Untitled Note',
      content: editor.getHTML(),
    })
    setImageUrlInput('')
    setShowSlashMenu(false)
  }

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !editor || !note) return

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `notes/${note.id}/${Date.now()}-${safeName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avionote-images')
      .upload(path, file, { upsert: false, contentType: file.type })

    if (uploadError) {
      console.error('Supabase upload failed:', uploadError?.message || uploadError)
      return
    }

    const { data: publicData } = supabase.storage
      .from('avionote-images')
      .getPublicUrl(uploadData?.path || path)
    const publicUrl = publicData?.publicUrl || ''
    if (!publicUrl) {
      console.error('Failed to get public URL for uploaded image')
      return
    }

    editor.chain().focus().setImage({ src: publicUrl }).run()
    updateNoteInStorage(note.id, {
      title: title || 'Untitled Note',
      content: editor.getHTML(),
    })
    setShowSlashMenu(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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

            {showSlashMenu && slashPosition && (
              <div
                className="slash-menu fixed z-50 rounded-xl border border-gray-200 bg-white shadow-xl"
                style={{ left: slashPosition.x, top: slashPosition.y }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="p-3 flex items-center justify-between border-b border-gray-100">
                  <div className="text-xs font-medium text-gray-600">Insert</div>
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => setShowSlashMenu(false)}
                    aria-label="Close menu"
                  >
                    ✖️
                  </button>
                </div>
                <div className="p-3 space-y-3">
                  <div className="text-[11px] uppercase tracking-wide text-gray-400">Image</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs"
                      placeholder="Paste image URL"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                    />
                    <button
                      className="inline-flex items-center gap-1 rounded-md bg-black px-2.5 py-1.5 text-xs font-semibold text-white"
                      onClick={insertImageByUrl}
                      title="Insert image from URL"
                    >
                      Insert
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="text-xs"
                    />
                    <span className="text-[12px] text-gray-500">or upload from device</span>
                  </div>
                </div>
              </div>
            )}
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
