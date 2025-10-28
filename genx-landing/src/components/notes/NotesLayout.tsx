import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Menu, X } from 'lucide-react'
import { useNotes, Note } from '../../hooks/notes/useNotes'
import NotesSidebar from './NotesSidebar'
import NoteEditor from './NoteEditor'
import './NotesLayout.css'

const NotesLayout: React.FC = () => {
  const navigate = useNavigate()
  const { notes, isLoading, createNote, updateNote, deleteNote, getNoteById } = useNotes()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isAILoading, setIsAILoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Auto-select first note on load
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id)
    }
  }, [notes, selectedNoteId])

  const handleCreateNote = () => {
    const newNote = createNote()
    setSelectedNoteId(newNote.id)
  }

  const handleRenameNote = (id: string, newTitle: string) => {
    updateNote(id, { title: newTitle })
  }

  const handleUpdateNote = (id: string, updates: { title: string; content: string }) => {
    updateNote(id, updates)
  }

  const handleDeleteNote = (id: string) => {
    deleteNote(id)
    if (selectedNoteId === id) {
      const remainingNotes = notes.filter((n) => n.id !== id)
      if (remainingNotes.length > 0) {
        setSelectedNoteId(remainingNotes[0].id)
      } else {
        setSelectedNoteId(null)
      }
    }
  }

  const handleAskAI = async () => {
    const selectedNote = getNoteById(selectedNoteId!)
    if (!selectedNote) return

    setIsAILoading(true)
    try {
      // Placeholder API call - replace with your actual AI endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: selectedNote.content,
          prompt: 'Expand on the following note with insights and suggestions:',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        updateNote(selectedNoteId!, {
          title: selectedNote.title,
          content: selectedNote.content + '\n\n' + data.response,
        })
      }
    } catch (error) {
      console.error('AI request failed:', error)
      // Fallback: Show a placeholder response
      const placeholderResponse = '\n\n✨ AI Enhancement would appear here when connected to your API.'
      updateNote(selectedNoteId!, {
        title: selectedNote.title,
        content: selectedNote.content + placeholderResponse,
      })
    } finally {
      setIsAILoading(false)
    }
  }

  const selectedNote = selectedNoteId ? getNoteById(selectedNoteId) : null

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Loading notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-layout flex h-full w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <div className={`notes-layout__sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <NotesSidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          onRenameNote={handleRenameNote}
        />
      </div>

      {/* Main Editor Area */}
      <div className={`notes-layout__main ${!sidebarOpen ? 'notes-layout__main--expanded' : ''}`}>
        {/* Top Navigation - Hamburger toggle only */}
        <div className="notes-layout__topbar">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="notes-layout__topbar-toggle"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Editor Content */}
        <div className="notes-layout__editor flex-1 overflow-hidden">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={handleUpdateNote}
              onAskAI={handleAskAI}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Avionote</h2>
                <p className="text-gray-500 mb-6">Create your first note or select one from the sidebar to get started</p>
                <button
                  onClick={handleCreateNote}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Create Your First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Loading Indicator */}
      {isAILoading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg border border-blue-200 shadow-lg z-50">
          <Loader size={16} className="animate-spin" />
          <span className="text-sm font-medium">AI is thinking...</span>
        </div>
      )}
    </div>
  )
}

export default NotesLayout
