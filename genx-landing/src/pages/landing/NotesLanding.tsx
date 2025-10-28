import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const AvionoteLanding: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStartWriting = () => {
    navigate('/app/agents')
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const features = [
    {
      title: 'Distraction-Free Writing',
      description: 'A minimal editor that fades away, leaving only your thoughts. No toolbars, no clutter — just pure focus.',
    },
    {
      title: 'Instant Auto-Save',
      description: 'Every word is saved instantly. Never lose a thought again. Your ideas are always safe.',
    },
    {
      title: 'Seamless Organization',
      description: 'Keep all your notes organized and searchable. Find anything in seconds, always at your fingertips.',
    },
    {
      title: 'Built into Aviate',
      description: 'Your notes live inside your workspace. One less tool to manage, more tools to focus on.',
    },
    {
      title: 'Rich Formatting',
      description: 'Headings, lists, code blocks, quotes — all the structure you need without the complexity.',
    },
    {
      title: 'Privacy First',
      description: 'Your words stay yours. Complete control over your ideas. Complete peace of mind.',
    },
  ]

  const stageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: 'easeOut' },
    }),
    hover: {
      y: -4,
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Navbar />
      <main className="pt-16">
        {/* ============ 1️⃣ HERO SECTION ============ */}
        <section className="relative w-full bg-white px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl text-center">
            {/* Main Heading */}
            <motion.h1
              className="mb-6 font-bold tracking-tight text-gray-900"
              style={{
                fontFamily: "'Neue Haas Display', serif",
                fontSize: 'clamp(48px, 9vw, 72px)',
                lineHeight: '1.1',
              }}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Write. Think.{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Build clarity.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            >
              Your ideas deserve a space that feels as good as they sound. Avionote is the cleanest writing experience built for founders who think deeply and build fast.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <motion.button
                onClick={handleStartWriting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg gap-2"
              >
                Open Avionote
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-8 py-3 text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="mx-auto mt-16 w-full max-w-6xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
                style={{ transformOrigin: 'center' }}
              >
                <div
                  className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 shadow-2xl"
                  style={{ borderRadius: '20px', aspectRatio: '16 / 9' }}
                >
                  <img
                    src="/assets/herosection.jpg"
                    alt="Avionote Preview"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-orange-500/10 blur-3xl"></div>
                  <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-orange-600/10 blur-3xl"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============ 2️⃣ PHILOSOPHY SECTION ============ */}
        <section className="relative w-full bg-gradient-to-b from-white to-gray-50 px-6 py-32 md:py-40">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 lg:gap-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left Column - Content */}
              <motion.div
                className="flex flex-col justify-start"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <p className="text-xs text-gray-500 font-medium mb-4 tracking-wide uppercase">Founder-First Design</p>

                <h2
                  className="mb-8 font-bold text-gray-900 text-justify"
                  style={{
                    fontFamily: "'Neue Haas Display', serif",
                    fontSize: 'clamp(32px, 6vw, 48px)',
                    lineHeight: '1.2',
                  }}
                >
                  A space built to think clearly, write freely.
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-gray-600 text-justify">
                  Avionote isn't just another notes app. It's designed for founders, builders, and thinkers who know that clarity of thought comes from clarity of space. Every detail is intentional — from the minimal editor to the instant auto-save — to get out of your way and let you focus on what matters.
                </p>

                <div className="rounded-lg bg-white border border-gray-100 p-6 mb-6">
                  <p className="text-sm text-gray-500 text-center md:text-left">
                    <span className="font-semibold text-gray-700">Built for clarity</span> • <span className="font-semibold text-gray-700">Zero distraction</span> • <span className="font-semibold text-gray-700">Yours to keep</span>
                  </p>
                </div>

                {/* Feature Blocks */}
                <div className="space-y-0">
                  <motion.div
                    whileHover={{ paddingLeft: 8 }}
                    className="border-t border-gray-200 py-6 cursor-pointer group transition-all"
                  >
                    <h4 className="text-gray-900 font-medium text-lg mb-2 group-hover:text-orange-600 transition">
                      Minimal Yet Powerful
                    </h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Write with zero distractions. Bold, italic, headings, lists — all the formatting you need without the complexity that bogs you down.
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ paddingLeft: 8 }}
                    className="border-t border-gray-200 py-6 cursor-pointer group transition-all"
                  >
                    <h4 className="text-gray-900 font-medium text-lg mb-2 group-hover:text-orange-600 transition">
                      Always Saved, Always Yours
                    </h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Every keystroke is saved instantly. Your notes are stored securely and synced with your workspace. Peace of mind, guaranteed.
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ paddingLeft: 8 }}
                    className="border-t border-gray-200 py-6 border-b cursor-pointer group transition-all"
                  >
                    <h4 className="text-gray-900 font-medium text-lg mb-2 group-hover:text-orange-600 transition">
                      Built for Aviate Builders
                    </h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Seamlessly integrated into your Aviate workspace. Your notes live right where your ideas do — one less tool, more focus.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Image */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col justify-start"
              >
                <div
                  className="w-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 rounded-lg shadow-md flex items-center justify-center min-h-[680px]"
                  style={{ aspectRatio: '1 / 1.2' }}
                >
                  <img
                    src="/assets/herosection.jpg"
                    alt="Avionote Interface"
                    className="h-full w-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============ 3️⃣ FEATURES SECTION ============ */}
        <section id="features" className="relative w-full bg-white px-6 py-32 md:py-40">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="text-xs text-gray-500 font-medium mb-4 tracking-wide uppercase">Core Features</p>
              <h2
                className="font-bold text-gray-900 text-center"
                style={{
                  fontFamily: "'Neue Haas Display', serif",
                  fontSize: 'clamp(32px, 6vw, 52px)',
                  lineHeight: '1.2',
                }}
              >
                Everything you need to write.{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Nothing more.
                </span>
              </h2>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index * 0.05}
                  variants={stageVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 cursor-pointer"
                >
                  <h3 className="mb-3 text-lg font-bold text-gray-900 md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 md:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============ 4️⃣ CTA SECTION ============ */}
        <section className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32">
          <motion.div
            className="mx-auto flex max-w-4xl flex-col items-start justify-center text-left"
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
              Ready to start writing?
            </motion.h3>

            {/* Main Headline */}
            <div className="relative mb-12">
              <h2
                className="font-black text-gray-900"
                style={{
                  fontFamily: "'Neue Haas Display', serif",
                  fontSize: 'clamp(36px, 7vw, 64px)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                }}
              >
                <motion.span
                  custom={0}
                  variants={{
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
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="block"
                >
                  Create your first note
                </motion.span>

                <motion.span
                  custom={1}
                  variants={{
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
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="block"
                >
                  in seconds — no setup,{' '}
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="relative inline-block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                  >
                    no friction.
                  </motion.span>
                </motion.span>
              </h2>

              {/* Decorative elements */}
              <motion.div
                className="pointer-events-none absolute -left-10 top-1/4 h-24 w-24 rounded-full bg-orange-400/10 blur-3xl"
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
                className="pointer-events-none absolute -right-10 bottom-1/4 h-32 w-32 rounded-full bg-orange-400/10 blur-3xl"
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

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.button
                onClick={handleStartWriting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg gap-2"
              >
                Open Avionote
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-8 py-3 text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
              >
                Back to Home
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default AvionoteLanding
