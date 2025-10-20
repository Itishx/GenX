import React from 'react'
import { motion } from 'framer-motion'
import { FiBriefcase } from 'react-icons/fi'

export type AgentRecord = {
  slug: /* 'codex' | */ 'businessx' | 'marketx' /* | 'dietx' */
  name: string
  config: any
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <div className="mb-2 text-sm font-semibold text-white">{title}</div>
    <div className="text-sm text-zinc-300">{children}</div>
  </div>
)

const BusinessXDashboard: React.FC<{
  agent: AgentRecord
  onBack: () => void
  onGoToChat: () => void
}> = ({ agent, onBack, onGoToChat }) => {
  const profession = agent?.config?.profession ?? 'Operator'
  const purpose = agent?.config?.purpose ?? 'Streamline ops and strategy.'

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white"><FiBriefcase className="h-5 w-5" /></span>
          <div>
            <div className="text-lg font-semibold text-white">{agent.name || 'BusinessX'}</div>
            <div className="text-xs text-zinc-400">Ops and strategy dashboard</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="rounded-md border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10">Back to Agents</button>
          <button onClick={onGoToChat} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black hover:opacity-90">Go to Chat</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Section title="Your Context">
          <div>Profession: <span className="text-white">{profession}</span></div>
          <div className="mt-1">Purpose: <span className="text-white">{purpose}</span></div>
        </Section>
        <Section title="Recent Tasks">
          <div>• Draft OKRs (coming soon)</div>
          <div>• Analyze ops metrics (coming soon)</div>
        </Section>
        <Section title="Integrations">
          <div>Notion, Slack (coming soon)</div>
        </Section>
      </div>
    </motion.div>
  )
}

export default BusinessXDashboard
