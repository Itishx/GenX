import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

type MobileMenuProps = {
  isOpen: boolean
  toggleMenu: () => void
  onClose?: () => void
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panel = {
  hidden: { x: '100%' },
  visible: { x: 0 },
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, toggleMenu, onClose }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleClose = () => {
    onClose?.()
    toggleMenu()
  }

  const items = [
    { href: '/#home', label: 'Home' },
    { href: '/#agents', label: 'Agents' },
    { href: '/about', label: 'About' },
    { href: '/#pricing', label: 'Pricing' },
    ...(user ? [{ href: '/app/chat', label: 'Chat' }] : [{ href: '/login', label: 'Login' }]),
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 md:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdrop}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
          <motion.aside
            key="panel"
            className="ml-auto h-full w-80 max-w-[85%] border-l border-white/10 bg-zinc-900 text-white shadow-xl"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panel}
            transition={{ type: 'tween', duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            id="mobile-menu"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-lg font-semibold">AgentX</span>
              <button
                aria-label="Close menu"
                onClick={handleClose}
                className="rounded-md p-2 text-zinc-300 hover:bg-white/10"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-2 flex flex-col space-y-1 px-4">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className="rounded-md px-2 py-3 text-base text-zinc-200 hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}

              {user && (
                <button
                  onClick={async () => {
                    await signOut()
                    handleClose()
                    navigate('/')
                  }}
                  className="mt-2 rounded-md border border-white/10 px-2 py-3 text-left text-base text-zinc-200 hover:bg-white/10"
                >
                  Log out
                </button>
              )}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu