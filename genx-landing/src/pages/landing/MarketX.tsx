import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgentLanding, { Feature } from '@/components/AgentLanding'

const hero = '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg'

const features: Feature[] = [
  {
    id: 'campaigns',
    title: 'Campaign planning',
    description: 'Turn briefs into multi-channel plans with timelines and KPIs.',
    image: hero,
  },
  {
    id: 'copy',
    title: 'On-brand copy',
    description: 'Generate and A/B test headlines, posts, and emails that convert.',
    image: hero,
  },
  {
    id: 'analytics',
    title: 'Performance insights',
    description: 'Spot trends and allocate budgets with actionable insights.',
    image: hero,
  },
  {
    id: 'calendar',
    title: 'Content calendars',
    description: 'Ship consistently with auto-generated ideas and schedules.',
    image: hero,
  },
]

const MarketXLanding: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <AgentLanding
          name="MarketX"
          slug="marketx"
          tagline="Campaign ideas, content calendars, and performance insights. Grow with data-backed creativity."
          heroImage={hero}
          features={features}
        />
      </main>
      <Footer />
    </div>
  )
}

export default MarketXLanding
