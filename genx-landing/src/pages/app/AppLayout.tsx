import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileDropdown from '@/components/ProfileDropdown'
import { useAuth } from '@/context/AuthContext'
import { FiUsers, FiZap, FiCreditCard, FiBriefcase, FiTrendingUp } from 'react-icons/fi'

const SidebarItem: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2.5 text-sm transition-colors border-l-2 ${
        isActive 
          ? 'text-orange-600 border-l-orange-600 bg-white' 
          : 'text-gray-600 border-l-transparent hover:text-gray-900'
      }`
    }
    end
  >
    {label}
  </NavLink>
)

const CreateWorkflowButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-2.5 text-sm text-orange-600 border-l-2 border-l-transparent hover:text-gray-900 text-left transition-colors"
  >
    Create Workflow
  </button>
)

const Modal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute left-1/2 top-1/2 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Create Agent Workflow</h3>
              <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">Coming soon: chain tools like FoundryOS, LaunchOS and more into multi-step workflows.</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {['FoundryOS', 'LaunchOS'].map((tool) => (
                <div key={tool} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="text-gray-900">{tool}</div>
                  <div className="mt-1 text-xs text-gray-500">Placeholder tool card</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors">Close</button>
              <button disabled className="rounded-lg border border-black bg-black px-3 py-2 text-sm text-white opacity-70">Create</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const getSelectedAgentInfo = (pathname: string) => {
  if (pathname.includes('/app/agents/businessx')) {
    return 'FoundryOS'
  }
  if (pathname.includes('/app/agents/marketx')) {
    return 'LaunchOS'
  }
  return null
}

const AppLayout: React.FC = () => {
  const { profile, user } = useAuth()
  const location = useLocation()
  const [workflowOpen, setWorkflowOpen] = React.useState(false)

  const username = profile?.name || user?.email || 'there'
  const showHeader = !location.pathname.startsWith('/app/chat') && !location.pathname.startsWith('/app/agents')
  const hideSidebarButtons = location.pathname.startsWith('/app/agents') || location.pathname.startsWith('/app/chat')
  const selectedAgent = getSelectedAgentInfo(location.pathname)

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-56 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-200 px-4 py-5">
            <h2 className="text-xl text-gray-900" style={{ fontFamily: "'Neue Haas Display', serif" }}>Aviate</h2>
          </div>

          {/* Selected Agent */}
          {selectedAgent && (
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="text-xs text-orange-600">{selectedAgent}</div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-0 overflow-y-auto">
            <SidebarItem to="/app/agents" label="Agents" />
            {!hideSidebarButtons && (
              <>
                <div onClick={() => setWorkflowOpen(true)} className="cursor-pointer">
                  <CreateWorkflowButton onClick={() => setWorkflowOpen(true)} />
                </div>
                <SidebarItem to="/app/subscriptions" label="Subscriptions" />
              </>
            )}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Profile */}
          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500">Signed in as</div>
                <div className="truncate text-sm text-gray-900">{profile?.name || user?.email}</div>
              </div>
              <div className="flex-shrink-0">
                <ProfileDropdown placement="bottom" showExtraLinks={false} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-56 flex min-h-screen flex-1 flex-col bg-white">
        {showHeader && (
          <div className="border-b border-gray-200 bg-white px-8 py-6">
            <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="text-lg text-gray-900">
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

      {/* Modal */}
      <Modal open={workflowOpen} onClose={() => setWorkflowOpen(false)} />
    </div>
  )
}

export default AppLayout
