import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FiCode, FiBriefcase, FiTrendingUp, FiHeart, FiSend, FiMenu } from 'react-icons/fi'

 type AgentKey = 'Code' | 'Biz' | 'Marketing' | 'Diet'

const AGENTS: { key: AgentKey; name: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'Code', name: 'Code Agent', icon: <FiCode className="h-5 w-5" />, desc: 'Code generation, refactors, reviews' },
  { key: 'Biz', name: 'Biz Agent', icon: <FiBriefcase className="h-5 w-5" />, desc: 'Ops, proposals, automations' },
  { key: 'Marketing', name: 'Marketing Agent', icon: <FiTrendingUp className="h-5 w-5" />, desc: 'Campaigns, copy, analytics' },
  { key: 'Diet', name: 'Diet Agent', icon: <FiHeart className="h-5 w-5" />, desc: 'Meals, macros, guidance' },
]

const MODELS = ['GPT', 'Claude', 'Gemini', 'Hugging Face'] as const

type Message = {
  id: string
  role: 'user' | 'agent'
  text: string
}

const bubbleVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
}

const Chat: React.FC = () => {
  const [activeAgent, setActiveAgent] = React.useState<AgentKey>('Code')
  const [model, setModel] = React.useState<typeof MODELS[number]>('GPT')
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 'm1', role: 'agent', text: 'Hi! I am your Code Agent. How can I help today?' },
  ])
  const [input, setInput] = React.useState('')
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // mock agent reply
    setTimeout(() => {
      const agent = AGENTS.find((a) => a.key === activeAgent)!
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'agent', text: `${agent.name} (${model}): working on it…` },
      ])
    }, 500)
  }

  const currentAgent = AGENTS.find((a) => a.key === activeAgent)!

  return (
    <section id="app" className="relative bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-20">
        <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[260px_1fr]">
          {/* Sidebar (md+) */}
          <aside className="hidden h-full border-r border-gray-200 bg-gray-50/60 p-4 md:block">
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Agents</h3>
            <ul className="mt-3 space-y-1">
              {AGENTS.map((a) => (
                <li key={a.key}>
                  <button
                    onClick={() => setActiveAgent(a.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      activeAgent === a.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
                      {a.icon}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-gray-500">{a.desc}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat Pane */}
          <div className="relative flex h-full flex-col">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
              >
                <FiMenu className="h-4 w-4" />
                Agents
              </button>
              <div className="text-sm font-medium text-gray-900">{currentAgent.name}</div>
            </div>

            {/* Header */}
            <div className="hidden items-center justify-between border-b border-gray-200 px-6 py-4 md:flex">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
                  {currentAgent.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{currentAgent.name}</div>
                  <div className="text-xs text-gray-500">{currentAgent.desc}</div>
                </div>
              </div>

              {/* Model select */}
              <div className="flex items-center gap-2">
                <label htmlFor="model" className="sr-only">Model</label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value as typeof model)}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
              <div className="md:hidden">
                {/* Model select for mobile */}
                <div className="mb-4 flex items-center gap-2">
                  <label htmlFor="model-mobile" className="sr-only">Model</label>
                  <select
                    id="model-mobile"
                    value={model}
                    onChange={(e) => setModel(e.target.value as typeof model)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    variants={bubbleVariants}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'agent' && (
                      <div className="mr-3 hidden md:block">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
                          {currentAgent.icon}
                        </div>
                      </div>
                    )}

                    <div
                      className={`${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* bottom spacer for sticky input */}
              <div className="h-24" />
            </div>

            {/* Input bar */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white/80 p-4 backdrop-blur">
              <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder={`Message ${currentAgent.name}…`}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                <Button onClick={send} className="gap-2">
                  <FiSend className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              className="ml-auto h-full w-80 max-w-[85%] bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="border-b border-gray-200 px-4 py-4 text-sm font-semibold">Agents</div>
              <ul className="space-y-1 p-4">
                {AGENTS.map((a) => (
                  <li key={a.key}>
                    <button
                      onClick={() => {
                        setActiveAgent(a.key)
                        setSidebarOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                        activeAgent === a.key ? 'bg-gray-50 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
                        {a.icon}
                      </span>
                      <div>
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs text-gray-500">{a.desc}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Chat
