import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiTrendingUp, FiLogOut, FiSettings, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

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
}) => {
  const { profile } = useAuth()
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

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

  return (
    <>
      {/* Sidebar Toggle Button (visible on mobile and desktop) */}
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
        className={`flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0'
        } md:relative md:w-64 fixed md:fixed z-40 md:z-auto`}
        initial={false}
        animate={{ width: isOpen ? 256 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header with Close Button */}
        <div className="border-b border-gray-200 px-6 py-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">
            Your Projects
          </h2>
          <motion.button
            onClick={onToggleSidebar}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100 transition-colors md:hidden flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AnimatePresence>
            {projects.length === 0 ? (
              <motion.div
                className="flex items-center justify-center px-3 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-center text-sm text-gray-400 whitespace-nowrap">
                  No projects yet. Create one to get started.
                </p>
              </motion.div>
            ) : (
              projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  className="relative mb-2"
                >
                  <button
                    onClick={() => onProjectSelect(project.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-all ${
                      activeProjectId === project.id
                        ? 'border-[#f03612] bg-[#fff5f2]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                          {getOSIcon(project.os)}
                          <span>{getOSLabel(project.os)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {activeProjectId === project.id && (
                          <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: '#f03612' }} />
                        )}
                        {(hoveredProjectId === project.id || openMenuId === project.id) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === project.id ? null : project.id)
                              }}
                              className="p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                              title="Project settings"
                            >
                              <FiSettings className="h-4 w-4 text-gray-500" />
                            </button>
                            
                            {/* Settings Menu */}
                            <AnimatePresence>
                              {openMenuId === project.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: -8 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                                  className="absolute right-0 mt-1 w-32 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
                                >
                                  <button
                                    onClick={(e) => handleEditClick(e, project)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg"
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
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Profile Section at Bottom */}
        <div className="border-t border-gray-200 px-3 py-4 flex-shrink-0">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, #f03612, #c71200)' }}>
              <span className="text-xs font-semibold text-white">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {profile?.name || 'User'}
              </p>
              <p className="truncate text-xs text-gray-500">Your workspace</p>
            </div>
          </div>
          <motion.button
            onClick={onSignOut}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiLogOut className="h-4 w-4" />
            <span>Sign out</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}

export default ProjectSidebar
