import React from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiDownload, FiMenu, FiShare2 } from 'react-icons/fi'

interface ProjectTabsProps {
  projects: Array<{ id: string; name: string }>
  activeProjectId: string | null
  onProjectSelect: (projectId: string) => void
  onNewProject: () => void
  onExport?: () => void
  onShare?: () => void
  onToggleSidebar: () => void
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onNewProject,
  onExport,
  onShare,
  onToggleSidebar,
}) => {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      {/* Left: Sidebar Toggle and Project Name */}
      <div className="flex items-center gap-4 flex-1">
        <motion.button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors hidden md:block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </motion.button>
        <h1 className="text-lg font-semibold text-gray-900">
          {projects.find((p) => p.id === activeProjectId)?.name || 'Projects'}
        </h1>
      </div>

      {/* Center: Tab Navigation - Pill Style */}
      <div className="flex items-center gap-2">
        {projects.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1">
            {projects.map((project) => (
              <motion.button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`relative px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                  activeProjectId === project.id
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeProjectId === project.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: '#f03612' }}
                    layoutId="activeProjectTab"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{project.name}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center justify-end gap-3 flex-1">
        {onShare && (
          <motion.button
            onClick={onShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Share project"
          >
            <FiShare2 className="h-5 w-5" />
          </motion.button>
        )}
        {onExport && (
          <motion.button
            onClick={onExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Export project"
          >
            <FiDownload className="h-5 w-5" />
          </motion.button>
        )}
        <motion.button
          onClick={onNewProject}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium text-white transition-all"
          style={{
            background: 'linear-gradient(to right, #f03612, #f03612)',
          }}
        >
          <FiPlus className="h-4 w-4" />
          <span>New Project</span>
        </motion.button>
      </div>
    </div>
  )
}

export default ProjectTabs
