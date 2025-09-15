import React from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

export type Feature = {
  id: string
  title: string
  description: string
  image?: string
}

type AgentLandingProps = {
  name: 'CodeX' | 'BusinessX' | 'MarketX' | 'DietX'
  slug: 'codex' | 'businessx' | 'marketx' | 'dietx'
  tagline: string
  heroImage?: string
  features: Feature[]
}

const placeholder = '/assets/pawel-czerwinski-1A_dO4TFKgM-unsplash.jpg'

const AgentLanding: React.FC<AgentLandingProps> = ({ name, slug, tagline, heroImage = placeholder, features }) => {
  const { user } = useAuth()
  const [active, setActive] = React.useState(0)

  // Refs used to programmatically scroll to a feature section
  const sectionRefs = React.useRef<Array<HTMLDivElement | null>>([])

  const setRef = (el: HTMLDivElement | null, idx: number) => {
    sectionRefs.current[idx] = el
  }

  const scrollTo = (idx: number) => {
    const el = sectionRefs.current[idx]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Mobile: render sequential cards with fade-in
  const MobileStack: React.FC = () => (
    <div className="md:hidden">
      {features.map((f, i) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="text-base font-semibold text-white">{f.title}</div>
          <div className="mt-1 text-sm text-zinc-300">{f.description}</div>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${f.image || placeholder})` }} />
          </div>
        </motion.div>
      ))}
    </div>
  )

  // Desktop: split layout with sticky left, scroll-driven right visuals
  const SplitShowcase: React.FC = () => (
    <div className="relative hidden md:grid md:grid-cols-2 md:gap-8">
      {/* Left: Scrolling feature descriptions */}
      <div className="relative md:col-span-1">
        <div className="space-y-16">
          {features.map((f, i) => (
            <div key={f.id} ref={(el) => setRef(el, i)} className="min-h-[90vh] md:min-h-screen flex items-center py-16">
              <FeatureDescription
                index={i}
                title={f.title}
                description={f.description}
                onEnter={() => setActive(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Sticky image panel */}
      <div className="relative hidden md:block md:col-span-1">
        <div className="sticky top-0">
          <div className="relative h-screen w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  backgroundImage: `url(${features[active].image || placeholder})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-black text-white">
      {/* 1) Hero */}
      <section className="pt-10 md:pt-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold md:text-5xl">Meet {name}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300 md:text-base">{tagline}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to={user ? '/app/agents' : '/login'}
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center rounded-lg border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                Watch Demo
              </a>
            </div>

            {/* Hero image */}
            <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
              <div
                className="aspect-[16/9] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2) Features Showcase */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-semibold tracking-tight md:text-5xl mb-12">What it can do</h2>
          {/* Mobile sequential */}
          <MobileStack />
          {/* Desktop split */}
          <SplitShowcase />
        </div>
      </section>

      {/* 3) Demo */}
      <section id="demo" className="py-8 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-center text-4xl font-semibold md:text-5xl">Watch Demo</h3>
          <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <div
              className="aspect-[16/9] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
              aria-label="Demo placeholder"
            />
          </div>
        </div>
      </section>

      {/* 4) FAQs */}
      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="text-center text-2xl font-semibold">FAQs</h3>
          <div className="mt-6 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
            {getFAQs(name).map((qa, idx) => (
              <div key={qa.q} className="bg-white/[0.02] p-4">
                <div className="text-xs font-mono text-zinc-400">{String(idx + 1).padStart(2, '0')})</div>
                <div className="mt-1 text-sm font-semibold text-white">{qa.q}</div>
                <div className="mt-1 text-sm text-zinc-300">{qa.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureDescription: React.FC<{ index: number; title: string; description: string; onEnter: () => void }> = ({ index, title, description, onEnter }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: '-40% 0px -40% 0px', amount: 0.5 })

  React.useEffect(() => {
    if (inView) onEnter()
  }, [inView, onEnter])

  return (
    <div ref={ref}>
      <h3 className="text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h3>
      <p className="mt-5 max-w-prose text-lg text-zinc-300 md:text-xl">{description}</p>
    </div>
  )
}

const FeaturePanel: React.FC<{ index: number; image: string; onEnter: () => void }> = ({ index, image, onEnter }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: '-40% 0px -40% 0px', amount: 0.5 })

  React.useEffect(() => {
    if (inView) onEnter()
  }, [inView, onEnter])

  return (
    <div ref={ref} className="relative mb-16 last:mb-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl"
      >
        <div className="aspect-[16/9] w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      </motion.div>
    </div>
  )
}

function getFAQs(name: string) {
  return [
    {
      q: `What is ${name} and who is it for?`,
      a: `${name} is a specialized AI agent designed to help you accomplish tasks faster with expert workflows. It’s great for beginners and pros alike.`,
    },
    {
      q: `Can I use ${name} with the general chat?`,
      a: `Yes. You can chat with ${name} in the app and also combine it with other agents in multi-step workflows (coming soon).`,
    },
    {
      q: `How much does ${name} cost?`,
      a: `You can start free. Upgrade to an agent plan or All-Access for higher limits and features when available.`,
    },
    {
      q: `Do I need to install anything to try ${name}?`,
      a: `No installs. Just sign in on the web and you’re ready to go.`,
    },
  ]
}

export default AgentLanding
