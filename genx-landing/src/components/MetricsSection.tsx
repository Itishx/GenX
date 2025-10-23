import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const MetricsSection = () => {
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

  const metrics = [
    {
      number: '2',
      heading: 'Operating Systems',
      subheading: 'FoundryOS and LaunchOS',
    },
    {
      number: '3',
      heading: 'AI Systems',
      subheading: 'OpenAI, Anthropic & Hugging Face',
    },
    {
      number: '100%',
      heading: 'Structured Intelligence',
      subheading: 'Clarity, scale, and growth',
    },
  ]

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Left Column - Heading */}
          <motion.div variants={itemVariants} className="flex flex-col justify-start">
            <p className="text-xs text-[#999999] font-medium mb-4 tracking-wide">BY THE NUMBERS</p>
            <h2 className="text-5xl md:text-6xl font-semibold text-[#111111] leading-tight mb-6" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              Built for scale and backed by{' '}
              <span className="text-[#ff5a00]">real metrics</span>
              {' '}that matter.
            </h2>
            <p className="text-base text-[#555555] leading-relaxed max-w-lg text-justify">
              Aviate is engineered to grow with you. From unified AI systems to flexible operating environments, every metric reflects our commitment to building infrastructure that scales without compromise.
            </p>
          </motion.div>

          {/* Right Column - Metrics Grid */}
          <motion.div
            className="grid grid-cols-1 gap-0"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="flex flex-col py-8 border-b border-[#eaeaea] last:border-b-0"
                variants={itemVariants}
                whileHover={{ paddingLeft: 8 }}
              >
                <div className="metric-number-large" style={{ fontFamily: "'Neue Haas Display', serif" }}>
                  {metric.number}
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-1" style={{ fontFamily: "'Neue Haas Display', serif" }}>
                  {metric.heading}
                </h3>
                <p className="text-sm text-[#555555]">
                  {metric.subheading}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default MetricsSection
