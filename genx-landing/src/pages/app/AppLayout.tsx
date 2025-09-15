import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileDropdown from '@/components/ProfileDropdown'
import { useAuth } from '@/context/AuthContext'
import { FiHome, FiMessageCircle, FiUsers, FiZap, FiCreditCard } from 'react-icons/fi'

const SidebarItem: React.FC<{ to: string; label: string; icon: React.ReactNode }> = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors ${
        isActive ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
      }`
    }
    end
  >
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white">{icon}</span>
    <span className="truncate">{label}</span>
  </NavLink>
)

const CreateWorkflowButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mt-2 flex w-full items-center gap-3 rounded-md border border-white/15 bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow transition-opacity hover:opacity-90"
  >
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20"><FiZap className="h-4 w-4" /></span>
    Create Agent Workflow
  </button>
)

const Modal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            className="absolute left-1/2 top-1/2 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black p-6 text-white shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create Agent Workflow</h3>
              <button onClick={onClose} className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-300">Coming soon: chain tools like CodeX, BusinessX, MarketX, DietX and more into multi-step workflows.</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {['CodeX', 'BusinessX', 'MarketX', 'DietX'].map((tool) => (
                <div key={tool} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-medium">{tool}</div>
                  <div className="mt-1 text-xs text-zinc-400">Placeholder tool card</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-md border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10">Close</button>
              <button disabled className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black opacity-70">Create</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const AppLayout: React.FC = () => {
  const { profile, user } = useAuth()
  const location = useLocation()
  const [workflowOpen, setWorkflowOpen] = React.useState(false)

  // Removed extra navigate effect; index route handles redirect to /app/chat

  const username = profile?.name || user?.email || 'there'
  const showHeader = !location.pathname.startsWith('/app/chat')
  const hideSidebarButtons = location.pathname.startsWith('/app/agents') || location.pathname.startsWith('/app/chat')

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-black/80 backdrop-blur">
        <div className="flex h-full flex-col p-3">
          {/* Top: Logo + Home */}
          <div className="mb-3 px-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black font-extrabold">A</div>
              <div className="text-sm font-semibold tracking-wide">AgentX</div>
            </div>
            <SidebarItem to="/" label="Home" icon={<FiHome className="h-3.5 w-3.5" />} />
          </div>

          <div className="my-2 h-px bg-white/10" />

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-1">
            <SidebarItem to="/app/chat" label="General Chat" icon={<FiMessageCircle className="h-3.5 w-3.5" />} />
            <SidebarItem to="/app/agents" label="Agentic Workspaces" icon={<FiUsers className="h-3.5 w-3.5" />} />
            {/* Hide workflow and subscriptions when on Agents page */}
            {!hideSidebarButtons && (
              <>
                <CreateWorkflowButton onClick={() => setWorkflowOpen(true)} />
                <SidebarItem to="/app/subscriptions" label="Subscriptions" icon={<FiCreditCard className="h-3.5 w-3.5" />} />
              </>
            )}
          </nav>

          {/* Divider */}
          <div className="my-2 h-px bg-white/10" />

          {/* Bottom: Profile */}
          <div className="px-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="truncate text-[11px] text-zinc-400">Signed in as</div>
                <div className="truncate text-sm font-medium">{profile?.name || user?.email}</div>
              </div>
              <div className="relative">
                <ProfileDropdown placement="bottom" showExtraLinks={false} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex min-h-screen flex-1 flex-col">
        {showHeader && (
          <div className="border-b border-white/10 p-4">
            <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="text-lg font-semibold">
              Hey {username}, ready to dive in?
            </motion.h1>
          </div>
        )}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="h-full">
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Create workflow modal */}
      <Modal open={workflowOpen} onClose={() => setWorkflowOpen(false)} />
    </div>
  )
}

export default AppLayout
