import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen((p) => !p)
  const { user, hasAgents } = useAuth()

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="w-full border-b border-gray-100 bg-white shadow-sm backdrop-blur-sm">
        <div className="relative mx-auto flex max-w-7xl items-center px-6 py-4">
          {/* Left: Logo */}
          <a href="/#home" className="flex items-center -ml-2">
            <img 
              src="/assets/aviatelogo.png" 
              alt="Aviate" 
              className="h-9 w-auto -mb-1"
            />
          </a>

          {/* Center: Nav links (absolute centered) */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-x-8 text-sm text-gray-600 md:flex">
            <li><a href="/#product" className="transition-colors hover:text-gray-900">Product</a></li>
            <li><a href="/#resources" className="transition-colors hover:text-gray-900">Resources</a></li>
            <li><a href="/#pricing" className="transition-colors hover:text-gray-900">Pricing</a></li>
            <li><a href="/about" className="transition-colors hover:text-gray-900">About</a></li>
          </ul>

          {/* Right: Auth + Mobile */}
          <div className="ml-auto flex items-center">
            {/* Auth area */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/app/agents"
                    className="hidden rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 md:inline-flex"
                  >
                    {hasAgents ? 'Dashboard' : 'Get Started'}
                  </Link>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-600 transition-colors hover:text-gray-900">Login</Link>
                  <Link 
                    to="/signup" 
                    className="ml-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-sm"
                  >
                    Join the Waitlist
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="ml-3 flex items-center md:hidden">
              <button
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar