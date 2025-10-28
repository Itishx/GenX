import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Loader } from 'lucide-react'
import { Note } from '../../hooks/notes/useNotes'
import './NoteEditor.css'

interface NoteEditorProps {
  note: Note | null
  onUpdate: (id: string, updates: { title: string; content: string }) => void
  onAskAI?: () => void
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate, onAskAI }) => {
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'note-editor__prose',
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
        </div>
      </div>
    </div>
  )
}

export default NoteEditor
