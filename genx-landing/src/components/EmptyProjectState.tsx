import React from 'react'
import { motion } from 'framer-motion'
import { FiFolder } from 'react-icons/fi'

interface EmptyProjectStateProps {
  onCreateProject: () => void
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ onCreateProject }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          background: 'linear-gradient(to bottom right, #fff5f2, #ffe8e0)',
        }}
      >
        <FiFolder className="h-10 w-10" style={{ color: '#f03612' }} />
      </motion.div>

      <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
        Create your first project
      </h2>
      <p className="mb-8 max-w-md text-center text-gray-600">
        Set up your workspace, choose your OS, and start building. You can manage up to two projects at a time.
      </p>

      <motion.button
        onClick={onCreateProject}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-lg px-8 py-3 font-medium text-white transition-all shadow-md hover:shadow-lg"
        style={{
          background: 'linear-gradient(to right, #f03612, #f03612)',
        }}
      >
        Create Project
      </motion.button>
    </motion.div>
  )
}

export default EmptyProjectState
