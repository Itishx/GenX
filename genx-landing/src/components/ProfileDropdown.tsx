import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiUsers, FiCreditCard, FiLogOut } from 'react-icons/fi'

const ProfileDropdown: React.FC = () => {
  const { user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user?.email?.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown Card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-gray-100 p-0 z-50"
            role="menu"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{profile?.name || user?.email}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2 px-0">
              <Link
                to="/app/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <FiUser className="w-4 h-4 text-gray-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/app/agents"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <FiUsers className="w-4 h-4 text-gray-400" />
                <span>My Agents</span>
              </Link>

              <Link
                to="/app/subscriptions"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <FiCreditCard className="w-4 h-4 text-gray-400" />
                <span>Billing Info</span>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close menu */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}

export default ProfileDropdown
