import React from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

// Types
type Agent = {
  id: string
  title: string
  desc: string
  image: string
  gradientFrom: string
  gradientTo: string
}

// Data
const agents: Agent[] = [
  {
    id: 'codex',
    title: 'CodeX',
    desc: 'Your coding copilot for rapid prototyping, refactors, and test generation. Connect repos and ship faster.',
    image: '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg',
    gradientFrom: 'from-indigo-600/50',
    gradientTo: 'to-fuchsia-600/30',
  },
  {
    id: 'businessx',
    title: 'BusinessX',
    desc: 'Research markets, draft plans, and analyze KPIs. Turn strategy into measurable outcomes.',
    image: '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg',
    gradientFrom: 'from-emerald-600/50',
    gradientTo: 'to-cyan-600/30',
  },
  {
    id: 'marketx',
    title: 'MarketX',
    desc: 'Campaign ideas, content calendars, and performance insights. Grow with data-backed creativity.',
    image: '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg',
    gradientFrom: 'from-amber-500/50',
    gradientTo: 'to-pink-600/30',
  },
  {
    id: 'dietx',
    title: 'DietX',
    desc: 'Personal nutrition plans, grocery lists, and habit tracking. Health made simple and sustainable.',
    image: '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg',
    gradientFrom: 'from-rose-600/50',
    gradientTo: 'to-purple-600/30',
  },
]

// Single scrolling section for each agent (left column)
const AgentSection: React.FC<{
  agent: Agent
  index: number
  onActive: (index: number) => void
}> = ({ agent, index, onActive }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.6, margin: '-10% 0px -10% 0px' })

  React.useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="min-h-[90vh] md:min-h-screen flex items-center py-16"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full md:w-auto md:pr-10">
        <h3 className="text-4xl font-extrabold tracking-tight md:text-6xl">{agent.title}</h3>
        <p className="mt-5 max-w-prose text-lg text-zinc-300 md:text-xl">{agent.desc}</p>

        {/* Explore button */}
        <div className="mt-6">
          <Link
            to={`/${agent.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-white hover:text-black"
          >
            Explore
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        </div>

        {/* Mobile image preview */}
        <div
          className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:hidden"
          style={{
            backgroundImage: `url(${agent.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={`h-full w-full bg-gradient-to-br ${agent.gradientFrom} ${agent.gradientTo}`} />
        </div>
      </div>
    </motion.section>
  )
}

const AgentsShowcase: React.FC = () => {
  const [active, setActive] = React.useState(0)

  return (
    <section id="agents" className="relative bg-black text-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left: stacked sections */}
          <div className="relative">
            {agents.map((agent, i) => (
              <AgentSection key={agent.id} agent={agent} index={i} onActive={setActive} />
            ))}

            {/* Spacer to ensure sticky releases cleanly after last agent */}
            <div className="h-24" />
          </div>

          {/* Right: sticky visual that updates with active */}
          <div className="relative hidden md:block">
            <div className="sticky top-28">
              <div className="relative mx-auto aspect-[16/9] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={agents[active].id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${agents[active].image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    aria-label={`${agents[active].title} visual`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${agents[active].gradientFrom} ${agents[active].gradientTo}`} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AgentsShowcase
