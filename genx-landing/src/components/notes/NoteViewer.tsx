import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Save, Trash2, Loader } from 'lucide-react'
import { useNotes } from '../../hooks/notes/useNotes'
import NoteEditor from './NoteEditor'

const NoteViewer: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { notes, updateNote, deleteNote, isLoading } = useNotes()
  const [isSaving, setIsSaving] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <Loader className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Loading note...</p>
        </motion.div>
      </div>
    )
  }

  const note = notes.find(n => n.id === noteId)

  if (!note) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Note Not Found</h2>
          <p className="text-gray-500 mb-6">The note you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/app/notes')}
            className="px-6 py-3 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff5a00] transition-colors font-medium"
          >
            Back to Notes
          </button>
        </div>
      </div>
    )
  }

  const handleUpdate = async (id: string, updates: { title: string; content: string }) => {
    setIsSaving(true)
    try {
      updateNote(id, updates)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this note? This action cannot be undone.')) {
      deleteNote(noteId!)
      navigate('/app/notes')
    }
  }

  const handleBack = () => {
    navigate('/app/notes')
  }

  return (
    <div className="flex h-screen bg-white flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between flex-shrink-0"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Notes</span>
        </button>

        <div className="flex items-center gap-3">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader size={16} className="animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Delete note"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <NoteEditor
          note={note}
          onUpdate={handleUpdate}
          onAskAI={() => {}}
        />
      </div>
    </div>
  )
}

export default NoteViewer
