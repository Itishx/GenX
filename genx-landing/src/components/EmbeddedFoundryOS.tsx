import React from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
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

// Main Embedded Component
const EmbeddedFoundryOS: React.FC = () => {
  return (
    <section className="relative py-12 px-6 md:px-8 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-semibold text-[#111111] mb-2">
            FoundryOS Stages
          </h2>
          <p className="text-[#666666]">
            Build the foundation of your venture through 8 transformative stages
          </p>
        </motion.div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stages.map((stage, idx) => (
            <WorkspaceCard
              key={stage.id}
              stage={stage}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmbeddedFoundryOS