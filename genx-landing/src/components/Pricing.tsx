import React from 'react'
import { motion } from 'framer-motion'

type TabType = 'foundryos' | 'launchos' | 'bundle'

interface PricingPlan {
  name: string
  subheading: string
  price: number
  period: string
  savings?: number
}

const PRICING_PLANS: Record<TabType, PricingPlan[]> = {
  foundryos: [
    {
      name: 'Monthly',
      subheading: 'Flexible billing for FoundryOS',
      price: 17,
      period: 'month',
    },
    {
      name: 'Annual',
      subheading: 'Best value for FoundryOS',
      price: 180,
      period: 'year',
      savings: 12,
    },
  ],
  launchos: [
    {
      name: 'Monthly',
      subheading: 'Flexible billing for LaunchOS',
      price: 17,
      period: 'month',
    },
    {
      name: 'Annual',
      subheading: 'Best value for LaunchOS',
      price: 180,
      period: 'year',
      savings: 12,
    },
  ],
  bundle: [
    {
      name: 'Monthly',
      subheading: 'All agents included, billed monthly',
      price: 34,
      period: 'month',
    },
    {
      name: 'Annual',
      subheading: 'Save 20% with annual billing',
      price: 360,
      period: 'year',
      savings: 20,
    },
  ],
}

const TAB_LABELS: Record<TabType, string> = {
  foundryos: 'FoundryOS',
  launchos: 'LaunchOS',
  bundle: 'Bundle',
}

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('foundryos')

  const tabs: TabType[] = ['foundryos', 'launchos', 'bundle']
  const currentPlans = PRICING_PLANS[activeTab]

  return (
    <section id="pricing" className="relative bg-white py-12 md:py-16 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm text-[#777777] uppercase tracking-wide mb-3 font-medium">Pricing</p>
          <h2 className="text-4xl font-semibold text-[#111111] mb-2">Our Pricing</h2>
          <p className="text-[#555555] text-base">Simple plans. No hidden fees.</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="flex gap-4 rounded-full bg-gray-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 font-medium transition-all duration-300 rounded-full ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: '#FF3B00' }}
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{TAB_LABELS[tab]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'in-out' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10"
        >
          {currentPlans.map((plan, idx) => (
            <motion.div
              key={`${activeTab}-${idx}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.1 }}
              className="rounded-2xl border border-[#eaeaea] p-8 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#111111]">{plan.name}</h3>
                  <p className="text-[#777777] text-sm mt-1">{plan.subheading}</p>

                  {/* Price Section */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-[#111111]">${plan.price}</span>
                    <span className="text-sm text-[#777777]">/ {plan.period}</span>
                  </div>

                  {/* Savings Badge */}
                  {plan.savings && (
                    <div className="mt-3 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs text-green-700 font-medium">
                      Save {plan.savings}%
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <button className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium text-sm transition-colors duration-300 hover:bg-[#FF3B00]">
                    Get Started
                  </button>
                  <p className="text-xs text-[#888888] mt-3 text-center">No credit card required.</p>
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
