import React from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { FiBriefcase, FiTrendingUp } from 'react-icons/fi'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const AGENTS = [
  { 
    slug: 'businessx', 
    name: 'FoundryOS', 
    osName: 'FoundryOS',
    desc: 'Your operations and strategy companion. Streamline workflows, manage KPIs, and optimize business processes with intelligent guidance.', 
    icon: <FiBriefcase className="h-12 w-12" /> 
  },
  { 
    slug: 'marketx', 
    name: 'LaunchOS', 
    osName: 'LaunchOS',
    desc: 'Your marketing and growth partner. Plan campaigns, analyze funnels, and accelerate growth with data-driven insights.', 
    icon: <FiTrendingUp className="h-12 w-12" /> 
  },
] as const

type AgentSlug = typeof AGENTS[number]['slug']

type ConfigMap = Partial<Record<AgentSlug, boolean>>

type SetupModalProps = {
  open: boolean
  onClose: () => void
  agent: { slug: AgentSlug; name: string; osName: string }
  onSaved: (slug: AgentSlug) => void
}

const SetupModal: React.FC<SetupModalProps> = ({ open, onClose, agent, onSaved }) => {
  const [name, setName] = React.useState('')
  const [profession, setProfession] = React.useState('')
  const [purpose, setPurpose] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const { user } = useAuth()

  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  const dragControls = useDragControls()
  const onDragHandlePointerDown = (e: React.PointerEvent) => {
    if ((e as any).button !== undefined && (e as any).button !== 0) return
    dragControls.start(e)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const config: any = { notes, profession, purpose }
      const payload = { user_id: user.id, slug: agent.slug, name: name || agent.name, config }
      const { error } = await supabase.from('agents').upsert(payload, { onConflict: 'user_id,slug' })
      if (!error) {
        onSaved(agent.slug)
        onClose()
      } else {
        console.warn('Upsert agents error:', error)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} ref={overlayRef}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute left-1/2 top-1/2 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 text-gray-900 shadow-2xl will-change-transform"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.08}
            dragConstraints={overlayRef}
          >
            <div
              className="flex cursor-move select-none items-center justify-between rounded-md p-1 -m-1"
              onPointerDown={onDragHandlePointerDown}
            >
              <h3 className="text-gray-900">Configure <span className="text-orange-600">{agent.osName}</span></h3>
              <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-600">Agent display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={agent.name}
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">Your profession</label>
                  <input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Software Engineer, Marketer"
                    className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-600">Purpose of use</label>
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={`How will you use ${agent.name}?`}
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-600">Notes or context (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={`Anything ${agent.name} should know…`}
                  className="w-full resize-none rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={onClose} className="rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-900 hover:bg-amber-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg border border-orange-600 bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700 transition-colors disabled:opacity-70">{saving ? 'Saving…' : 'Save & Continue'}</button>
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
  const [setupFor, setSetupFor] = React.useState<{ slug: AgentSlug; name: string; osName: string } | null>(null)
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

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'

  // Card configuration with routes
  const configureCards = AGENTS.map(a => ({
    ...a,
    primaryBtnLabel: 'Get Started',
    primaryBtnOnClick: a.slug === 'businessx' 
      ? () => navigate('/foundryos/get-started')
      : () => navigate('/launchos/get-started'),
    secondaryBtnLabel: 'Learn More',
    secondaryBtnHref: a.slug === 'businessx' ? '/foundryos' : '/launchos',
  }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="mx-auto max-w-6xl px-6 py-12">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 6 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-[#111111]">
              Hello {userName}, let's get started shall we?
            </h1>
            <p className="mt-3 text-base text-[#555555]">
              Configure your operating systems and understand how Aviate helps you build and grow.
            </p>
          </motion.div>

          {/* Section 1: Configure */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                {configureCards.map((card, idx) => (
                  <motion.div
                    key={card.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    className="rounded-2xl border border-[#eaeaea] bg-white p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-[#111111]">
                          {card.osName}
                        </h3>
                        <p className="text-[#555555] text-sm mt-2 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>

                      {configured[card.slug] && !loading && (
                        <div className="mt-4 inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs text-green-700 font-medium">
                          ✓ Configured
                        </div>
                      )}

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={card.primaryBtnOnClick}
                          disabled={loading}
                          className="flex-1 rounded-lg bg-[#111111] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#333333] transition-colors disabled:opacity-70"
                        >
                          {loading ? 'Loading…' : card.primaryBtnLabel}
                        </button>
                        <Link
                          to={card.secondaryBtnHref}
                          className="flex-1 rounded-lg border border-[#eaeaea] text-[#111111] px-4 py-2.5 text-sm font-medium hover:bg-[#f5f5f5] transition-colors text-center"
                        >
                          {card.secondaryBtnLabel}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* Setup modal */}
      {setupFor && (
        <SetupModal
          open={!!setupFor}
          onClose={() => setSetupFor(null)}
          agent={setupFor}
          onSaved={async (slug) => {
            await refresh()
            await refreshAgentsStatus().catch(() => {})
            navigate(`/app/agents/${slug}`)
          }}
        />
      )}
    </div>
  )
}

export default MyAgents
