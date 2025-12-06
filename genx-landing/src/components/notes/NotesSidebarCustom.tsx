import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiChevronDown, FiHome, FiSettings, FiHelpCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import GlobalSearch from '../GlobalSearch'
import { Project } from '../../types'
import { ALL_STAGES } from '../../lib/stages'

interface NotesSidebarCustomProps {
  projects: Project[]
  activeProjectId: string | null
  onProjectSelect: (projectId: string) => void
  isOpen: boolean
  onToggleSidebar: () => void
  currentStageId?: string | null
}

const NotesSidebarCustom: React.FC<NotesSidebarCustomProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  isOpen,
  onToggleSidebar,
  currentStageId,
}) => {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)

  const getOSIcon = (os: string) => {
    return os === 'foundryos' ? '🏗️' : '🚀'
  }

  const getStageName = (stageId: string | null | undefined): string | null => {
    if (!stageId) return null
    const stage = ALL_STAGES[stageId as keyof typeof ALL_STAGES]
    return stage ? stage.name : null
  }

  const handleHomeClick = () => {
    navigate('/app/workspace-home')
  }

  const handleWorkspaceClick = () => {
    navigate('/app/agents')
  }

  const stageName = getStageName(currentStageId)
  const headerTitle = stageName ? `${stageName}'s Notes` : `${profile?.name || 'Avionote'}'s Avionote`

  return (
    <>
      {/* Sidebar Toggle Button (visible on mobile) */}
      {!isOpen && (
        <motion.button
          onClick={onToggleSidebar}
          className="fixed left-4 top-4 z-50 rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </motion.button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          onClick={onToggleSidebar}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`flex h-screen flex-col bg-white transition-all duration-300 border-r border-gray-200 ${
          isOpen ? 'w-64' : 'w-0'
        } md:relative md:w-64 fixed md:fixed z-40 md:z-auto`}
        initial={false}
        animate={{ width: isOpen ? 256 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Close Button - Mobile Only */}
        <div className="md:hidden absolute top-4 right-4">
          <motion.button
            onClick={onToggleSidebar}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Header Section - Dynamic based on current stage */}
        <div className="px-4 py-6 border-b border-gray-200 flex-shrink-0">
          <motion.div
            key={`header-${currentStageId}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-[#ff6b00] to-[#ff9248] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {headerTitle}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Global Search Tab */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <GlobalSearch projects={projects} activeProjectId={activeProjectId} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Workspace Section */}
          <div className="px-4 py-3">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2">
              Navigation
            </div>

            <div className="mt-2 space-y-1">
              {/* Home Tab */}
              <motion.button
                onClick={handleHomeClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiHome className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="font-medium">Home</span>
              </motion.button>

              {/* Back to Workspace Tab */}
              <motion.button
                onClick={handleWorkspaceClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base">🏢</span>
                <span className="font-medium">Workspace</span>
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 my-2 h-px bg-gray-200" />

          {/* Projects Section */}
          <div className="px-4 py-3">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2">
              Projects
            </div>

            <div className="mt-2 space-y-1">
              {projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 py-4 text-center text-xs text-gray-400"
                >
                  No projects yet. Create one to get started.
                </motion.div>
              ) : (
                <AnimatePresence>
                  {projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ delay: idx * 0.05 }}
                      onMouseEnter={() => setHoveredProjectId(project.id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                      className="relative group"
                    >
                      <button
                        onClick={() => onProjectSelect(project.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group-hover:bg-gray-100 ${
                          activeProjectId === project.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex-shrink-0 text-base">
                          {getOSIcon(project.os)}
                        </div>
                        <span className="flex-1 truncate font-medium">
                          {project.name}
                        </span>
                        {activeProjectId === project.id && (
                          <div className="h-2 w-2 rounded-full bg-[#ff6b00] flex-shrink-0" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-gray-200 flex-shrink-0" />

        {/* Bottom Section - Settings & Help */}
        <div className="px-4 py-3 space-y-2 flex-shrink-0">
          <motion.button
            onClick={() => navigate('/app/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSettings className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/app/help')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiHelpCircle className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <span className="font-medium">Help</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}

export default NotesSidebarCustom
