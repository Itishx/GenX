import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, LogOut, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface GroupedNotes {
  [projectId: string]: {
    [stageId: string]: Note[]
  }
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
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['manual']))
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())

  // Group notes by projectId and stageId
  const groupedNotes: GroupedNotes = notes.reduce((acc, note) => {
    const projectId = note.projectId || 'manual'
    const stageId = note.stageId || 'standalone'
    
    if (!acc[projectId]) {
      acc[projectId] = {}
    }
    if (!acc[projectId][stageId]) {
      acc[projectId][stageId] = []
    }
    
    acc[projectId][stageId].push(note)
    return acc
  }, {} as GroupedNotes)

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

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev)
      if (next.has(stageId)) {
        next.delete(stageId)
      } else {
        next.add(stageId)
      }
      return next
    })
  }

  const getProjectDisplay = (projectId: string) => {
    if (projectId === 'manual') {
      return { label: '📝 Manual Notes', icon: null }
    }
    return { label: projectId, icon: '📦' }
  }

  const getStageDisplay = (stageId: string) => {
    if (stageId === 'standalone') {
      return { label: 'Standalone', icon: '✨' }
    }
    // Extract stage name from the title if it starts with "Stage: "
    const stageNotes = Object.values(groupedNotes).flatMap(stages => stages[stageId] || [])
    if (stageNotes.length > 0) {
      const match = stageNotes[0].title.match(/Stage:\s*(.+)/)
      if (match) {
        return { label: match[1], icon: '📋' }
      }
    }
    return { label: stageId, icon: '📋' }
  }

  const renderNoteItem = (note: Note) => (
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
            <FileText size={14} className="notes-sidebar__item-icon" />
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
  )

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

      {/* New Standalone Note Button */}
      <div className="notes-sidebar__action-bar">
        <button
          onClick={onCreateNote}
          className="notes-sidebar__new-btn"
          title="Create new standalone note"
          aria-label="Create new standalone note"
        >
          <Plus size={18} />
          <span>New Standalone</span>
        </button>
      </div>

      {/* Divider */}
      <div className="notes-sidebar__divider" />

      {/* Notes List - Grouped by Project & Stage */}
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
          Object.entries(groupedNotes).map(([projectId, stagesObj]) => {
            const projectDisplay = getProjectDisplay(projectId)
            const isExpanded = expandedProjects.has(projectId)
            
            return (
              <motion.div 
                key={projectId} 
                className="notes-sidebar__project-group"
                initial={false}
              >
                {/* Project Header */}
                <motion.button
                  onClick={() => toggleProject(projectId)}
                  className="notes-sidebar__project-header"
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="notes-sidebar__project-chevron" />
                  </motion.div>
                  <span className="notes-sidebar__project-name">
                    {projectDisplay.icon && <span className="notes-sidebar__project-icon">{projectDisplay.icon}</span>}
                    {projectDisplay.label}
                  </span>
                  <span className="notes-sidebar__project-count">
                    {Object.values(stagesObj).flat().length}
                  </span>
                </motion.button>

                {/* Project Content - Expandable */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="notes-sidebar__project-content"
                    >
                      {Object.entries(stagesObj).map(([stageId, stageNotes]) => {
                        const stageDisplay = getStageDisplay(stageId)
                        const stageKey = `${projectId}-${stageId}`
                        const isStageExpanded = expandedStages.has(stageKey)

                        return (
                          <motion.div 
                            key={stageId} 
                            className="notes-sidebar__stage-group"
                            initial={false}
                          >
                            {/* Stage Header */}
                            <motion.button
                              onClick={() => toggleStage(stageKey)}
                              className="notes-sidebar__stage-header"
                            >
                              <motion.div
                                animate={{ rotate: isStageExpanded ? 0 : -90 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown size={14} className="notes-sidebar__stage-chevron" />
                              </motion.div>
                              <span className="notes-sidebar__stage-icon">{stageDisplay.icon}</span>
                              <span className="notes-sidebar__stage-name">{stageDisplay.label}</span>
                              <span className="notes-sidebar__stage-count">{stageNotes.length}</span>
                            </motion.button>

                            {/* Stage Content - Notes List */}
                            <AnimatePresence>
                              {isStageExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="notes-sidebar__stage-content"
                                >
                                  {stageNotes.map(note => renderNoteItem(note))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
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
