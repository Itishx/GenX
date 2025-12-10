import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { FOUNDRY_STAGES_ORDER, LAUNCH_STAGES_ORDER, ALL_STAGES } from '../../lib/stages';

interface StageNavbarProps {
  stageName: string
  stageDescription: string
  stageId: string
  onGoToNextStage: () => void;
  onToggleNotesSidebar: () => void;
  notesOpen?: boolean;
}

const StageNavbar: React.FC<StageNavbarProps> = ({ 
  stageName, 
  stageDescription,
  stageId,
  onGoToNextStage,
  onToggleNotesSidebar,
  notesOpen = false,
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Determine which OS we're in based on the route
  const isFoundry = location.pathname.startsWith('/foundry/')
  const osName = isFoundry ? 'FoundryOS' : 'LaunchOS'
  const currentStages = isFoundry ? FOUNDRY_STAGES_ORDER : LAUNCH_STAGES_ORDER;
  const currentIndex = currentStages.indexOf(stageId);
  const nextStageId = currentIndex < currentStages.length - 1 ? currentStages[currentIndex + 1] : null;
  const nextStage = nextStageId ? ALL_STAGES[nextStageId as keyof typeof ALL_STAGES] : null;

  const handleBack = () => {
    navigate('/app/agents')
  }

  return (
    <div className="fixed inset-x-0 top-0 z-30 border-b border-[#e8e8e8] bg-white/98 backdrop-blur-sm shadow-sm">
      <div className="h-20 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Left: Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all hover:shadow-sm group"
            title={`Back to ${osName}`}
          >
            <FiArrowLeft className="w-4 h-4 group-hover:text-gray-900 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{osName}</span>
          </button>
          
          <div className="text-gray-300">/</div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <h1 className="text-base font-semibold text-gray-900">{stageName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Stage Workspace</p>
          </motion.div>
        </motion.div>

        {/* Right: Action buttons */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          {/* Avionote Sidebar Toggle */}
          <motion.button
            onClick={onToggleNotesSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              notesOpen
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
            }`}
            title="Open Avionote sidebar"
          >
            <span className="hidden sm:inline">Avionote</span>
          </motion.button>
          
          <div className="w-px h-6 bg-gray-200" />

          {nextStage && (
            <motion.button
              onClick={onGoToNextStage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-transparent bg-[#ff6b00] text-white text-sm font-semibold transition-all hover:bg-[#e66000] shadow-sm"
              title={`Go to next stage: ${nextStage.name}`}
            >
              <span className="hidden sm:inline">Next Stage</span>
              <FiArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default StageNavbar
