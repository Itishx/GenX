import { motion } from 'framer-motion'
import { useState } from 'react'

const OSFlowSection = () => {
  const [hoveredCard, setHoveredCard] = useState<'foundry' | 'launch' | null>(null)

  const taglineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: i * 0.2,
      },
    }),
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay,
      },
    }),
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  const arrowVariants = {
    animate: {
      strokeDashoffset: [1000, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatDelay: 0.5,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-white to-gray-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Title & Taglines */}
        <motion.div
          className="mb-24 md:mb-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2
            className="font-black text-gray-900 mb-8"
            style={{
              fontFamily: "'Neue Haas Display', serif",
              fontSize: 'clamp(40px, 8vw, 64px)',
              lineHeight: '1.1',
            }}
          >
            From Idea to Launch
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              — Powered by Aviate
            </span>
          </h2>

          {/* Taglines with sequential animation */}
          <div className="space-y-1">
            <motion.p
              custom={0}
              variants={taglineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="text-lg text-gray-600"
              style={{ fontFamily: "'Neue Haas Display', serif" }}
            >
              Foundry builds your startup. Launch grows it. Together, they complete your journey.
            </motion.p>

            <motion.p
              custom={1}
              variants={taglineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="text-lg text-gray-600"
              style={{ fontFamily: "'Neue Haas Display', serif" }}
            >
              Use them together or on their own — Aviate adapts to where you are.
            </motion.p>

            <motion.p
              custom={2}
              variants={taglineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Neue Haas Display', serif" }}
            >
              Start anywhere. Grow everywhere. That's Aviate.
            </motion.p>
          </div>
        </motion.div>

        {/* Flow Cards Container */}
        <motion.div
          className="relative mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-2 lg:gap-4 mb-24 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left Card - FoundryOS */}
          <motion.div
            custom={0.2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            onHoverStart={() => setHoveredCard('foundry')}
            onHoverEnd={() => setHoveredCard(null)}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-80 flex-shrink-0 self-center rounded-2xl bg-white border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)' }}
          >
            {/* Icon Placeholder */}
            <div className="mb-6 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50">
              <motion.div
                className="text-3xl flex items-center justify-center"
                animate={hoveredCard === 'foundry' ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                💡
              </motion.div>
            </div>

            {/* Content */}
            <h3
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Neue Haas Display', serif" }}
            >
              FoundryOS
            </h3>

            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              Validate, plan, and build your startup from zero.
            </p>

            {/* Tag */}
            <div className="inline-block px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
              <span className="text-sm font-semibold text-orange-700">From idea to MVP</span>
            </div>
          </motion.div>

          {/* Connector Container - Positioned absolutely relative to parent */}
          <motion.div
            className="relative hidden md:flex items-center justify-center flex-shrink-0"
            style={{ width: '200px', height: '100px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* Straight connector line */}
            <svg
              className="w-full h-full"
              viewBox="0 0 200 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Straight line from left box to right box */}
              <motion.line
                x1="0"
                y1="50"
                x2="200"
                y2="50"
                stroke="#FF6B35"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
              
              {/* Arrowhead at the end */}
              <motion.path
                d="M 190 47 L 200 50 L 190 53"
                stroke="#FF6B35"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                viewport={{ once: true }}
              />
              
              {/* Animated flowing dot */}
              <motion.circle
                r="2"
                fill="#FF6B35"
              >
                <animateMotion
                  dur="2.5s"
                  repeatCount="indefinite"
                  path="M 0 50 L 200 50"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </motion.circle>
            </svg>
          </motion.div>

          {/* Mobile Vertical Connector */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
            className="md:hidden flex flex-col items-center gap-2"
          >
            <p className="text-sm font-semibold text-gray-600 text-center" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              Seamlessly continue your journey
            </p>
            <div className="w-1 h-16 bg-gradient-to-b from-orange-500 to-orange-300 rounded-full" />
          </motion.div>

          {/* Right Card - LaunchOS */}
          <motion.div
            custom={0.4}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            onHoverStart={() => setHoveredCard('launch')}
            onHoverEnd={() => setHoveredCard(null)}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-80 flex-shrink-0 self-center rounded-2xl bg-white border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)' }}
          >
            {/* Icon Placeholder */}
            <div className="mb-6 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50">
              <motion.div
                className="text-3xl flex items-center justify-center"
                animate={hoveredCard === 'launch' ? { scale: 1.1, rotate: -10 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                🚀
              </motion.div>
            </div>

            {/* Content */}
            <h3
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Neue Haas Display', serif" }}
            >
              LaunchOS
            </h3>

            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              Take your product to market with content, strategy, and insights.
            </p>

            {/* Tag */}
            <div className="inline-block px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
              <span className="text-sm font-semibold text-orange-700">From MVP to traction</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 rounded-full border-2 border-gray-900 bg-white text-gray-900 font-semibold text-base transition-all hover:bg-gray-900 hover:text-white hover:shadow-xl"
            style={{ fontFamily: "'Neue Haas Display', serif" }}
          >
            Get Started
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default OSFlowSection
