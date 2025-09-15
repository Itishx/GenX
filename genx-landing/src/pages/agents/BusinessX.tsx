import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const BusinessXPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [agent, setAgent] = React.useState<{ name: string; config: any } | null>(null)

  React.useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('name, config')
        .eq('user_id', user.id)
        .eq('slug', 'businessx')
        .maybeSingle()
      if (error) console.warn('Fetch BusinessX config error:', error)
      setAgent((data as any) ?? null)
      setLoading(false)
    }
    load()
  }, [user?.id])

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl p-4">
        <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold">BusinessX Dashboard</motion.h1>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          {loading ? (
            <div className="text-sm text-zinc-400">Loading…</div>
          ) : agent ? (
            <div className="space-y-2 text-sm">
              <div><span className="text-zinc-400">Display name:</span> <span className="font-medium text-white">{agent.name}</span></div>
              {agent.config?.profession && <div><span className="text-zinc-400">Profession:</span> {agent.config.profession}</div>}
              {agent.config?.purpose && <div><span className="text-zinc-400">Purpose:</span> {agent.config.purpose}</div>}
              {agent.config?.notes && <div><span className="text-zinc-400">Notes:</span> {agent.config.notes}</div>}
            </div>
          ) : (
            <div className="text-sm text-zinc-400">Not configured yet.</div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => navigate('/app/agents')} className="rounded-md border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10">Back to Agents</button>
          <button onClick={() => navigate('/app/chat?agent=businessx')} className="rounded-md bg:white bg-white px-3 py-2 text-sm font-semibold text-black">Go to Workspace (Chat)</button>
        </div>
      </div>
    </div>
  )
}

export default BusinessXPage
