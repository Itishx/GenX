import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const IntelligenceSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const shimmerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 },
    },
  }

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Left Column */}
          <motion.div variants={itemVariants} className="flex flex-col justify-start">
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 rounded-lg shadow-md flex items-center justify-center min-h-[680px]">
              <p className="text-gray-400 text-sm">Image Placeholder</p>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <p className="text-xs text-[#999999] font-medium mb-4 tracking-wide">POWERED BY INTELLIGENCE</p>
            
            <h2 className="text-3xl md:text-4xl font-semibold text-[#111111] leading-tight mb-6 max-w-lg" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              Built on the world's{' '}
              <motion.span
                variants={shimmerVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="text-[#ff5a00] inline-block bg-gradient-to-r from-[#ff5a00] via-[#ffb347] to-[#ff5a00] bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'slowShimmer 8s ease-in-out infinite',
                }}
              >
                strongest AI models
              </motion.span>
              {' '} — designed to think with you.
            </h2>

            <p className="text-[#555555] text-base leading-relaxed mb-10 max-w-md">
              Aviate combines OpenAI's reasoning models, Anthropic's safety layer, and Hugging Face's ecosystem to bring founders a workspace that feels as intelligent as it is intuitive.
            </p>

            {/* Feature Blocks */}
            <div className="space-y-0">
              <motion.div variants={itemVariants} whileHover={{ paddingLeft: 8 }} className="border-t border-[#eaeaea] py-6 cursor-pointer group transition-all">
                <h4 className="text-[#111111] font-medium text-base mb-2 group-hover:text-[#ff5a00] transition">Adaptive Intelligence</h4>
                <p className="text-[#555555] text-sm leading-relaxed">
                  Aviate evolves with your ideas, refining strategy and structure as you build.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ paddingLeft: 8 }} className="border-t border-[#eaeaea] py-6 cursor-pointer group transition-all">
                <h4 className="text-[#111111] font-medium text-base mb-2 group-hover:text-[#ff5a00] transition">Multi-Model Engine</h4>
                <p className="text-[#555555] text-sm leading-relaxed">
                  Powered by OpenAI, Anthropic, and Hugging Face models for accuracy and depth.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ paddingLeft: 8 }} className="border-t border-[#eaeaea] py-6 border-b cursor-pointer group transition-all">
                <h4 className="text-[#111111] font-medium text-base mb-2 group-hover:text-[#ff5a00] transition">Founder-First Design</h4>
                <p className="text-[#555555] text-sm leading-relaxed">
                  Every system in Aviate is designed to help you think clearly, not just execute.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default IntelligenceSection
