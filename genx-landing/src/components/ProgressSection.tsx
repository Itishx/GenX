import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiCircle, FiClock, FiBook, FiChevronRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Project } from './ProjectSidebar'

type StageStatus = 'not-started' | 'in-progress' | 'done'
type StageProgress = Record<string, StageStatus>

interface ProgressSectionProps {
  projects: Project[]
  activeProjectId: string | null
  onProjectSelect?: (projectId: string) => void
}

const foundryStages = [
  { id: 'ignite', name: 'Ignite', emoji: '🔥' },
  { id: 'explore', name: 'Explore', emoji: '🔍' },
  { id: 'empathize', name: 'Empathize', emoji: '💭' },
  { id: 'differentiate', name: 'Differentiate', emoji: '⚔️' },
  { id: 'architect', name: 'Architect', emoji: '🏗️' },
  { id: 'validate', name: 'Validate', emoji: '✅' },
  { id: 'construct', name: 'Construct', emoji: '🔨' },
  { id: 'align', name: 'Align', emoji: '🎯' },
]

const launchStages = [
  { id: 'research', name: 'Research', emoji: '📊' },
  { id: 'position', name: 'Position', emoji: '📍' },
  { id: 'strategy', name: 'Strategy', emoji: '📋' },
  { id: 'campaigns', name: 'Campaigns', emoji: '📢' },
  { id: 'messaging', name: 'Messaging', emoji: '💬' },
  { id: 'channels', name: 'Channels', emoji: '📡' },
  { id: 'execute', name: 'Execute', emoji: '🚀' },
  { id: 'scale', name: 'Scale', emoji: '📈' },
]

const STATUS_CONFIG = {
  'not-started': { icon: FiCircle, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Not Started' },
  'in-progress': { icon: FiClock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'In Progress' },
  'done': { icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Done' },
}

// Clean Stage Card Component
const StageCard: React.FC<{
  stage: { id: string; name: string; emoji: string }
  status: StageStatus
  index: number
  osType: 'foundryos' | 'launchos'
  onStatusChange: (status: StageStatus) => void
}> = ({ stage, status, index, osType, onStatusChange }) => {
  const navigate = useNavigate()
  const [showOptions, setShowOptions] = useState(false)

  const config = STATUS_CONFIG[status] || STATUS_CONFIG['not-started']
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:border-gray-300 hover:shadow-md ${config.bg}`}
    >
      {/* Stage Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{stage.emoji}</span>
          <div>
            <p className="text-xs text-gray-500 font-medium">STAGE {String(index + 1).padStart(2, '0')}</p>
            <p className="font-semibold text-gray-900">{stage.name}</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-all ${config.color} hover:opacity-80`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
              >
                {(['not-started', 'in-progress', 'done'] as const).map((s) => {
                  const optConfig = STATUS_CONFIG[s]
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        onStatusChange(s)
                        setShowOptions(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 border-gray-100 ${
                        s === status ? 'bg-gray-50' : ''
                      }`}
                    >
                      {optConfig.label}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigate Button */}
        <motion.button
          onClick={() => navigate(`/${osType}/${stage.id}`)}
          whileHover={{ x: 4 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-gray-200"
          title="Go to stage"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// Progress Stats Component
const ProgressStats: React.FC<{
  progress: StageProgress
}> = ({ progress }) => {
  const total = Object.keys(progress).length
  const done = Object.values(progress).filter(s => s === 'done').length
  const inProgress = Object.values(progress).filter(s => s === 'in-progress').length

  const donePercent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-3 mb-8"
    >
      {/* Done */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiCheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-600">Completed</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{done}</p>
        <p className="text-xs text-gray-500">{donePercent}% done</p>
      </div>

      {/* In Progress */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiClock className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600">Active</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
        <p className="text-xs text-gray-500">{inProgress > 0 ? 'Keep going!' : 'Not started'}</p>
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Progress</p>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
            initial={{ width: '0%' }}
            animate={{ width: `${donePercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{donePercent}%</p>
      </div>
    </motion.div>
  )
}

// Main Progress Section Component
const ProgressSection: React.FC<ProgressSectionProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
}) => {
  const [progress, setProgress] = useState<StageProgress>({})

  const activeProject = projects.find(p => p.id === activeProjectId)
  const stages = activeProject?.os === 'launchos' ? launchStages : foundryStages

  // Initialize progress state
  useEffect(() => {
    if (stages && stages.length > 0) {
      const initialProgress = stages.reduce((acc, s) => ({ ...acc, [s.id]: 'not-started' as StageStatus }), {})
      setProgress(initialProgress)
    }
  }, [activeProject?.id, activeProject?.os])

  const handleStatusChange = (stageId: string, newStatus: StageStatus) => {
    setProgress(prev => ({
      ...prev,
      [stageId]: newStatus,
    }))
  }

  if (!projects || projects.length === 0) {
    return null
  }

  if (!activeProject) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-16"
    >
      {/* Project Toggle */}
      {projects.length > 1 && (
        <div className="mb-8 flex justify-center">
          <div className="flex rounded-full bg-gray-100 p-1.5 w-fit">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect?.(project.id)}
                className={`relative px-6 py-3 font-medium transition-all duration-300 rounded-full text-sm ${
                  activeProjectId === project.id
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {activeProjectId === project.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#FF3B00]"
                    layoutId="activeProject"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FiBook className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
        </div>
        <p className="text-sm text-gray-600">Track your stages through {activeProject.os === 'launchos' ? 'LaunchOS' : 'FoundryOS'}</p>
      </div>

      {/* Stats Cards */}
      <ProgressStats progress={progress} />

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {stages.map((stage, idx) => (
          <StageCard
            key={stage.id}
            stage={stage}
            status={progress[stage.id] || 'not-started'}
            index={idx}
            osType={activeProject.os}
            onStatusChange={(status) => handleStatusChange(stage.id, status)}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default ProgressSection
