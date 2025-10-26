import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="home" className="relative flex min-h-[100vh] items-center justify-center bg-white text-gray-900 pt-32 pb-20 md:pt-40">
      <div className="container px-6 text-center">
        <motion.h1
          className="mx-auto max-w-4xl font-bold tracking-tight text-gray-900"
          style={{ fontFamily: "'Neue Haas Display', serif", fontSize: '75px', lineHeight: '0.92' }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Your AI{' '}
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Operating System
          </span>
          {' '}to make{' '}
          <span className="text-gray-900">
            business easy
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base text-gray-600 leading-relaxed md:text-lg"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          Aviate brings together everything founders need — from validating ideas to launching and scaling businesses — powered by intelligent copilots.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
          >
            Get Started Free
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
          >
            Join the Waitlist
          </a>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="mx-auto mt-14 w-full max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
            style={{ transformOrigin: 'center' }}
          >
            {/* Image container */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 shadow-2xl" style={{ borderRadius: '20px', aspectRatio: '16 / 9' }}>
              <img
                src="/assets/herosection.jpg"
                alt="Aviate Dashboard Preview"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'left center', willChange: 'transform' }}
                loading="lazy"
              />
            </div>

            {/* Floating decorative elements */}
            <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-orange-500/10 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-orange-600/10 blur-3xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero