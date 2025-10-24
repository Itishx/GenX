import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const FoundryOS: React.FC = () => {
  const stages = [
    { number: '01', name: 'Idea Validation', description: 'Test your concept with market research and user feedback.' },
    { number: '02', name: 'Market Analysis', description: 'Understand your TAM, competition, and positioning.' },
    { number: '03', name: 'Problem Definition', description: 'Articulate the core problem you\'re solving.' },
    { number: '04', name: 'Solution Design', description: 'Map your solution to the problem with clear features.' },
    { number: '05', name: 'Business Model', description: 'Define how you\'ll create, deliver, and capture value.' },
    { number: '06', name: 'Go-to-Market', description: 'Plan your launch strategy and customer acquisition.' },
    { number: '07', name: 'MVP Roadmap', description: 'Build your minimum viable product scope.' },
    { number: '08', name: 'Execution Plan', description: 'Create timelines, milestones, and team assignments.' },
  ]

  const philosophyPoints = [
    {
      title: 'Adaptive Intelligence',
      description: 'Evolves with your ideas, refining strategy and clarity as you build.'
    },
    {
      title: 'Multi-Model Engine',
      description: 'Powered by OpenAI, Anthropic, and Hugging Face.'
    },
    {
      title: 'Founder-First Design',
      description: 'Every system is designed to think with you, not just for you.'
    }
  ]

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
      <main className="pt-20">
        {/* ============ 1️⃣ HERO SECTION ============ */}
        <section className="relative w-full bg-white px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
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
              Meet FoundryOS,
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                your artificially intelligent co-founder.
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
              It'll help you go from no idea about what the fuck it is you want to build to a working product — in 8 simple steps.
            </motion.p>

            {/* Hero Image */}
            <motion.div
              className="mx-auto mt-16 max-w-5xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
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
                  <div className="h-full w-full flex items-center justify-center">
                    <svg
                      className="w-3/4 h-3/4 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-orange-500/10 blur-3xl"></div>
                  <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-orange-600/10 blur-3xl"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============ 2️⃣ THE 8 STAGES SECTION ============ */}
        <section className="relative w-full bg-gradient-to-b from-white to-gray-50 px-6 py-32 md:py-40">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
              {/* Left: Explanation */}
              <motion.div
                className="flex flex-col justify-start"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h2
                  className="mb-8 font-bold text-gray-900 text-justify"
                  style={{
                    fontFamily: "'Neue Haas Display', serif",
                    fontSize: 'clamp(32px, 6vw, 48px)',
                    lineHeight: '1.2',
                  }}
                >
                  The 8 Stages
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-gray-600 text-justify">
                  Each stage in FoundryOS is designed to move you from chaos to clarity. From validating ideas to defining your first MVP, the system helps you think strategically, plan visually, and build intelligently — one stage at a time.
                </p>

                <div className="rounded-lg bg-white border border-gray-100 p-6 mb-6">
                  <p className="text-sm text-gray-500 text-center md:text-left">
                    <span className="font-semibold text-gray-700">8 interconnected stages</span> • <span className="font-semibold text-gray-700">Built for founders</span> • <span className="font-semibold text-gray-700">Designed for clarity</span>
                  </p>
                </div>

                {/* Image Container Below */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="w-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 rounded-lg shadow-md flex items-center justify-center min-h-[320px]"
                >
                  <p className="text-gray-400 text-sm">Image Placeholder</p>
                </motion.div>
              </motion.div>

              {/* Right: Stages Grid */}
              <motion.div
                className="flex flex-col"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {stages.map((stage, index) => (
                    <motion.div
                      key={stage.number}
                      custom={index * 0.05}
                      variants={stageVariants}
                      initial="hidden"
                      whileInView="visible"
                      whileHover="hover"
                      viewport={{ once: true, amount: 0.3 }}
                      className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 cursor-pointer"
                    >
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Stage {stage.number}
                      </p>
                      <h3 className="mb-2 text-base font-bold text-gray-900 md:text-lg">
                        {stage.name}
                      </h3>
                      <p className="text-xs text-gray-500 md:text-sm leading-relaxed">
                        {stage.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ 3️⃣ PHILOSOPHY SECTION ============ */}
        <section className="relative w-full bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left Column - Image Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col justify-start"
              >
                <div className="w-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 rounded-lg shadow-md flex items-center justify-center min-h-[680px]">
                  <p className="text-gray-400 text-sm">Image Placeholder</p>
                </div>
              </motion.div>

              {/* Right Column - Content */}
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <p className="text-xs text-[#999999] font-medium mb-4 tracking-wide">BUILT FOR CLARITY</p>

                <h2
                  className="text-2xl md:text-3xl font-semibold text-[#111111] leading-tight mb-6 max-w-lg"
                  style={{ fontFamily: "'Neue Haas Display', serif" }}
                >
                  Your intelligent system for turning{' '}
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="inline-block bg-gradient-to-r from-[#ff5a00] via-[#ffb347] to-[#ff5a00] bg-clip-text text-transparent"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'slowShimmer 8s ease-in-out infinite',
                    }}
                  >
                    chaos into structure
                  </motion.span>
                  .
                </h2>

                <p className="text-[#555555] text-lg leading-relaxed mb-10 max-w-2xl text-justify">
                  FoundryOS helps founders move from scattered thoughts to defined strategy — guiding every step from idea validation to product architecture. It's powered by multi-model intelligence, designed to think like a co-founder who never loses focus.
                </p>

                {/* Feature Blocks */}
                <div className="space-y-0">
                  <motion.div
                    whileHover={{ paddingLeft: 8 }}
                    className="border-t border-[#eaeaea] py-6 cursor-pointer group transition-all"
                  >
                    <h4 className="text-[#111111] font-medium text-lg mb-2 group-hover:text-[#ff5a00] transition">
                      Structured Frameworks
                    </h4>
                    <p className="text-[#555555] text-base leading-relaxed">
                      Each stage in FoundryOS is built around clarity — helping you validate ideas, define users, and shape products with precision.
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ paddingLeft: 8 }}
                    className="border-t border-[#eaeaea] py-6 cursor-pointer group transition-all"
                  >
                    <h4 className="text-[#111111] font-medium text-lg mb-2 group-hover:text-[#ff5a00] transition">
                      Adaptive Strategy Engine
                    </h4>
                    <p className="text-[#555555] text-base leading-relaxed">
                      FoundryOS evolves with your thinking, refining every framework and recommendation as your vision becomes clearer.
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ paddingLeft: 8 }}
                    className="border-t border-[#eaeaea] py-6 border-b cursor-pointer group transition-all"
                  >
                    <h4 className="text-[#111111] font-medium text-lg mb-2 group-hover:text-[#ff5a00] transition">
                      Founder-First Workflow
                    </h4>
                    <p className="text-[#555555] text-base leading-relaxed">
                      Everything inside FoundryOS is designed to make founders think deeply, plan intelligently, and execute with purpose.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
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
              Ready to turn your idea into reality?
            </motion.h3>

            {/* Main Headline with Sequential Animation */}
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
                {/* Phrase 1: "Start with FoundryOS" */}
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
                  Start with FoundryOS
                </motion.span>

                {/* Phrase 2: "and validate, build, and launch your" */}
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
                  and validate, build, and launch your
                </motion.span>

                {/* Phrase 3: "product with AI as your co-founder." */}
                <motion.span
                  custom={2}
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
                  product with{' '}
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="relative inline-block bg-gradient-to-r from-[#ff5a00] via-[#ffb347] to-[#ff5a00] bg-clip-text text-transparent"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'slowShimmer 8s ease-in-out infinite',
                    }}
                  >
                    AI as your co-founder
                  </motion.span>
                  .
                </motion.span>
              </h2>

              {/* Subtle decorative elements */}
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
              <motion.a
                href="/foundryos/get-started"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg"
              >
                Get Started Free
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-8 py-3 text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default FoundryOS
