import React from 'react'
import { motion } from 'framer-motion'
import { Note } from '../../hooks/notes/useNotes'
import { FileText, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NoteCardProps {
  note: Note
  onDelete?: (noteId: string) => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = React.useState(false)

  const handleCardClick = () => {
    // Navigate to note editor
    navigate(`/app/notes/${note.id}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm(`Delete "${note.title || 'Untitled'}"? This cannot be undone.`)) {
      if (onDelete) {
        onDelete(note.id)
      } else {
        // Fallback: use localStorage if no onDelete callback
        const stored = localStorage.getItem('aviate_notes')
        if (stored) {
          const notes = JSON.parse(stored)
          const filtered = notes.filter((n: Note) => n.id !== note.id)
          localStorage.setItem('aviate_notes', JSON.stringify(filtered))
          window.location.reload() // Refresh to update the view
        }
      }
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Extract preview from HTML content
  const getContentPreview = (html: string) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    const text = temp.textContent || ''
    return text.substring(0, 100).trim()
  }

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      onClick={handleCardClick}
      className="group relative cursor-pointer h-full"
    >
      <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText size={18} className="text-gray-700" />
            </div>
            <h3 className="text-[0.95rem] font-semibold text-gray-900 truncate flex-1">
              {note.title || 'Untitled'}
            </h3>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 mb-5">
          <p className="text-[0.8rem] text-gray-700 line-clamp-3 leading-relaxed">
            {getContentPreview(note.content) || 'No content yet'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[0.75rem] text-gray-400">
            {formatDate(note.updatedAt)}
          </span>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/app/notes/${note.id}`) }}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90"
              aria-label="Open"
              title="Open"
            >
              Open
            </button>
            <motion.button
              onClick={handleDelete}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="p-2 rounded hover:bg-red-50 transition-colors"
              title="Delete note"
              aria-label="Delete note"
            >
              <Trash2 size={14} className="text-red-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoteCard
