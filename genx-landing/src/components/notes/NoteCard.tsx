import React from 'react'
import { motion } from 'framer-motion'
import { Note } from '../../hooks/notes/useNotes'
import { FileText, Edit2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NoteCardProps {
  note: Note
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = React.useState(false)

  const handleCardClick = () => {
    // Navigate to note editor
    navigate(`/app/notes/${note.id}`)
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
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      onClick={handleCardClick}
      className="relative group cursor-pointer h-full"
    >
      <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg p-4 hover:border-[#ff6b00] transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#ff6b00]/10 flex items-center justify-center">
              <FileText size={16} className="text-[#ff6b00]" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">
              {note.title || 'Untitled'}
            </h3>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 mb-4">
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {getContentPreview(note.content) || 'No content yet'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDate(note.updatedAt)}
          </span>
          
          {/* Action Buttons - Show on Hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/app/notes/${note.id}/edit`)
              }}
              className="p-1.5 rounded hover:bg-blue-50 transition-colors"
              title="Edit note"
            >
              <Edit2 size={14} className="text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Delete handler would go here
              }}
              className="p-1.5 rounded hover:bg-red-50 transition-colors"
              title="Delete note"
            >
              <Trash2 size={14} className="text-red-600" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoteCard
