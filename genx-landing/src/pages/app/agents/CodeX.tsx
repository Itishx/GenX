import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import CodeXDashboard from '../dashboards/CodeXDashboard'

const CodeXAgent: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [agent, setAgent] = React.useState<any>(null)

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .eq('slug', 'codex')
          .maybeSingle()
        if (!mounted) return
        if (error && (error as any).code !== 'PGRST116') {
          setError(error.message)
        } else {
          setAgent(data || {
            slug: 'codex',
            name: 'CodeX',
            config: {
              profession: 'Developer',
              purpose: 'Build, learn, and ship faster.',
              devLevel: 'student',
              userType: 'student'
            }
          })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-2">Error loading agent</div>
          <div className="text-sm text-zinc-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <CodeXDashboard
          agent={agent}
          onBack={() => navigate('/app/agents')}
          onGoToChat={() => navigate('/app/chat?agent=codex')}
        />
      </div>
    </div>
  )
}

export default CodeXAgent
