import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiBriefcase, FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export interface Project {
  id: string
  name: string
  os: 'foundryos' | 'launchos'
  createdAt: Date
  isActive: boolean
}

interface Stage {
  id: string
  name: string
  projectId: string
  projectName: string
  os: 'foundryos' | 'launchos'
}

interface Note {
  id: string
  title: string
  description: string
  type: 'insight' | 'pain-point' | 'idea' | 'persona' | 'market' | 'next-step'
  stageId: string
  stageName: string
  projectId: string
  projectName: string
  os: 'foundryos' | 'launchos'
}

type SearchResult = 
  | { type: 'project'; data: Project }
  | { type: 'stage'; data: Stage }
  | { type: 'note'; data: Note }

interface GlobalSearchProps {
  projects: Project[]
  activeProjectId: string | null
}

const FOUNDRY_STAGES = [
  { id: 'ignite', name: 'Ignite' },
  { id: 'explore', name: 'Explore' },
  { id: 'empathize', name: 'Empathize' },
  { id: 'differentiate', name: 'Differentiate' },
  { id: 'architect', name: 'Architect' },
  { id: 'validate', name: 'Validate' },
  { id: 'construct', name: 'Construct' },
  { id: 'align', name: 'Align' },
]

const LAUNCH_STAGES = [
  { id: 'research', name: 'Research' },
  { id: 'position', name: 'Position' },
  { id: 'strategy', name: 'Strategy' },
  { id: 'campaigns', name: 'Campaigns' },
  { id: 'messaging', name: 'Messaging' },
  { id: 'channels', name: 'Channels' },
  { id: 'execute', name: 'Execute' },
  { id: 'scale', name: 'Scale' },
]

// Mock function to get insights from localStorage (in production, this would come from your database)
const getMockNotesForStage = (projectId: string, stageId: string): Note[] => {
  try {
    const lastStageData = localStorage.getItem('lastAccessedStage')
    if (lastStageData) {
      const data = JSON.parse(lastStageData)
      // In production, fetch actual notes from database
      // For now, return empty array as placeholder
    }
  } catch (err) {
    console.error('Error reading notes:', err)
  }
  return []
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ projects, activeProjectId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const getStagesForProject = useCallback((project: Project) => {
    const stages = project.os === 'foundryos' ? FOUNDRY_STAGES : LAUNCH_STAGES
    return stages.map(stage => ({
      ...stage,
      projectId: project.id,
      projectName: project.name,
      os: project.os,
    }))
  }, [])

  const getAllNotes = useCallback((): Note[] => {
    const allNotes: Note[] = []
    projects.forEach(project => {
      const stages = getStagesForProject(project)
      stages.forEach(stage => {
        const notes = getMockNotesForStage(project.id, stage.id)
        allNotes.push(...notes)
      })
    })
    return allNotes
  }, [projects, getStagesForProject])

  const results = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const searchResults: SearchResult[] = []

    // Search projects
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(query)) {
        searchResults.push({ type: 'project', data: project })
      }
    })

    // Search stages
    projects.forEach(project => {
      const stages = getStagesForProject(project)
      stages.forEach(stage => {
        if (stage.name.toLowerCase().includes(query)) {
          searchResults.push({ type: 'stage', data: stage })
        }
      })
    })

    // Search notes
    const allNotes = getAllNotes()
    allNotes.forEach(note => {
      if (
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query)
      ) {
        searchResults.push({ type: 'note', data: note })
      }
    })

    return searchResults
  }, [searchQuery, projects, getStagesForProject, getAllNotes])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchQuery('')
        break
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        setIsOpen(false)
        setSearchQuery('')
        break
      case 'stage':
        const stageData = result.data as Stage
        const path = stageData.os === 'foundryos' 
          ? `/foundry/${stageData.id}`
          : `/launch/${stageData.id}`
        navigate(path)
        setIsOpen(false)
        setSearchQuery('')
        break
      case 'note':
        const noteData = result.data as Note
        const stagePath = noteData.os === 'foundryos'
          ? `/foundry/${noteData.stageId}`
          : `/launch/${noteData.stageId}`
        navigate(stagePath)
        setIsOpen(false)
        setSearchQuery('')
        break
    }
  }

  const getOSIcon = (os: 'foundryos' | 'launchos') => {
    return os === 'foundryos' ? (
      <FiBriefcase className="h-4 w-4" />
    ) : (
      <FiTrendingUp className="h-4 w-4" />
    )
  }

  const renderResultItem = (result: SearchResult, index: number) => {
    const isSelected = index === selectedIndex
    const baseClasses = 'w-full px-4 py-3 text-left transition-colors rounded-lg flex items-center gap-3'
    const selectedClasses = isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'

    if (result.type === 'project') {
      const project = result.data
      return (
        <motion.button
          key={`project-${project.id}`}
          className={`${baseClasses} ${selectedClasses}`}
          onClick={() => handleSelectResult(result)}
          whileHover={{ x: 4 }}
        >
          <div className="flex-shrink-0">
            {getOSIcon(project.os)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">
              {project.name}
            </div>
            <div className="text-xs text-gray-500">
              Project
            </div>
          </div>
          <FiArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </motion.button>
      )
    }

    if (result.type === 'stage') {
      const stage = result.data
      return (
        <motion.button
          key={`stage-${stage.projectId}-${stage.id}`}
          className={`${baseClasses} ${selectedClasses}`}
          onClick={() => handleSelectResult(result)}
          whileHover={{ x: 4 }}
        >
          <div className="flex-shrink-0">
            {getOSIcon(stage.os)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">
              {stage.name}
            </div>
            <div className="text-xs text-gray-500">
              {stage.projectName} • Stage
            </div>
          </div>
          <FiArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </motion.button>
      )
    }

    if (result.type === 'note') {
      const note = result.data
      const typeLabel = note.type.charAt(0).toUpperCase() + note.type.slice(1).replace('-', ' ')
      return (
        <motion.button
          key={`note-${note.id}`}
          className={`${baseClasses} ${selectedClasses}`}
          onClick={() => handleSelectResult(result)}
          whileHover={{ x: 4 }}
        >
          <div className="flex-shrink-0">
            {getOSIcon(note.os)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">
              {note.title}
            </div>
            <div className="text-xs text-gray-500">
              {note.projectName} • {note.stageName} • {typeLabel}
            </div>
          </div>
          <FiArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </motion.button>
      )
    }
  }

  return (
    <>
      {/* Search Input */}
      <div className="relative w-full">
        <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#ff6b00] transition-colors placeholder-gray-500 truncate"
        />
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto w-full"
          >
            {searchQuery && results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">No results found</p>
              </div>
            ) : !searchQuery ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">Start typing…</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {/* Group results by type */}
                {results.length > 0 && (
                  <div>
                    {results.map((result, idx) => (
                      <React.Fragment key={`${result.type}-${idx}`}>
                        {renderResultItem(result, idx)}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close search when clicking outside */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default GlobalSearch
