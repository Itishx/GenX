# Reusable Component Templates

Copy these into your new projects and customize the content.

---

## Hero Section Component

```tsx
// Hero.tsx
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="relative flex min-h-[100vh] items-center justify-center bg-white text-gray-900 pt-32 pb-20">
      <div className="container px-6 text-center">
        <motion.h1
          className="mx-auto max-w-4xl font-bold text-gray-900"
          style={{ fontSize: '75px', lineHeight: '0.92', fontFamily: "'Neue Haas Display', serif" }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Your <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Amazing Product
          </span> for <span className="text-gray-900">everyone</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-600"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          Your tagline goes here. Keep it short and impactful.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <button className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-900 hover:text-white">
            Primary CTA
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-900 hover:text-white">
            Secondary CTA
          </button>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 w-full max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 shadow-2xl rounded-3xl">
            <img
              src="/your-image.jpg"
              alt="Product Preview"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
```

---

## Content Section (Metrics/Stats)

```tsx
// MetricsSection.tsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const MetricsSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const metrics = [
    { number: '100+', heading: 'Customers', desc: 'Growing daily' },
    { number: '50M+', heading: 'Data Points', desc: 'Processed' },
    { number: '99.9%', heading: 'Uptime', desc: 'Reliability' },
  ]

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Left Column */}
          <motion.div variants={itemVariants}>
            <p className="text-xs text-gray-500 font-medium mb-4 tracking-wide">BY THE NUMBERS</p>
            <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6" style={{ fontFamily: "'Neue Haas Display', serif" }}>
              Built for <span className="text-orange-600">scale</span>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-lg">
              Describe what makes your product scalable and reliable.
            </p>
          </motion.div>

          {/* Right Column - Metrics Grid */}
          <motion.div className="grid grid-cols-1 gap-0" variants={containerVariants}>
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col py-8 border-b border-gray-200 last:border-b-0"
                variants={itemVariants}
                whileHover={{ paddingLeft: 8 }}
              >
                <div className="text-3xl font-bold text-orange-600" style={{ fontFamily: "'Neue Haas Display', serif" }}>
                  {metric.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                  {metric.heading}
                </h3>
                <p className="text-sm text-gray-600">
                  {metric.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default MetricsSection
```

---

## Pricing Section

```tsx
// Pricing.tsx
import { motion } from 'framer-motion'
import { useState } from 'react'

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('monthly')

  const plans = [
    { name: 'Starter', price: 29, desc: 'For individuals' },
    { name: 'Pro', price: 99, desc: 'For teams', popular: true },
    { name: 'Enterprise', price: 'Custom', desc: 'For enterprises' },
  ]

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">PRICING</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Simple Plans</h2>
          <p className="text-gray-600">No hidden fees. Cancel anytime.</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl border p-8 transition-all ${
                plan.popular
                  ? 'border-orange-600 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-3 py-1 text-xs font-bold text-orange-600 bg-orange-100 rounded-full mb-4">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                {typeof plan.price === 'number' && <span className="text-gray-600">/month</span>}
              </div>
              <button className={`w-full mt-8 py-3 rounded-lg font-medium transition-all ${
                plan.popular
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-900 text-white hover:bg-orange-600'
              }`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
```

---

## FAQ/Accordion Section

```tsx
// FAQSection.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

const FAQSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null)

  const faqs = [
    { id: '1', q: 'Question one?', a: 'Answer one goes here.' },
    { id: '2', q: 'Question two?', a: 'Answer two goes here.' },
    { id: '3', q: 'Question three?', a: 'Answer three goes here.' },
  ]

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-gray-900">FAQ</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
              >
                <h3 className="text-left text-lg font-semibold text-gray-900">{faq.q}</h3>
                <motion.div animate={{ rotate: expanded === faq.id ? 45 : 0 }} transition={{ duration: 0.3 }}>
                  <Plus size={20} className="text-orange-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <p className="p-6 text-gray-600">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
```

---

## Feature Cards Grid

```tsx
// FeaturesSection.tsx
import { motion } from 'framer-motion'

const FeaturesSection = () => {
  const features = [
    { title: 'Feature 1', desc: 'Description of feature one' },
    { title: 'Feature 2', desc: 'Description of feature two' },
    { title: 'Feature 3', desc: 'Description of feature three' },
    { title: 'Feature 4', desc: 'Description of feature four' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="text-gray-600">Everything you need</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-orange-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
```

---

**Just copy-paste these, update the content, and you're done!**
