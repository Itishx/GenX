import React from 'react'
import SocialIcons from './SocialIcons'

const Footer: React.FC = () => {
  const platformLinks = [
    { label: 'Overview', href: '/#home' },
    { label: 'How it Works', href: '/#home' },
    { label: 'Use Cases', href: '/#product' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Documentation', href: '#' },
  ]

  const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/coming-soon' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ]

  const osLinks = [
    { label: 'FoundryOS', href: '/foundryos' },
    { label: 'LaunchOS', href: '/launchos' },
  ]

  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col -ml-2">
            <a href="/#home" className="inline-flex items-center mb-6">
              <img 
                src="/assets/aviatelogo.png" 
                alt="Aviate" 
                className="h-16 w-auto"
              />
            </a>
            <p className="text-sm leading-relaxed text-[#555555] mb-8">
              Your AI copilot to build and grow. Aviate brings together everything founders need.
            </p>
            <div className="flex gap-4">
              <SocialIcons />
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-[#333333] mb-6">Platform</h3>
            <ul className="space-y-4">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#555555] hover:text-[#111111] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-[#333333] mb-6">Company</h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#555555] hover:text-[#111111] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: AI Operating Systems */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-[#333333] mb-6">AI Operating Systems</h3>
            <ul className="space-y-4">
              {osLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#555555] hover:text-[#111111] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#eaeaea]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Copyright */}
            <p className="text-sm text-[#888888]">
              © 2025 Aviate. All rights reserved.
            </p>

            {/* Right: Legal Links */}
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="text-sm text-[#888888] hover:text-[#111111] transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <span className="text-[#eaeaea]">|</span>
              <a
                href="/terms"
                className="text-sm text-[#888888] hover:text-[#111111] transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer