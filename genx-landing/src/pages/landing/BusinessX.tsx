import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgentLanding, { Feature } from '@/components/AgentLanding'

const hero = '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg'

const features: Feature[] = [
  {
    id: 'strategy',
    title: 'Strategy planner',
    description: 'Turn goals into roadmaps with milestones, owners, and risks in one place.',
    image: hero,
  },
  {
    id: 'kpis',
    title: 'Live KPI snapshots',
    description: 'Track MRR, churn, NPS and more. Get insights and suggestions to improve metrics.',
    image: hero,
  },
  {
    id: 'ops',
    title: 'Ops workflows',
    description: 'Automate weekly checklists, meeting notes, and follow-ups to keep teams aligned.',
    image: hero,
  },
  {
    id: 'docs',
    title: 'Exec-ready docs',
    description: 'Generate briefs, updates, and one-pagers with clear action items.',
    image: hero,
  },
]

const BusinessXLanding: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <AgentLanding
          name="BusinessX"
          slug="businessx"
          tagline="Research markets, draft plans, and analyze KPIs. Turn strategy into measurable outcomes."
          heroImage={hero}
          features={features}
        />
      </main>
      <Footer />
    </div>
  )
}

export default BusinessXLanding
