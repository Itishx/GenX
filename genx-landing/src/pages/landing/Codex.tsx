import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgentLanding, { Feature } from '@/components/AgentLanding'

const hero = '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg'

const features: Feature[] = [
  {
    id: 'fast-prototyping',
    title: 'Rapid prototyping',
    description: 'Generate components, hooks, and tests in seconds. Iterate faster with contextual suggestions.',
    image: hero,
  },
  {
    id: 'refactor',
    title: 'Safe refactors',
    description: 'Refactor confidently with preview diffs and test hints. Keep complexity in check.',
    image: hero,
  },
  {
    id: 'reviews',
    title: 'Code reviews',
    description: 'Get concise feedback on readability, performance, and edge cases before opening PRs.',
    image: hero,
  },
  {
    id: 'docs',
    title: 'Instant docs',
    description: 'Explain code and generate API snippets your team can share. Great for onboarding.',
    image: hero,
  },
]

const CodexLanding: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <AgentLanding
          name="CodeX"
          slug="codex"
          tagline="Your coding copilot for rapid prototyping, refactors, and test generation."
          heroImage={hero}
          features={features}
        />
      </main>
      <Footer />
    </div>
  )
}

export default CodexLanding
