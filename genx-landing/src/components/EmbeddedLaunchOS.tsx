import React from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const stages = [
  {
    id: 'research',
    name: 'Research',
    description: 'Understand your audience, market, and competitive landscape.',
    insight: 'You\'ve identified your target audience and mapped the competitive landscape.',
  },
  {
    id: 'position',
    name: 'Position',
    description: 'Define your unique value proposition and brand positioning.',
    insight: 'Your unique value proposition is clear and differentiated in the market.',
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Craft your go-to-market strategy and launch roadmap.',
    insight: 'Your go-to-market strategy is well-defined with clear milestones.',
  },
  {
    id: 'campaigns',
    name: 'Campaigns',
    description: 'Plan multi-channel campaigns and content initiatives.',
    insight: 'Multi-channel campaigns are planned and content calendar is set.',
  },
  {
    id: 'messaging',
    name: 'Messaging',
    description: 'Develop compelling copy and brand messaging frameworks.',
    insight: 'Brand messaging is compelling and consistent across channels.',
  },
  {
    id: 'channels',
    name: 'Channels',
    description: 'Optimize distribution channels and audience touchpoints.',
    insight: 'Distribution channels are optimized for maximum audience reach.',
  },
  {
    id: 'execute',
    name: 'Execute',
    description: 'Launch campaigns and measure performance in real-time.',
    insight: 'Campaigns are live and performance metrics are being tracked.',
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Iterate, optimize, and scale what works across channels.',
    insight: 'High-performing channels are being scaled with proven ROI.',
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
    navigate(`/launch/${stage.id}`)
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
const EmbeddedLaunchOS: React.FC = () => {
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
            LaunchOS Stages
          </h2>
          <p className="text-[#666666]">
            Take your venture to market through 8 strategic launch stages
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

export default EmbeddedLaunchOS
