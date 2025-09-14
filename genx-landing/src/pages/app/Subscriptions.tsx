import React from 'react'
import { motion } from 'framer-motion'

const Subscriptions: React.FC = () => {
  return (
    <div className="h-full bg-black text-white">
      <div className="mx-auto max-w-3xl p-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-sm font-semibold">Current Plan</div>
          <div className="mt-1 text-xs text-zinc-400">This is a placeholder. Billing integration coming soon.</div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-4">
            <div>
              <div className="text-sm">Free</div>
              <div className="text-xs text-zinc-400">Basic usage limits</div>
            </div>
            <button className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10">Upgrade</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Subscriptions
