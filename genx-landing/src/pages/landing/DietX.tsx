import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgentLanding, { Feature } from '@/components/AgentLanding'

const hero = '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg'

const features: Feature[] = [
  {
    id: 'plans',
    title: 'Personalized meal plans',
    description: 'Daily menus tailored to your goals, preferences, and schedule.',
    image: hero,
  },
  {
    id: 'groceries',
    title: 'Smart grocery lists',
    description: 'Turn plans into optimized shopping lists with swaps and tips.',
    image: hero,
  },
  {
    id: 'macros',
    title: 'Macro tracking',
    description: 'Track protein, carbs, and fats with simple, visual goals.',
    image: hero,
  },
  {
    id: 'habits',
    title: 'Habit coaching',
    description: 'Build sustainable habits with gentle reminders and weekly reviews.',
    image: hero,
  },
]

const DietXLanding: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <AgentLanding
          name="DietX"
          slug="dietx"
          tagline="Personal nutrition plans, grocery lists, and habit tracking. Health made simple and sustainable."
          heroImage={hero}
          features={features}
        />
      </main>
      <Footer />
    </div>
  )
}

export default DietXLanding
