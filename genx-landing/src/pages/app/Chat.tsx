import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FiSend, FiChevronDown, FiCheck } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

type Model = 'GPT' | 'Claude' | 'Gemini'
const MODELS: Model[] = ['GPT', 'Claude', 'Gemini']

const ChatPage: React.FC = () => {
  const { profile, user } = useAuth()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState('')
  const [model, setModel] = React.useState<Model>('GPT')
  const [modelOpen, setModelOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setModelOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    // mock assistant uses selected model
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: `[${model}] Working on it…` }])
    }, 400)
  }

  return (
    <div className="flex h-full flex-col bg-black text-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-24 max-w-2xl text-center">
            <div className="text-2xl font-semibold">Start a new chat</div>
            <div className="mt-2 text-sm text-zinc-400">Ask anything and your agents will help.</div>
          </motion.div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.role === 'user' ? 'bg-white text-black' : 'bg-white/10 text-white'} max-w-[80%] rounded-2xl px-4 py-2 text-sm`}>{m.text}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="h-24" />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 p-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-white/20 bg-black/60 px-2 py-2 backdrop-blur transition-colors hover:border-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            placeholder={`Message ${profile?.full_name || user?.email || 'AgentX'}…`}
          />

          {/* Model selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setModelOpen((o) => !o)}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1.5 text-xs text-zinc-200 transition-colors hover:border-white hover:text-white"
              aria-haspopup="menu"
              aria-expanded={modelOpen}
            >
              {model}
              <FiChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full right-0 z-50 mb-2 w-40 overflow-hidden rounded-lg border border-white/10 bg-black p-1 text-sm text-white shadow-xl"
                  role="menu"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setModel(m)
                        setModelOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/10 hover:text-white ${model === m ? 'bg-white/5' : ''}`}
                      role="menuitem"
                    >
                      {m}
                      {model === m && <FiCheck className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button onClick={send} variant="ghost" className="rounded-full border border-white/20 bg-white/0 text-white transition-colors hover:border-black hover:bg-white hover:text-black">
            <FiSend className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
