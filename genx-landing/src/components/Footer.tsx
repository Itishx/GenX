import React from 'react'
import SocialIcons from './SocialIcons'

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Left: Watermark brand */}
          <div className="flex flex-col items-start md:col-span-4">
            <div className="text-5xl font-extrabold tracking-tight text-white/90 md:text-7xl">AgentX</div>
            {/* tagline added below logo */}
            <p className="mt-4 max-w-md text-left text-[13px] leading-relaxed text-zinc-400">
              Your personal army of AI specialists, powered by the latest LLMs and designed for real-world productivity.
            </p>
          </div>

          {/* Center: Link columns */}
          <div className="md:col-span-5 lg:col-span-6">
            <div className="grid grid-cols-2 gap-10 text-center md:text-left">
              <div>
                <h4 className="text-sm font-semibold">Explore</h4>
                <ul className="mt-4 space-y-3 text-zinc-400">
                  {[
                    { label: 'How it works', href: '/#home' },
                    { label: 'Use Cases', href: '/#agents' },
                    { label: 'Company', href: '/#home' },
                    { label: 'About', href: '/about' },
                    { label: 'Pricing', href: '/#pricing' },
                  ].map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold">Agents</h4>
                <ul className="mt-4 space-y-3 text-zinc-400">
                  {[
                    { label: 'CodeX', href: '/codex' },
                    { label: 'MarketX', href: '/marketx' },
                    { label: 'BusinessX', href: '/businessx' },
                    { label: 'DietX', href: '/dietx' },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column no longer shows social/copyright */}
          <div className="md:col-span-3" />
        </div>

        {/* Centered bottom: copyright then social icons */}
        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-400">© 2025 AgentX. All rights reserved.</p>
          <div className="mt-4 flex justify-center">
            <SocialIcons />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer