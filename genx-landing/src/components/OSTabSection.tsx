import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type OSType = 'foundry' | 'launch'

interface Feature {
  title: string
  description: string
}

interface OSContent {
  title: string
  description: string
  features: Feature[]
  ctaLabel: string
  images: string[]
}

const OSTabFlow = () => {
  const [activeTab, setActiveTab] = useState<OSType>('foundry')
  const [hoveredFeature, setHoveredFeature] = useState<number>(0)

  const osData: Record<OSType, OSContent> = {
    foundry: {
      title: 'FoundryOS',
      description: 'The system that helps founders validate, structure, and build products intelligently.',
      features: [
        {
          title: 'Smart Validation',
          description: 'Validate startup ideas through AI-powered frameworks that adapt to your niche.',
        },
        {
          title: 'Research Intelligence',
          description: 'Get auto-generated competitor insights and market positioning.',
        },
        {
          title: 'Build Blueprints',
          description: 'Turn brainstorms into structured product plans in minutes.',
        },
      ],
      ctaLabel: 'Learn more about FoundryOS',
      images: [
        'https://via.placeholder.com/450x420?text=Smart+Validation',
        'https://via.placeholder.com/450x420?text=Research+Intelligence',
        'https://via.placeholder.com/450x420?text=Build+Blueprints',
      ],
    },
    launch: {
      title: 'LaunchOS',
      description: 'The platform that helps you brand, position, and scale your product to market faster.',
      features: [
        {
          title: 'Brand Story Builder',
          description: 'Define your tone, tagline, and design system in seconds.',
        },
        {
          title: 'Go-to-Market AI',
          description: 'Generate social and distribution strategies instantly.',
        },
        {
          title: 'Growth Insights',
          description: 'Track traction and performance through intelligent feedback loops.',
        },
      ],
      ctaLabel: 'Explore LaunchOS',
      images: [
        'https://via.placeholder.com/450x420?text=Brand+Story+Builder',
        'https://via.placeholder.com/450x420?text=Go-to-Market+AI',
        'https://via.placeholder.com/450x420?text=Growth+Insights',
      ],
    },
  }

  const currentOS = osData[activeTab]

  return (
    <section className="relative w-full bg-white py-12">
      <div className="mx-auto max-w-7xl px-8">
        {/* Tab Controls */}
        <div className="mb-16 flex gap-4 rounded-full bg-gray-100 p-1 w-fit mx-auto">
          {[
            { id: 'foundry', label: 'FoundryOS' },
            { id: 'launch', label: 'LaunchOS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as OSType)
                setHoveredFeature(0)
              }}
              className={`relative px-8 py-3 font-medium transition-all duration-300 rounded-full ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: '#FF3B00' }}
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            {/* Left Column - Image Area */}
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-[#f9f9f9] border border-[#eaeaea] flex items-center justify-center p-8 h-[420px]"
              layout
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={hoveredFeature}
                  src={currentOS.images[hoveredFeature]}
                  alt={currentOS.features[hoveredFeature].title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </motion.div>

            {/* Right Column - Content Area */}
            <motion.div
              className="flex flex-col"
              layout
            >
              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-semibold text-[#111111] mb-4"
              >
                {currentOS.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-[#555555] text-base leading-relaxed mb-10 max-w-md"
              >
                {currentOS.description}
              </motion.p>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-0"
              >
                {currentOS.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setHoveredFeature(index)}
                    onMouseEnter={() => setHoveredFeature(index)}
                    className="border-t border-[#eaeaea] py-5 cursor-pointer group transition-all"
                    whileHover={{ paddingLeft: 8 }}
                  >
                    <h3 className="text-[#111111] font-medium text-base mb-2 group-hover:text-[#ff5a00] transition">
                      {feature.title}
                    </h3>
                    <p className="text-[#666666] text-sm leading-relaxed max-w-md">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
                {/* Border for last item */}
                <div className="border-t border-[#eaeaea]" />
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-10 inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 rounded-lg hover:bg-[#222222] transition-all duration-300 font-medium"
              >
                {currentOS.ctaLabel}
                <span className="text-lg">→</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default OSTabFlow
