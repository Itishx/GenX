import React, { useState } from 'react'
import MobileMenu from './MobileMenu'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import ProfileDropdown from '@/components/ProfileDropdown'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen((p) => !p)
  const closeMenu = () => setIsOpen(false)
  const { user, hasAgents } = useAuth()

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="w-full border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="relative mx-auto flex max-w-7xl items-center px-4 py-4">
          {/* Left: Logo */}
          <a href="/#home" className="text-base font-semibold tracking-tight text-white">AgentX</a>

          {/* Center: Nav links (absolute centered) */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-x-8 text-sm text-zinc-300 md:flex">
            <li><a href="/#home" className="transition-colors hover:text-white">Home</a></li>
            <li><a href="/#agents" className="transition-colors hover:text-white">Agents</a></li>
            <li><Link to="/about" className="transition-colors hover:text-white">About</Link></li>
            <li><a href="/#pricing" className="transition-colors hover:text-white">Pricing</a></li>
          </ul>

          {/* Right: Auth + Mobile */}
          <div className="ml-auto flex items-center">
            {/* Auth area */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    to="/app/agents"
                    className="hidden rounded-md border border-white/15 bg-white/0 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10 md:inline-flex"
                  >
                    {hasAgents ? 'My Agents' : 'Create an Agentic Workspace'}
                  </Link>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10">Login</Link>
                  <Link to="/signup" className="ml-2 hidden rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 md:inline-block">Sign up</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="ml-2 flex items-center md:hidden">
              <button
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-zinc-200 transition-colors hover:bg-white/10"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} toggleMenu={toggleMenu} onClose={closeMenu} />
    </header>
  )}

export default Navbar