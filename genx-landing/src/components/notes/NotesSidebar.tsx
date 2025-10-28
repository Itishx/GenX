import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, LogOut } from 'lucide-react'
import { Note } from '../../hooks/notes/useNotes'
import './NotesSidebar.css'

interface NotesSidebarProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
  onRenameNote: (id: string, newTitle: string) => void
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onRenameNote,
}) => {
  const navigate = useNavigate()
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleRenameStart = (note: Note) => {
    setRenamingId(note.id)
    setRenameValue(note.title)
  }

  const handleRenameSave = (id: string) => {
    if (renameValue.trim()) {
      onRenameNote(id, renameValue.trim())
    }
    setRenamingId(null)
  }

  const handleRenameCancel = () => {
    setRenamingId(null)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="notes-sidebar">
      {/* Header - Logo Only */}
      <div className="notes-sidebar__header">
        <div className="notes-sidebar__logo-container">
          <img 
            src="/assets/avionote.png" 
            alt="Avionote" 
            className="notes-sidebar__logo"
            title="Avionote"
          />
        </div>
      </div>

      {/* New Note Button */}
      <div className="notes-sidebar__action-bar">
        <button
          onClick={onCreateNote}
          className="notes-sidebar__new-btn"
          title="Create new note"
          aria-label="Create new note"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* Divider */}
      <div className="notes-sidebar__divider" />

      {/* Notes List */}
      <div className="notes-sidebar__list">
        {notes.length === 0 ? (
          <div className="notes-sidebar__empty">
            <FileText size={24} className="opacity-30" />
            <>
              <p className="notes-sidebar__empty-text">No notes yet</p>
              <p className="notes-sidebar__empty-subtext">Click + to create</p>
            </>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onMouseEnter={() => setHoveredId(note.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`notes-sidebar__item ${selectedNoteId === note.id ? 'notes-sidebar__item--active' : ''}`}
            >
              {renamingId === note.id ? (
                <input
                  autoFocus
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSave(note.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSave(note.id)
                    if (e.key === 'Escape') handleRenameCancel()
                  }}
                  className="notes-sidebar__rename-input"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <div
                    onClick={() => onSelectNote(note.id)}
                    className="notes-sidebar__item-content"
                    title={note.title}
                  >
                    <FileText size={16} className="notes-sidebar__item-icon" />
                    <div className="notes-sidebar__item-info">
                      <p className="notes-sidebar__item-title">{note.title}</p>
                    </div>
                  </div>

                  {/* Action Menu - Show on Hover */}
                  {hoveredId === note.id && (
                    <div className="notes-sidebar__actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRenameStart(note)
                        }}
                        className="notes-sidebar__action-btn"
                        title="Rename note"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Delete this note? This cannot be undone.')) {
                            onDeleteNote(note.id)
                          }
                        }}
                        className="notes-sidebar__action-btn notes-sidebar__action-btn--danger"
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Section - Back to Workspace */}
      <div className="notes-sidebar__footer">
        <button
          onClick={() => navigate('/app/agents')}
          className="notes-sidebar__back-btn"
          title="Back to Workspace"
          aria-label="Back to Workspace"
        >
          <LogOut size={16} />
          <span>Back to Workspace</span>
        </button>
      </div>
    </div>
  )
}

export default NotesSidebar
