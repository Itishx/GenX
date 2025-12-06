import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Note, useNotes } from '../../hooks/notes/useNotes'
import { FileText, Plus } from 'lucide-react'
import NoteCard from './NoteCard'

interface NotesGridProps {
  projectName: string
  projectOS: 'foundryos' | 'launchos'
  notesByStage: { [stageId: string]: Note[] }
  activeProjectId?: string
}

const NotesGrid: React.FC<NotesGridProps> = ({ projectName, projectOS, notesByStage, activeProjectId }) => {
  const { createNote } = useNotes()
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const OSLabel = projectOS === 'foundryos' ? 'FoundryOS' : 'LaunchOS'
  const stageLabels: { [key: string]: string } = {
    'standalone': 'Standalone Notes',
    'ignite': 'Ignite Notes',
    'explore': 'Explore Notes',
    'empathize': 'Empathize Notes',
    'differentiate': 'Differentiate Notes',
    'architect': 'Architect Notes',
    'validate': 'Validate Notes',
    'construct': 'Construct Notes',
    'align': 'Align Notes',
    'research': 'Research Notes',
    'position': 'Position Notes',
    'strategy': 'Strategy Notes',
    'campaigns': 'Campaigns Notes',
    'messaging': 'Messaging Notes',
    'channels': 'Channels Notes',
    'execute': 'Execute Notes',
    'scale': 'Scale Notes',
  }

  const totalNotes = Object.values(notesByStage).flat().length

  const handleCreateNote = (stageId?: string) => {
    const title = stageId && stageId !== 'standalone' ? `${stageLabels[stageId]}` : 'Untitled Note'
    createNote(title, activeProjectId, stageId !== 'standalone' ? stageId : undefined, projectOS)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {OSLabel} Notes
              </h1>
              <p className="text-gray-600">
                {projectName} • {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
              </p>
            </div>
            <motion.button 
              onClick={() => handleCreateNote('standalone')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff5a00] transition-colors font-medium"
            >
              <Plus size={18} />
              New Standalone Note
            </motion.button>
          </div>
        </motion.div>

        {/* Notes by Stage */}
        {Object.entries(notesByStage).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6">Start by creating a note from a stage or create one manually</p>
            <motion.button 
              onClick={() => handleCreateNote('standalone')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff5a00] transition-colors font-medium"
            >
              <Plus size={18} />
              Create First Note
            </motion.button>
          </motion.div>
        ) : (
          Object.entries(notesByStage)
            .sort(([stageA], [stageB]) => {
              // Sort standalone notes to the end
              if (stageA === 'standalone') return 1
              if (stageB === 'standalone') return -1
              return 0
            })
            .map(([stageId, stageNotes], stageIndex) => (
            <motion.div
              key={stageId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIndex * 0.1 }}
              className="mb-12"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#ff6b00]/10">
                    <span className="text-lg">📋</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {stageLabels[stageId] || `${stageId} Notes`}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {stageNotes.length} {stageNotes.length === 1 ? 'note' : 'notes'}
                    </p>
                  </div>
                </div>
                {stageId !== 'standalone' && (
                  <motion.button
                    onClick={() => handleCreateNote(stageId)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-700 rounded hover:border-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"
                  >
                    <Plus size={16} />
                    Add Note
                  </motion.button>
                )}
              </div>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageNotes.map((note, idx) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NoteCard note={note} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotesGrid
