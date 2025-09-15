import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuth } from '@/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FiUsers, FiCreditCard, FiChevronDown } from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'

const AvatarFallback: React.FC<{ email?: string | null; name?: string | null }> = ({ email, name }) => {
  const text = (name || email || 'U').trim()[0]?.toUpperCase() ?? 'U'
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
      {text}
    </div>
  )
}

const ProfileDropdown: React.FC<{ placement?: 'top' | 'bottom'; showExtraLinks?: boolean }> = ({
  placement = 'bottom',
  showExtraLinks = true,
}) => {
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('profile')
  const [name, setName] = React.useState(profile?.name ?? '')
  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [toast, setToast] = React.useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [agents, setAgents] = React.useState<Array<{ slug: 'codex' | 'businessx' | 'marketx' | 'dietx'; name: string }>>([])
  const [agentsLoading, setAgentsLoading] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    setName(profile?.name ?? '')
  }, [profile?.name])

  React.useEffect(() => {
    if (!open || !user) return
    let alive = true
    const load = async () => {
      setAgentsLoading(true)
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('slug, name')
          .eq('user_id', user.id)
          .order('slug', { ascending: true })
        if (!alive) return
        if (error) {
          console.warn('Load agents (dropdown) error:', error)
          setAgents([])
        } else {
          setAgents((data || []).map((r: any) => ({ slug: r.slug, name: r.name || r.slug })))
        }
      } finally {
        if (alive) setAgentsLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [open, user?.id])

  const onSave = async () => {
    setSaving(true)
    const { error } = await updateProfile({ name })
    setSaving(false)
    if (error) {
      setToast({ type: 'error', msg: error })
    } else {
      setToast({ type: 'success', msg: 'Profile updated' })
      setTimeout(() => setToast(null), 2000)
    }
  }

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { error } = await uploadAvatar(file)
    setUploading(false)
    if (error) {
      setToast({ type: 'error', msg: 'Could not upload profile picture' })
    } else {
      setToast({ type: 'success', msg: 'Profile updated' })
      setTimeout(() => setToast(null), 2000)
    }
  }

  const avatar = profile?.avatar_url

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="ml-3 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black text-white transition-colors hover:bg-white/10"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {avatar ? (
            <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <AvatarFallback email={user?.email} name={profile?.name} />
          )}
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild sideOffset={12} align="end" alignOffset={-8}>
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="z-50 w-80 overflow-hidden rounded-lg border border-white/10 bg-black p-0 text-white shadow-xl"
                role="menu"
              >
                {/* Inline toast */}
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'} m-2 rounded-md border px-3 py-2 text-xs`}
                    >
                      {toast.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header with identity */}
                <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10">
                      {avatar ? (
                        <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <AvatarFallback email={user?.email} name={profile?.name} />
                      )}
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm font-semibold">{profile?.name || user?.email}</div>
                      <div className="text-[11px] text-zinc-400">{user?.email}</div>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="rounded p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>

                <div className="border-t border-white/10">
                  <div className="flex border-b border-white/10">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex-1 border-r border-white/10 px-3 py-2 text-center text-xs transition-colors ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('agents')}
                      className={`flex-1 border-r border-white/10 px-3 py-2 text-center text-xs transition-colors ${activeTab === 'agents' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}
                    >
                      My Agents
                    </button>
                    <button
                      onClick={() => setActiveTab('subscriptions')}
                      className={`flex-1 px-3 py-2 text-center text-xs transition-colors ${activeTab === 'subscriptions' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}
                    >
                      Subscriptions
                    </button>
                  </div>
                  <div className="p-4">
                    {activeTab === 'profile' && (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-xs text-zinc-400">Display name</label>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-zinc-400">Profile image</label>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10">
                              {avatar ? (
                                <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                              ) : (
                                <AvatarFallback email={user?.email} name={profile?.name} />
                              )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs transition-colors hover:bg-white/10">
                              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                              {uploading ? 'Uploading…' : 'Upload'}
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button onClick={onSave} disabled={saving} className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90">
                            {saving ? 'Saving…' : 'Save changes'}
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === 'agents' && (
                      <div>
                        {agentsLoading ? (
                          <div className="text-center text-xs text-zinc-400">Loading agents…</div>
                        ) : (
                          <div className="space-y-2">
                            {agents.map(agent => (
                              <Link key={agent.slug} to={`/app/agents/${agent.slug}`} className="block rounded-md p-2 text-sm text-zinc-300 transition-colors hover:bg-white/10">
                                {agent.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 'subscriptions' && (
                      <div>
                        <Link
                          to="/app/subscriptions"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <FiCreditCard className="h-4 w-4" />
                          <span>Manage Subscriptions</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 p-2">
                  <button
                    onClick={async () => {
                      await signOut()
                      setOpen(false)
                      navigate('/')
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12"/></svg>
                    Log out
                  </button>
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  )
}

export default ProfileDropdown
