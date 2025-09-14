import React from 'react'
import { motion } from 'framer-motion'

const MyAgents: React.FC = () => {
  const agents = [
    { id: 'a1', name: 'CodeX', desc: 'Your coding companion' },
    { id: 'a2', name: 'BusinessX', desc: 'Ops and strategy helper' },
    { id: 'a3', name: 'MarketX', desc: 'Marketing and growth' },
  ]

  return (
    <div className="h-full bg-black text-white">
      <div className="mx-auto max-w-5xl p-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm font-semibold">{a.name}</div>
              <div className="mt-1 text-xs text-zinc-400">{a.desc}</div>
              <div className="mt-3 text-[11px] text-zinc-500">Placeholder – real data coming soon.</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default MyAgents
