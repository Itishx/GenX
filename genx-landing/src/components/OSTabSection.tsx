import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type OSType = 'foundry' | 'launch'

const OSTabSection = () => {
  const [activeTab, setActiveTab] = useState<OSType>('foundry')

  const osData = {
    foundry: {
      title: 'FoundryOS',
      subheading: 'Validate, plan, and build your startup — from idea to MVP.',
      description: 'Placeholder for full description and features',
    },
    launch: {
      title: 'LaunchOS',
      subheading: 'Scale your brand with AI-driven content, strategy, and insights.',
      description: 'Placeholder for full description and features',
    },
  }

  const currentOS = osData[activeTab]

  return (
    <section className="relative w-full bg-white py-0 md:py-4">
      <div className="mx-auto flex max-w-full flex-col items-center justify-center px-6">
        {/* Tab Controls */}
        <div className="flex gap-4 rounded-full bg-gray-100 p-1">
          {[
            { id: 'foundry', label: 'FoundryOS' },
            { id: 'launch', label: 'LaunchOS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OSType)}
              className={`relative px-8 py-3 font-medium transition-all duration-300 rounded-full ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500"
                  style={{ backgroundColor: '#FF3B00' }}
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-16 w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center"
            >
              {/* OS Title */}
              <h3
                className="font-bold text-gray-900"
                style={{ fontFamily: "'Neue Haas Display', serif", fontSize: '52px', lineHeight: '0.95' }}
              >
                {currentOS.title}
              </h3>

              {/* OS Subheading */}
              <p
                className="mt-6 text-gray-700"
                style={{ fontFamily: "'Neue Haas Display', serif", fontSize: '20px', lineHeight: '1.6' }}
              >
                {currentOS.subheading}
              </p>

              {/* Placeholder space for full description and features */}
              <div className="mt-12 min-h-64 w-full rounded-lg border border-gray-200 bg-gray-50 p-8">
                <p className="text-center text-gray-400">
                  {currentOS.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default OSTabSection
