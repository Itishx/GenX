import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

type TabType = 'general' | 'foundry' | 'launch' | 'pricing'
type ExpandedType = string | null

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [expandedFAQ, setExpandedFAQ] = useState<ExpandedType>(null)

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'foundry', label: 'FoundryOS' },
    { id: 'launch', label: 'LaunchOS' },
    { id: 'pricing', label: 'Pricing & Access' },
  ]

  const faqData = {
    general: [
      {
        id: 'g1',
        question: 'What is Aviate?',
        answer:
          'Aviate is your AI copilot for founders - helping you go from idea to traction through two operating systems: FoundryOS for planning and LaunchOS for growth.',
      },
      {
        id: 'g2',
        question: 'How does Aviate actually help founders?',
        answer:
          'Aviate brings structure to every stage of your startup journey - from validating ideas and building your MVP to launching and scaling your brand.',
      },
      {
        id: 'g3',
        question: 'Do I need technical skills to use Aviate?',
        answer:
          'Not at all. Aviate is designed for non-technical founders as much as developers. The interface is visual, guided, and AI-assisted.',
      },
      {
        id: 'g4',
        question: 'Can I use both FoundryOS and LaunchOS together?',
        answer:
          'Yes. FoundryOS and LaunchOS are designed to work seamlessly. You can start in Foundry, then move into Launch when you\'re ready to grow - or bundle both for a complete founder experience.',
      },
    ],
    foundry: [
      {
        id: 'f1',
        question: 'What is FoundryOS?',
        answer:
          'FoundryOS helps you go from idea to MVP. It\'s your workspace for validation, research, planning, and early-stage product thinking.',
      },
      {
        id: 'f2',
        question: 'How does FoundryOS validate ideas?',
        answer:
          'It uses structured frameworks and AI analysis to test your ideas against market fit, audience insights, and competitive patterns - helping you find clarity before building.',
      },
      {
        id: 'f3',
        question: 'What kind of outputs can I expect from FoundryOS?',
        answer:
          'You\'ll get business summaries, user personas, competitor breakdowns, and product blueprints - all automatically generated as you brainstorm.',
      },
      {
        id: 'f4',
        question: 'Can FoundryOS help with investor decks or product pitches?',
        answer:
          'Yes. FoundryOS automatically structures your research and product logic into investor-ready outlines you can export and refine.',
      },
    ],
    launch: [
      {
        id: 'l1',
        question: 'What is LaunchOS?',
        answer:
          'LaunchOS is your AI brand and growth system - designed to help you launch, position, and scale your product once it\'s ready.',
      },
      {
        id: 'l2',
        question: 'What can I do with LaunchOS?',
        answer:
          'You can create your brand identity, build landing page copy, generate go-to-market strategies, and manage campaigns - all from one workspace.',
      },
      {
        id: 'l3',
        question: 'Does LaunchOS create visuals or just copy?',
        answer:
          'It does both. LaunchOS generates copy, tone, and brand systems with clear design direction - so your brand feels cohesive from the start.',
      },
      {
        id: 'l4',
        question: 'Can LaunchOS handle ongoing marketing after launch?',
        answer:
          'Yes. It helps you plan, track, and iterate campaigns, adapting your strategy based on what\'s performing.',
      },
    ],
    pricing: [
      {
        id: 'p1',
        question: 'Is Aviate free to use?',
        answer:
          'Aviate offers a free plan with limited access. You can explore both OS environments before upgrading to unlock full functionality.',
      },
      {
        id: 'p2',
        question: 'Do I need to subscribe separately for FoundryOS and LaunchOS?',
        answer:
          'You can - but there\'s also a bundle plan that gives you both at a reduced cost.',
      },
      {
        id: 'p3',
        question: 'What happens when new features are released?',
        answer:
          'Aviate updates automatically - your workspace evolves with every new feature, so you\'re always ahead.',
      },
      {
        id: 'p4',
        question: 'Will Aviate work on mobile?',
        answer: 'Yes. Aviate is fully responsive and optimized for desktop, tablet, and mobile.',
      },
    ],
  }

  const currentFAQs = faqData[activeTab]

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId)
    setExpandedFAQ(null) // Reset expanded FAQ when switching tabs
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <section className="w-full bg-white py-24 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#777777]">
            Support & Resources
          </p>
          <h2
            className="text-4xl font-semibold text-[#111111] md:text-5xl"
            style={{ fontFamily: "'Neue Haas Display', serif" }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          className="mb-12 flex gap-1 rounded-full bg-gray-100 p-1 w-fit mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabType)}
              className={`relative px-6 py-3 font-medium text-base transition-all duration-300 rounded-full ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              style={{ fontFamily: "'Neue Haas Display', 'Inter', sans-serif" }}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: '#FF3B00' }}
                  layoutId="activeFaqTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {currentFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-[#eaeaea] py-5 transition-all"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="flex w-full cursor-pointer items-center justify-between transition-all duration-200 hover:text-[#111111]"
                  >
                    <h3 className="text-left text-base font-medium text-[#111111]">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: expandedFAQ === faq.id ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="ml-4 flex-shrink-0"
                    >
                      <Plus
                        size={20}
                        className="text-orange-500 transition-colors duration-300"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-base leading-relaxed text-[#555555]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQSection
