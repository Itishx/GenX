import React from 'react'
import { FiCode, FiBriefcase, FiTrendingUp, FiHeart } from 'react-icons/fi'
import { motion } from 'framer-motion'

const agents = [
  // {
  //   icon: <FiCode className="h-6 w-6" />,
  //   title: 'Code Agent',
  //   desc: 'Accelerate development with code generation, refactoring, and reviews.',
  // },
  {
    icon: <FiBriefcase className="h-6 w-6" />,
    title: 'Biz Agent',
    desc: 'Draft proposals, analyze operations, and automate routine workflows.',
  },
  {
    icon: <FiTrendingUp className="h-6 w-6" />,
    title: 'Marketing Agent',
    desc: 'Plan campaigns, write copy, and track performance across channels.',
  },
  // {
  //   icon: <FiHeart className="h-6 w-6" />,
  //   title: 'Diet Agent',
  //   desc: 'Personalized meal plans and nutrition guidance for your goals.',
  // },
]

const AgentsGrid: React.FC = () => {
  return (
    <section id="agents" className="relative bg-black py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Specialized Agents</h2>
          <p className="mt-3 text-zinc-300">A focused set of experts designed to work together or solo.</p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {agents.map((a, i) => (
            <motion.div
              key={a.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.06 }}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
                {a.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{a.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AgentsGrid
