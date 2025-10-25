import React, { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { FiBriefcase, FiArrowRight, FiCheckCircle, FiCircle, FiClock, FiChevronDown, FiMove } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const stages = [
  {
    id: 'ignite',
    name: 'Ignite',
    description: 'Turn curiosity into a clear, structured idea.',
    insight: 'You\'ve clarified your core vision and identified the problem you\'re solving.',
  },
  {
    id: 'explore',
    name: 'Explore',
    description: 'Discover patterns, opportunities, and spaces that matter.',
    insight: 'You\'ve mapped the landscape and discovered key opportunities in your market.',
  },
  {
    id: 'empathize',
    name: 'Empathize',
    description: 'See your users clearly before you build for them.',
    insight: 'You understand your users deeply and have identified their primary pain points.',
  },
  {
    id: 'differentiate',
    name: 'Differentiate',
    description: 'Analyze competitors and carve your unique edge.',
    insight: 'You\'ve found your competitive advantage and defined what makes you different.',
  },
  {
    id: 'architect',
    name: 'Architect',
    description: "Define your product's foundation, features, and logic.",
    insight: 'Your product architecture is solid and feature set is well-defined.',
  },
  {
    id: 'validate',
    name: 'Validate',
    description: 'Gather insights, measure interest, and prove demand.',
    insight: 'Market validation shows strong demand and user interest.',
  },
  {
    id: 'construct',
    name: 'Construct',
    description: 'Plan sprints, map systems, and structure your build.',
    insight: 'Your development roadmap is structured and sprints are well-planned.',
  },
  {
    id: 'align',
    name: 'Align',
    description: 'Sync your strategy, message, and design with LaunchOS.',
    insight: 'Your strategy, messaging, and design are perfectly aligned for launch.',
  },
]

type StageStatus = 'not-started' | 'in-progress' | 'done'
type TabType = 'workspace' | 'progress'
type StageProgress = Record<string, StageStatus>

// Workspace Tab Card
const WorkspaceCard: React.FC<{
  stage: typeof stages[0]
  index: number
}> = ({ stage, index }) => {
  const navigate = useNavigate()
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  })

  const handleStartClick = () => {
    navigate(`/foundry/${stage.id}`)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      className="group"
    >
      <div className="bg-white border border-[#e8e8e8] rounded-xl p-6 md:p-8 text-left w-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#999999] font-medium mb-1">
                STAGE {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="text-lg font-semibold text-[#111111]">{stage.name}</h3>
            </div>
          </div>
          <p className="text-[#666666] text-sm leading-relaxed">
            {stage.description}
          </p>
          <button
            onClick={handleStartClick}
            className="mt-2 px-4 py-2 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors duration-300 inline-block w-fit"
          >
            Start →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Status dropdown for individual cards
const StatusDropdown: React.FC<{
  currentStatus: StageStatus
  onStatusChange: (status: StageStatus) => void
}> = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const statusOptions: { value: StageStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'not-started', label: 'Not Started', icon: <FiCircle className="w-4 h-4" />, color: '#999999' },
    { value: 'in-progress', label: 'In Progress', icon: <FiClock className="w-4 h-4" />, color: '#3b82f6' },
    { value: 'done', label: 'Done', icon: <FiCheckCircle className="w-4 h-4" />, color: '#16a34a' },
  ]

  const current = statusOptions.find(s => s.value === currentStatus)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e8e8e8] bg-white hover:bg-[#fafafa] transition-colors text-sm"
        style={{ color: current?.color }}
      >
        {current?.icon}
        <span className="text-xs font-medium">{current?.label}</span>
        <FiChevronDown className="w-3 h-3 ml-1" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-white border border-[#e8e8e8] rounded-lg shadow-lg z-10"
          >
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#f5f5f5] transition-colors first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 border-[#e8e8e8]"
                style={{ color: option.color }}
              >
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Kanban Column with Reorder
const KanbanColumn: React.FC<{
  title: string
  status: StageStatus
  items: typeof stages
  progress: StageProgress
  onReorder: (newOrder: typeof stages) => void
  onStatusChange: (stageId: string, newStatus: StageStatus) => void
}> = ({ title, status, items, progress, onReorder, onStatusChange }) => {
  const columnStages = items.filter(s => progress[s.id] === status)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 min-w-0"
    >
      <div className="rounded-xl bg-[#f7f7f7] p-4 min-h-[600px] flex flex-col">
        <div className="mb-4">
          <h3 className="text-xs uppercase font-medium text-[#999999] tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-[#bfbfbf] mt-1">
            {columnStages.length} {columnStages.length === 1 ? 'stage' : 'stages'}
          </p>
        </div>

        <Reorder.Group
          axis="y"
          values={columnStages}
          onReorder={(newOrder) => {
            const allStages = [...items]
            const otherStages = allStages.filter(s => progress[s.id] !== status)
            const reorderedAll = [...otherStages, ...newOrder]
            onReorder(reorderedAll)
          }}
          className="flex-1 space-y-3"
        >
          {columnStages.map((stage) => (
            <Reorder.Item
              key={stage.id}
              value={stage}
              className="bg-white rounded-lg p-5 border border-[#e8e8e8] cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <FiMove className="w-4 h-4 mt-1.5 text-[#bfbfbf] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#999999] font-medium mb-1.5">
                    STAGE {String(items.indexOf(stage) + 1).padStart(2, '0')}
                  </p>
                  <p className="text-base font-semibold text-[#111111]">{stage.name}</p>
                  <p className="text-sm text-[#666666] mt-3 leading-relaxed">{stage.description}</p>
                </div>
                <StatusDropdown
                  currentStatus={progress[stage.id]}
                  onStatusChange={(newStatus) => onStatusChange(stage.id, newStatus)}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {columnStages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="text-[#bfbfbf]">
              <p className="text-sm">No stages yet</p>
              <p className="text-sm mt-2">Drag stages here or change status</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Summary Section
const SummarySection: React.FC<{
  progress: StageProgress
}> = ({ progress }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const completedStages = stages.filter(s => progress[s.id] === 'done')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5 }}
      className="mt-12 pt-12 border-t border-[#e8e8e8]"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#111111] mb-2">
          Everything you've figured out so far
        </h2>
        <p className="text-[#999999] text-sm">
          A live summary that evolves with your progress.
        </p>
      </div>

      <AnimatePresence>
        {completedStages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#fafafa] border border-[#e8e8e8] rounded-lg p-8 text-center"
          >
            <p className="text-[#999999] text-sm">
              Mark stages as done to see insights appear here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {completedStages.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-[#e8e8e8] rounded-lg p-6"
              >
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#111111] text-sm mb-2">
                      {stage.name}
                    </h3>
                    <p className="text-[#666666] text-sm leading-relaxed">
                      {stage.insight}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Tab Navigation
const TabNavigation: React.FC<{
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8 flex justify-center gap-4 rounded-full bg-gray-100 p-1.5 w-fit mx-auto">
      {[
        { id: 'workspace', label: 'Workspace' },
        { id: 'progress', label: 'Progress' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as TabType)}
          className={`relative px-8 py-3 font-medium transition-all duration-300 rounded-full text-base ${
            activeTab === tab.id as TabType
              ? 'text-white'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          {activeTab === tab.id as TabType && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#FF3B00' }}
              layoutId="activeTab"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// Main Embedded Component
const EmbeddedFoundryOS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('workspace')
  const [progress, setProgress] = useState<StageProgress>(
    stages.reduce((acc, s) => ({ ...acc, [s.id]: 'not-started' }), {})
  )
  const [stageOrder, setStageOrder] = useState(stages)

  const handleStatusChange = (stageId: string, newStatus: StageStatus) => {
    setProgress(prev => ({
      ...prev,
      [stageId]: newStatus,
    }))
  }

  const handleReorder = (newOrder: typeof stages) => {
    setStageOrder(newOrder)
  }

  return (
    <section className="relative py-12 px-6 md:px-8 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#111111] mb-3">
            FoundryOS
          </h1>
          <p className="text-base text-[#666666] max-w-2xl leading-relaxed">
            Your strategic workspace for clarity, structure, and progress.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'workspace' ? (
            <motion.div
              key="workspace-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stageOrder.map((stage, idx) => (
                  <WorkspaceCard
                    key={stage.id}
                    stage={stage}
                    index={stageOrder.indexOf(stage)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="progress-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6">
                <KanbanColumn
                  title="Not Started"
                  status="not-started"
                  items={stageOrder}
                  progress={progress}
                  onReorder={handleReorder}
                  onStatusChange={handleStatusChange}
                />
                <KanbanColumn
                  title="In Progress"
                  status="in-progress"
                  items={stageOrder}
                  progress={progress}
                  onReorder={handleReorder}
                  onStatusChange={handleStatusChange}
                />
                <KanbanColumn
                  title="Done"
                  status="done"
                  items={stageOrder}
                  progress={progress}
                  onReorder={handleReorder}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Section - visible in Progress tab */}
        {activeTab === 'progress' && <SummarySection progress={progress} />}
      </div>
    </section>
  )
}

export default EmbeddedFoundryOS