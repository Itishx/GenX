import React from 'react'
import SocialIcons from './SocialIcons'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Left: Logo and tagline */}
          <div className="flex flex-col items-start md:col-span-4 md:pl-8">
            <a href="/#home" className="flex items-center">
              <img 
                src="/assets/aviatelogo.png" 
                alt="Aviate" 
                className="h-24 w-auto md:h-28"
              />
            </a>
            {/* tagline added below logo */}
            <p className="mt-3 max-w-sm text-left text-sm leading-relaxed text-gray-600">
              Your AI copilot to build and grow. Aviate brings together everything founders need — from validating ideas to launching and scaling businesses.
            </p>
          </div>

          {/* Center: Link columns */}
          <div className="md:col-span-5 lg:col-span-6 md:pl-8">
            <div className="grid grid-cols-2 gap-10 text-center md:text-left">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Explore</h4>
                <ul className="mt-4 space-y-3 text-gray-600">
                  {[
                    { label: 'How it works', href: '/#home' },
                    { label: 'Use Cases', href: '/#product' },
                    { label: 'Company', href: '/#home' },
                    { label: 'About', href: '/about' },
                    { label: 'Pricing', href: '/#pricing' },
                  ].map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="transition-colors hover:text-gray-900"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">AI Operating Systems</h4>
                <ul className="mt-4 space-y-3 text-gray-600">
                  {[
                    { label: 'FoundryOS', href: '/foundryos' },
                    { label: 'LaunchOS', href: '/launchos' },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="transition-colors hover:text-gray-900">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-3" />
        </div>

        {/* Centered bottom: copyright then social icons */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">© 2025 Aviate. All rights reserved.</p>
          <div className="mt-4 flex justify-center">
            <SocialIcons />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer