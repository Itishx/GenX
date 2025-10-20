import { motion } from 'framer-motion'

const TwoOSSection = () => {
  return (
    <section id="os" className="relative w-full bg-white py-24 md:py-24 pb-0">
      <div className="mx-auto flex max-w-full flex-col items-center justify-center px-6">
        {/* Centered text container with max-width */}
        <motion.div
          className="flex max-w-3xl flex-col items-start justify-center text-left"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Heading */}
          <h2
            className="font-bold text-gray-900"
            style={{ fontFamily: "'Neue Haas Display', serif", fontSize: '60px', lineHeight: '0.95' }}
          >
            The 2 OS's you can{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              get started with
            </span>
          </h2>

          {/* Paragraph */}
          <p
            className="mt-8 text-gray-700"
            style={{ fontFamily: "'Neue Haas Display', serif", fontSize: '18px', lineHeight: '1.6' }}
          >
            Aviate gives you two AI-powered OSs to grow smarter. FoundryOS helps you validate, plan, and build your startup from zero. LaunchOS takes you from product to market with strategy, content, and insights. Together, they're your copilots from idea to scale.
          </p>
        </motion.div>

        {/* Spacer for tab switcher */}
        <div className="mt-0 w-full"></div>
      </div>
    </section>
  )
}

export default TwoOSSection
