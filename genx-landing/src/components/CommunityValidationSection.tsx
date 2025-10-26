import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/shimmer.css'

const CommunityValidationSection = () => {
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
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const validationPoints = [
    {
      title: 'Talk to Real Founders (when needed)',
    },
    {
      title: 'Get your idea validated by Humans + AI',
    },
    {
      title: "Soon, be a part of a thriving founder's community",
    },
  ]

  return (
    <section ref={ref} className="bg-white py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Left Column - Heading and Description */}
          <motion.div variants={itemVariants} className="flex flex-col justify-start">
            <p className="text-xs text-[#999999] font-medium mb-4 tracking-wide">COMMUNITY VALIDATION</p>
            <h2 className="text-5xl md:text-6xl font-semibold text-[#111111] leading-tight mb-6" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              But wait— it's not all{' '}
              <span className="text-[#ff5a00]">AI</span>
              {' '}(*well it is, but it isn't at times)
            </h2>
            <p className="text-base text-[#555555] leading-relaxed max-w-lg text-justify">
              We've tied up with one of the biggest startup communities with 700+ active founders who you could talk to for some real validation. This way, your idea will be validated not just by the strongest AI models but also real humans who've built (and probably sold) businesses before. Best of both worlds eh? Well, that's just an <motion.span variants={shimmerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="italic font-semibold shimmer">Aviate Experience</motion.span>
            </p>
          </motion.div>

          {/* Right Column - Validation Points Grid */}
          <motion.div
            className="grid grid-cols-1 gap-0"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {validationPoints.map((point, index) => (
              <motion.div
                key={index}
                className="flex flex-col py-8 border-b border-[#eaeaea] last:border-b-0 cursor-pointer group transition-all"
                variants={itemVariants}
                whileHover={{ paddingLeft: 8 }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-[#111111] group-hover:text-[#ff5a00] transition" style={{ fontFamily: "'Neue Haas Display', serif" }}>
                  {point.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CommunityValidationSection