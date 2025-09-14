import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FiUsers, FiCreditCard } from 'react-icons/fi'

const AvatarFallback: React.FC<{ email?: string | null; name?: string | null }> = ({ email, name }) => {
  const text = (name || email || 'U').trim()[0]?.toUpperCase() ?? 'U'
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
      {text}
    </div>
  )
}

const ProfileDropdown: React.FC = () => {
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<'profile' | 'agents' | 'subscriptions'>('profile')
  const [name, setName] = React.useState(profile?.name ?? '')
  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [toast, setToast] = React.useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    setName(profile?.name ?? '')
  }, [profile?.name])

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
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-lg border border-white/10 bg-black p-0 text-white shadow-xl"
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

            {/* Quick links */}
            <div className="flex items-center gap-2 px-3 py-2">
              <Link to="/app/agents" onClick={() => setOpen(false)} className="flex flex-1 items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white"><FiUsers className="h-3.5 w-3.5" /></span>
                My Agents
              </Link>
              <Link to="/app/subscriptions" onClick={() => setOpen(false)} className="flex flex-1 items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white"><FiCreditCard className="h-3.5 w-3.5" /></span>
                My Subscriptions
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Tabs */}
            <div className="flex items-center gap-1 px-2 pt-2 text-xs">
              <button onClick={() => setTab('profile')} className={`rounded px-2 py-1 ${tab === 'profile' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}>Profile</button>
              <button onClick={() => setTab('agents')} className={`rounded px-2 py-1 ${tab === 'agents' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}>My Agents</button>
              <button onClick={() => setTab('subscriptions')} className={`rounded px-2 py-1 ${tab === 'subscriptions' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'}`}>My Subscriptions</button>
            </div>

            {/* Content */}
            <div className="px-3 py-3">
              {tab === 'profile' && (
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

              {tab === 'agents' && (
                <div className="space-y-2 text-sm">
                  <div className="text-xs text-zinc-400">Agents you can try</div>
                  <ul className="divide-y divide-white/10 rounded-md border border-white/10">
                    <li className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-white/5"><span>CodeX</span><Link to="/codex" className="text-xs text-zinc-300 underline underline-offset-4 hover:text-white">Open</Link></li>
                    <li className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-white/5"><span>BusinessX</span><Link to="/businessx" className="text-xs text-zinc-300 underline underline-offset-4 hover:text-white">Open</Link></li>
                    <li className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-white/5"><span>MarketX</span><Link to="/marketx" className="text-xs text-zinc-300 underline underline-offset-4 hover:text-white">Open</Link></li>
                    <li className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-white/5"><span>DietX</span><Link to="/dietx" className="text-xs text-zinc-300 underline underline-offset-4 hover:text-white">Open</Link></li>
                  </ul>
                </div>
              )}

              {tab === 'subscriptions' && (
                <div className="space-y-2 text-sm">
                  <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-xs text-zinc-400">Current plan</div>
                    <div className="mt-1 text-sm font-semibold">Free</div>
                    <div className="mt-1 text-xs text-zinc-400">Upgrade to unlock higher limits.</div>
                  </div>
                </div>
              )}
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
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileDropdown
