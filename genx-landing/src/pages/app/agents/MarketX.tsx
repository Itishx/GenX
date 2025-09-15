import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTarget, FiActivity, FiEdit3, FiMessageCircle } from 'react-icons/fi'

const MarketXDashboard: React.FC = () => {
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
          .eq('slug', 'marketx')
          .maybeSingle()
        if (!mounted) return
        if (error && (error as any).code !== 'PGRST116') setError(error.message)
        else setSetup(data as any)
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
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white"><FiTrendingUp className="h-5 w-5" /></span>
            <div>
              <h1 className="text-xl font-semibold">{setup?.name || 'MarketX'}</h1>
              <p className="text-sm text-zinc-400">Marketing and growth</p>
            </div>
          </div>
          <button onClick={() => navigate('/app/chat?agent=marketx')} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow hover:opacity-90">
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
                <div className="text-sm">{setup?.name || 'MarketX'}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Your profession</div>
                <div className="text-sm">{cfg.profession || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Purpose</div>
                <div className="text-sm">{cfg.purpose || '—'}</div>
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
            <div className="flex items-center gap-2"><FiTarget className="h-4 w-4" /><div className="text-sm font-semibold">Campaign Planner</div></div>
            <ul className="mt-2 space-y-1 text-xs text-zinc-300">
              <li>• Define target audience</li>
              <li>• Choose channels</li>
              <li>• Draft creative</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2"><FiActivity className="h-4 w-4" /><div className="text-sm font-semibold">Funnel Overview</div></div>
            <div className="mt-3 space-y-2">
              <div className="text-xs text-zinc-400">Visitors</div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10"><div className="h-full w-3/4 bg-indigo-600" /></div>
              <div className="text-xs text-zinc-400">Signups</div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10"><div className="h-full w-1/3 bg-fuchsia-600" /></div>
              <div className="text-xs text-zinc-400">Paid</div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10"><div className="h-full w-1/5 bg-emerald-500" /></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2"><FiEdit3 className="h-4 w-4" /><div className="text-sm font-semibold">Content Ideas</div></div>
            <p className="mt-2 text-xs text-zinc-400">Generate campaign copy and post ideas. Coming soon.</p>
            <button disabled className="mt-3 rounded-md bg-white px-3 py-2 text-xs font-semibold text-black opacity-70">Generate Ideas</button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MarketXDashboard
