import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { FiCode, FiBriefcase, FiTrendingUp, FiHeart } from 'react-icons/fi'

const AGENTS = [
  { slug: 'codex', name: 'CodeX', desc: 'Your coding companion', icon: <FiCode className="h-5 w-5" /> },
  { slug: 'businessx', name: 'BusinessX', desc: 'Ops and strategy helper', icon: <FiBriefcase className="h-5 w-5" /> },
  { slug: 'marketx', name: 'MarketX', desc: 'Marketing and growth', icon: <FiTrendingUp className="h-5 w-5" /> },
  { slug: 'dietx', name: 'DietX', desc: 'Meals, macros, guidance', icon: <FiHeart className="h-5 w-5" /> },
] as const

type AgentSlug = typeof AGENTS[number]['slug']

type ConfigMap = Partial<Record<AgentSlug, boolean>>

type SetupModalProps = {
  open: boolean
  onClose: () => void
  agent: { slug: AgentSlug; name: string }
  onSaved: (slug: AgentSlug) => void
}

const SetupModal: React.FC<SetupModalProps> = ({ open, onClose, agent, onSaved }) => {
  const [name, setName] = React.useState('')
  const [profession, setProfession] = React.useState('')
  const [purpose, setPurpose] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [devLevel, setDevLevel] = React.useState<'student' | 'early' | 'pro'>('student')
  const [saving, setSaving] = React.useState(false)
  const { user } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const config: any = { notes, profession, purpose }
      if (agent.slug === 'codex') config.devLevel = devLevel
      const payload = { user_id: user.id, slug: agent.slug, name: name || agent.name, config }
      const { error } = await supabase.from('agents').upsert(payload, { onConflict: 'user_id,slug' })
      if (error) {
        console.warn('Upsert agents error:', error)
      } else {
        onSaved(agent.slug)
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            className="absolute left-1/2 top-1/2 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black p-6 text-white shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Set up {agent.name}</h3>
              <button onClick={onClose} className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Agent display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={agent.name}
                  className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Your profession</label>
                  <input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Software Engineer, Marketer"
                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                {agent.slug === 'codex' && (
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Experience level (CodeX)</label>
                    <select
                      value={devLevel}
                      onChange={(e) => setDevLevel(e.target.value as any)}
                      className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="student">Student</option>
                      <option value="early">Early career</option>
                      <option value="pro">Pro dev</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">Purpose of use</label>
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={`How will you use ${agent.name}?`}
                  className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">Notes or context (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={`Anything ${agent.name} should know…`}
                  className="w-full resize-none rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded-md border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black disabled:opacity-70">{saving ? 'Saving…' : 'Save & Continue'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const MyAgents: React.FC = () => {
  const { user, refreshAgentsStatus } = useAuth()
  const [configured, setConfigured] = React.useState<ConfigMap>({})
  const [loading, setLoading] = React.useState(true)
  const [setupFor, setSetupFor] = React.useState<{ slug: AgentSlug; name: string } | null>(null)
  const navigate = useNavigate()

  const refresh = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const results: ConfigMap = {}
      for (const a of AGENTS) {
        const { count, error } = await supabase
          .from('agents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('slug', a.slug)
        if (error) {
          console.warn('Check config error (ignored):', error)
          results[a.slug] = false
        } else {
          results[a.slug] = (count ?? 0) > 0
        }
      }
      setConfigured(results)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  React.useEffect(() => {
    if (user) refresh()
  }, [user?.id, refresh])

  const goDashboard = (slug: AgentSlug) => {
    // Temporary: use marketing pages as dashboard placeholders
    const map: Record<AgentSlug, string> = {
      codex: '/codex',
      businessx: '/businessx',
      marketx: '/marketx',
      dietx: '/dietx',
    }
    navigate(map[slug])
  }

  const goWorkspace = (slug: AgentSlug) => {
    navigate(`/app/chat?agent=${slug}`)
  }

  return (
    <div className="h-full bg-black text-white">
      <div className="mx-auto max-w-6xl p-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h2 className="text-lg font-semibold">Agents</h2>
          <p className="mt-1 text-sm text-zinc-400">Configure and launch purpose-built agents.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a) => {
            const isConfigured = configured[a.slug]
            return (
              <motion.div key={a.slug} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">{a.icon}</span>
                  <div>
                    <div className="text-sm font-semibold">{a.name}</div>
                    <div className="text-xs text-zinc-400">{a.desc}</div>
                  </div>
                </div>

                <div className="mt-4 flex-1 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-zinc-400">
                  {loading ? 'Checking configuration…' : isConfigured ? 'Configured' : 'Not configured'}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!isConfigured ? (
                    <button
                      onClick={() => setSetupFor({ slug: a.slug, name: a.name })}
                      className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black"
                    >
                      Get Started
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => goDashboard(a.slug)}
                        className="flex-1 rounded-md border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={() => goWorkspace(a.slug)}
                        className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black"
                      >
                        Go to Workspace (Chat)
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Setup modal */}
      {setupFor && (
        <SetupModal
          open={!!setupFor}
          onClose={() => setSetupFor(null)}
          agent={setupFor}
          onSaved={(slug) => {
            refresh()
            refreshAgentsStatus().catch(() => {})
            goDashboard(slug)
          }}
        />
      )}
    </div>
  )
}

export default MyAgents
