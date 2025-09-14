import React from 'react'
import { Button } from '@/components/ui/button'
import { FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Free',
    price: '$0',
    tagline: 'Explore the platform',
    features: ['Community access', 'Basic prompts', 'Limited usage'],
    emphasized: false,
  },
  {
    name: 'Individual Agent',
    price: '$5–$10',
    tagline: 'Pick a single specialist',
    features: ['1 specialized agent', 'Email support', 'Usage analytics'],
    emphasized: false,
  },
  {
    name: 'All-Access',
    price: '$20–$25',
    tagline: 'Most Popular',
    features: ['All agents included', 'Priority support', 'Collaborative workflows'],
    emphasized: true,
  },
]

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="relative bg-black py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Pricing</h2>
          <p className="mt-3 text-zinc-300">Simple plans to fit your workflow, whether you need one agent or the whole team.</p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              className={
                'relative rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5 ' +
                (p.emphasized
                  ? 'border-white/10 bg-white/[0.06] '
                  : 'border-white/10 bg-white/[0.03]')
              }
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.06 }}
            >
              {p.emphasized && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20" aria-hidden />
              )}
              <div className="relative">
                {p.emphasized && (
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-1 text-xs font-medium text-white">Most Popular</span>
                )}
                <h3 className="mt-3 text-lg font-semibold text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-zinc-300">{p.tagline}</p>
                <div className="mt-4 text-3xl font-bold text-white">{p.price}</div>

                <ul className="mt-6 space-y-3">
                  {p.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-200">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                        <FiCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {p.emphasized ? (
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:opacity-90">Get All-Access</Button>
                  ) : (
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Choose Plan</Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
