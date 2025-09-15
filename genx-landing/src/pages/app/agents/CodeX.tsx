import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCode, FiGithub, FiBookOpen, FiTerminal, FiMessageCircle } from 'react-icons/fi'

const CodeXDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [setup, setSetup] = React.useState<{ name?: string; config?: any } | null>(null)

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('name, config')
          .eq('user_id', user.id)
          .eq('slug', 'codex')
          .maybeSingle()
        if (!mounted) return
        if (error && (error as any).code !== 'PGRST116') {
          setError(error.message)
        } else {
          setSetup(data as any)
        }
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user?.id])

  const cfg = setup?.config || {}

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white"><FiCode className="h-5 w-5" /></span>
            <div>
              <h1 className="text-xl font-semibold">{setup?.name || 'CodeX'}</h1>
              <p className="text-sm text-zinc-400">Your coding companion</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/chat?agent=codex')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow hover:opacity-90"
          >
            <FiMessageCircle className="h-4 w-4" />
            Open Chat
          </button>
        </div>

        {/* Setup info */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 text-sm font-semibold">Your setup</div>
          {loading ? (
            <div className="text-sm text-zinc-400">Loading…</div>
          ) : error ? (
            <div className="text-sm text-rose-300">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs text-zinc-400">Display name</div>
                <div className="text-sm">{setup?.name || 'CodeX'}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Your profession</div>
                <div className="text-sm">{cfg.profession || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Purpose</div>
                <div className="text-sm">{cfg.purpose || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Experience level</div>
                <div className="text-sm capitalize">{cfg.devLevel || '—'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-zinc-400">Notes</div>
                <div className="text-sm">{cfg.notes || '—'}</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Widgets */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FiGithub className="h-4 w-4" /><div className="text-sm font-semibold">GitHub Sync</div></div>
              <button className="rounded-md border border-white/20 px-2 py-1 text-xs text-white hover:bg-white/10">Connect</button>
            </div>
            <p className="mt-2 text-xs text-zinc-400">Link repositories to power context-aware code help. Coming soon.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2"><FiBookOpen className="h-4 w-4" /><div className="text-sm font-semibold">Study Tracker</div></div>
            <p className="mt-2 text-xs text-zinc-400">Track daily learning goals.</p>
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded bg-white/10">
                <div className="h-full w-1/3 bg-gradient-to-r from-indigo-600 to-fuchsia-600" />
              </div>
              <div className="mt-1 text-xs text-zinc-400">Today: 33%</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2"><FiTerminal className="h-4 w-4" /><div className="text-sm font-semibold">Playground</div></div>
            <p className="mt-2 text-xs text-zinc-400">Try prompts and snippets in a sandbox.</p>
            <button disabled className="mt-3 rounded-md bg-white px-3 py-2 text-xs font-semibold text-black opacity-70">Open Playground</button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CodeXDashboard
