import { motion } from 'framer-motion'

const MotionHeadlineSection = () => {
  // Animation variants for each phrase
  const phraseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: i * 0.3,
      },
    }),
  }

  const aviate = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
        delay: 0.9,
      },
    },
  }

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-16">
      <motion.div
        className="mx-auto flex max-w-4xl flex-col items-start justify-center px-6 text-left"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Small top headline */}
        <motion.h3
          className="mb-8 text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'Neue Haas Display', serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Your startup deserves more than ideas — it deserves Aviate.
        </motion.h3>

        {/* Main Headline with Sequential Animation */}
        <div className="relative">
          <h2
            className="font-black text-gray-900"
            style={{
              fontFamily: "'Neue Haas Display', serif",
              fontSize: 'clamp(42px, 8vw, 80px)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
            }}
          >
            {/* Phrase 1: "From your first idea" */}
            <motion.span
              custom={0}
              variants={phraseVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="block"
            >
              From your first idea
            </motion.span>

            {/* Phrase 2: "to your first user" */}
            <motion.span
              custom={1}
              variants={phraseVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="block"
            >
              to your first user
            </motion.span>

            {/* Phrase 3: "— Aviate builds with you." */}
            <motion.span
              custom={2}
              variants={phraseVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="block"
            >
              —{' '}
              <motion.span
                variants={aviate}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="relative inline-block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                }}
              >
                Aviate
              </motion.span>
              {' '}builds with you.
            </motion.span>
          </h2>

          {/* Subtle decorative elements */}
          <motion.div
            className="pointer-events-none absolute -left-10 top-1/4 h-24 w-24 rounded-full bg-blue-400/10 blur-3xl"
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="pointer-events-none absolute -right-10 bottom-1/4 h-32 w-32 rounded-full bg-purple-400/10 blur-3xl"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default MotionHeadlineSection
