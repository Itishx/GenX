import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiCalendar, FiPieChart, FiActivity, FiMessageCircle } from 'react-icons/fi'

const DietXDashboard: React.FC = () => {
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
          .eq('slug', 'dietx')
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
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white"><FiHeart className="h-5 w-5" /></span>
            <div>
              <h1 className="text-xl font-semibold">{setup?.name || 'DietX'}</h1>
              <p className="text-sm text-zinc-400">Meals, macros, guidance</p>
            </div>
          </div>
          <button onClick={() => navigate('/app/chat?agent=dietx')} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow hover:opacity-90">
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
                <div className="text-sm">{setup?.name || 'DietX'}</div>
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
            <div className="flex items-center gap-2"><FiCalendar className="h-4 w-4" /><div className="text-sm font-semibold">Meal Planner</div></div>
            <p className="mt-2 text-xs text-zinc-400">Plan your meals for the week.</p>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-400">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="rounded-md border border-white/10 bg-black/40 py-2">{d}</div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2"><FiPieChart className="h-4 w-4" /><div className="text-sm font-semibold">Macro Tracker</div></div>
            <div className="mt-3 space-y-2 text-xs text-zinc-400">
              <div>Protein</div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10"><div className="h-full w-1/2 bg-emerald-500" /></div>
              <div>Carbs</div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10"><div className="h-full w-2/3 bg-indigo-600" /></div>
              <div>Fats</div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10"><div className="h-full w-1/3 bg-fuchsia-600" /></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2"><FiActivity className="h-4 w-4" /><div className="text-sm font-semibold">Habit Coach</div></div>
            <ul className="mt-2 space-y-1 text-xs text-zinc-300">
              <li>• Hydrate 8 glasses</li>
              <li>• 7k steps</li>
              <li>• Sleep by 11pm</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DietXDashboard
