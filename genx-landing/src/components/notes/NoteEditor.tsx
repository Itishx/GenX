import React, { useEffect, useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Loader, Image as ImageIcon, Link as LinkIcon, Upload as UploadIcon, X } from 'lucide-react'
import { Note } from '../../hooks/notes/useNotes'
import './NoteEditor.css'
import TiptapImage from '@tiptap/extension-image'
import { supabase } from '../../lib/supabaseClient'

interface NoteEditorProps {
  note: Note | null
  onUpdate: (id: string, updates: { title: string; content: string }) => void
  onAskAI?: () => void
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate, onAskAI }) => {
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashPosition, setSlashPosition] = useState<{ x: number; y: number } | null>(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const editor = useEditor({
    extensions: [StarterKit, TiptapImage.configure({ HTMLAttributes: { class: 'note-editor__image' } })],
    content: note?.content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'note-editor__prose',
      },
      handleKeyDown(view, event) {
        // Open a simple slash menu when user types '/'
        if (event.key === '/' && !event.shiftKey) {
          const { left, top } = view.coordsAtPos(view.state.selection.from)
          setSlashPosition({ x: left, y: top + 20 })
          setShowSlashMenu(true)
        }
        // Escape closes menu
        if (event.key === 'Escape' && showSlashMenu) {
          setShowSlashMenu(false)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      if (note) {
        setIsSaving(true)
        const timeoutId = setTimeout(() => {
          onUpdate(note.id, {
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

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      if (editor && note.content) {
        editor.commands.setContent(note.content)
      }
    }
  }, [note?.id])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (note) {
      setIsSaving(true)
      const timeoutId = setTimeout(() => {
        onUpdate(note.id, {
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
    // Immediately persist after image insertion
    onUpdate(note.id, {
      title: title || 'Untitled Note',
      content: editor.getHTML(),
    })
    setImageUrlInput('')
    setShowSlashMenu(false)
  }

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !editor || !note) return

    // Public bucket: no auth required

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `notes/${note.id}/${Date.now()}-${safeName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avionote-images')
      .upload(path, file, { upsert: false, contentType: file.type })

    if (uploadError) {
      console.error('Supabase upload failed:', uploadError?.message || uploadError)
      return
    }

    // Public URL for public bucket
    const { data: publicData } = supabase.storage
      .from('avionote-images')
      .getPublicUrl(uploadData?.path || path)
    const publicUrl = publicData?.publicUrl || ''
    if (!publicUrl) {
      console.error('Failed to get public URL for uploaded image')
      return
    }

    editor.chain().focus().setImage({ src: publicUrl }).run()
    onUpdate(note.id, {
      title: title || 'Untitled Note',
      content: editor.getHTML(),
    })
    setShowSlashMenu(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (!note) {
    return null
  }

  return (
    <div className="note-editor flex flex-col h-full bg-white overflow-hidden">
      {/* Scrollable Content */}
      <div className="note-editor__scroll flex-1 overflow-y-auto">
        {/* Hero Title Section - Notion Style */}
        <div className="note-editor__hero">
          <div className="note-editor__hero-content">
            {/* Emoji - Optional */}
            <div className="note-editor__emoji">📄</div>
            
            {/* Title Input - Large and Prominent */}
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled"
              className="note-editor__title"
              spellCheck="false"
            />

            {/* Metadata */}
            <div className="note-editor__metadata">
              {lastSaved && !isSaving ? (
                <span className="text-sm text-gray-500">
                  Last edited {new Date(lastSaved).toLocaleDateString()} at {new Date(lastSaved).toLocaleTimeString()}
                </span>
              ) : isSaving ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader size={14} className="animate-spin" />
                  Saving...
                </div>
              ) : (
                <span className="text-sm text-gray-400">Created {new Date(note.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Rich Text Editor - No Toolbar, Pure Typing Experience */}
        <div className="note-editor__content">
          <EditorContent editor={editor} />

          {/* Slash menu */}
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
                  <X size={14} />
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
                    <LinkIcon size={14} />
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
  )
}

export default NoteEditor
