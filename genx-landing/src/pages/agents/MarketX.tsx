import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

const MarketXPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-extrabold tracking-tight md:text-6xl"
          >
            MarketX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-zinc-300"
          >
            Campaign ideas, content calendars, and performance insights. Grow with data-backed creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
              <div
                className="aspect-[16/9] w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg')" }}
              />
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/30 to-pink-600/20" />
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default MarketXPage
