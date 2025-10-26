import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiTrendingUp, FiHome, FiSettings, FiMenu, FiX, FiActivity, FiSearch, FiUsers, FiHelpCircle, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import GlobalSearch from './GlobalSearch'

export interface Project {
  id: string
  name: string
  os: 'foundryos' | 'launchos'
  createdAt: Date
  isActive: boolean
}

interface ProjectSidebarProps {
  projects: Project[]
  activeProjectId: string | null
  onProjectSelect: (projectId: string) => void
  onSignOut: () => void
  isOpen: boolean
  onToggleSidebar: () => void
  onEditProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onViewActivity?: (project: Project) => void
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onSignOut,
  isOpen,
  onToggleSidebar,
  onEditProject,
  onDeleteProject,
  onViewActivity,
}) => {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [teamspacesExpanded, setTeamspacesExpanded] = useState(true)

  const getOSIcon = (os: string) => {
    return os === 'foundryos' ? (
      <FiBriefcase className="h-4 w-4" />
    ) : (
      <FiTrendingUp className="h-4 w-4" />
    )
  }

  const getOSLabel = (os: string) => {
    return os === 'foundryos' ? 'FoundryOS' : 'LaunchOS'
  }

  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDeleteProject(projectId)
      setOpenMenuId(null)
    }
  }

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation()
    onEditProject(project)
    setOpenMenuId(null)
  }

  const handleActivityClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation()
    if (onViewActivity) {
      onViewActivity(project)
    }
    setOpenMenuId(null)
  }

  const handleHomeClick = () => {
    navigate('/app/workspace-home')
  }

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

      {/* Sidebar - Notion Style */}
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

        {/* Header Section - Workspace Name */}
        <div className="px-4 py-6 border-b border-gray-200 flex-shrink-0">
          <motion.button
            onClick={onToggleSidebar}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-[#ff6b00] to-[#ff9248] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase() || 'W'}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {profile?.name || 'Workspace'}'s Workspace
              </span>
            </div>
            <FiChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>

        {/* Global Search Tab */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <GlobalSearch projects={projects} activeProjectId={activeProjectId} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Home Tab */}
          <div className="px-4 py-3">
            <motion.button
              onClick={handleHomeClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiHome className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <span className="font-medium">Home</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="mx-4 my-2 h-px bg-gray-200" />

          {/* Teamspaces Section */}
          <div className="px-4 py-3">
            <motion.button
              onClick={() => setTeamspacesExpanded(!teamspacesExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Teamspaces</span>
              <motion.div
                animate={{ rotate: teamspacesExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown className="h-3 w-3" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {teamspacesExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    onClick={() => {}}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiUsers className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>Team Activity</span>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => {}}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiUsers className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>Team Details</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="mx-4 my-2 h-px bg-gray-200" />

          {/* Agents Section */}
          <div className="px-4 py-3">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2">
              Your Projects
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
                        <div className="flex-shrink-0">
                          {getOSIcon(project.os)}
                        </div>
                        <span className="flex-1 truncate font-medium">
                          {project.name}
                        </span>
                        {activeProjectId === project.id && (
                          <div className="h-2 w-2 rounded-full bg-[#ff6b00] flex-shrink-0" />
                        )}
                      </button>

                      {/* Hover Menu */}
                      <AnimatePresence>
                        {(hoveredProjectId === project.id || openMenuId === project.id) && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId(openMenuId === project.id ? null : project.id)
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-gray-200 transition-colors"
                            title="Project settings"
                          >
                            <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.5 1.5H9.5V3h1V1.5zM10.5 16v1.5H9.5V16h1zM19 9.5v1H17.5v-1H19zM4.5 10v-1H3v1h1.5z" />
                            </svg>
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Settings Menu */}
                      <AnimatePresence>
                        {openMenuId === project.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -8 }}
                            className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
                          >
                            {onViewActivity && (
                              <>
                                <button
                                  onClick={(e) => handleActivityClick(e, project)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg flex items-center gap-2"
                                >
                                  <FiActivity className="h-4 w-4" />
                                  <span>View Activity</span>
                                </button>
                                <div className="border-t border-gray-100" />
                              </>
                            )}
                            <button
                              onClick={(e) => handleEditClick(e, project)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, project.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors last:rounded-b-lg border-t border-gray-100"
                            >
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
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

export default ProjectSidebar
