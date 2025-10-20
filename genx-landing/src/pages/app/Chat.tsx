import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMic } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import { useSearchParams } from 'react-router-dom'

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string; ts: number }

const formatTime = (ts: number) => {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-white/90 shadow-sm">
    <motion.span className="h-1.5 w-1.5 rounded-full bg-white/70" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }} />
    <motion.span className="h-1.5 w-1.5 rounded-full bg-white/70" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.15 }} />
    <motion.span className="h-1.5 w-1.5 rounded-full bg-white/70" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.3 }} />
  </div>
)

const ChatPage: React.FC = () => {
  const { profile, user } = useAuth()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [params] = useSearchParams()

  const endRef = React.useRef<HTMLDivElement | null>(null)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  const username = profile?.name || user?.email || 'there'

  const slug = (params.get('agent') || '').toLowerCase()
  // const agentLabel = slug === 'codex' ? 'CodeX'
  const agentLabel = slug === 'businessx' ? 'BusinessX'
    : slug === 'marketx' ? 'MarketX'
    // : slug === 'dietx' ? 'DietX'
    : 'AgentX'

  // Auto-expand textarea up to 4 lines
  React.useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    const lineHeight = 20 // px
    const maxLines = 4
    const maxHeight = lineHeight * maxLines
    ta.style.height = 'auto'
    const next = Math.min(ta.scrollHeight, maxHeight)
    ta.style.height = `${next}px`
    ta.style.overflowY = ta.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [input])

  // Smooth scroll to bottom on changes
  React.useEffect(() => {
    if (!endRef.current || !scrollRef.current) return
    endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isTyping])

  const send = () => {
    const text = input.trim()
    if (!text || isTyping) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Simulate assistant
    setIsTyping(true)
    setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Thanks! Let me help with that.',
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, reply])
      setIsTyping(false)
    }, 800)
  }

  const EmptyState: React.FC = () => (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="mx-auto w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="text-center">
          <h2 className="text-2xl font-semibold text-white">{`Chat with ${agentLabel}, ${username}`}</h2>
          <p className="mt-2 text-sm text-zinc-400">Ask anything and I’ll jump in.</p>
        </motion.div>

        {/* Centered chatbar */}
        <div className="mx-auto mt-6 max-w-2xl">
          <Chatbar
            input={input}
            setInput={setInput}
            onSend={send}
            textareaRef={textareaRef}
            centered
            placeholderLabel={agentLabel}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-h-full flex-col bg-black text-white">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-6">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-5 flex w-full flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-zinc-200 text-black'
                          : 'border border-white/10 bg-white/[0.06] text-white shadow-black/20'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className={`mt-1 text-[11px] text-zinc-400`}>{formatTime(m.ts)}</div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-5 flex w-full flex-col items-start">
                    <TypingIndicator />
                    <div className="mt-1 text-[11px] text-zinc-400">{formatTime(Date.now())}</div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
              <div className="h-24" />
            </div>
          </div>

          {/* Bottom chatbar */}
          <div className="sticky bottom-0 z-10 border-t border-white/10 bg-black/60 backdrop-blur">
            <div className="mx-auto max-w-2xl px-4 py-3">
              <Chatbar input={input} setInput={setInput} onSend={send} textareaRef={textareaRef} placeholderLabel={agentLabel} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const Chatbar: React.FC<{
  input: string
  setInput: (v: string) => void
  onSend: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  centered?: boolean
  placeholderLabel?: string
}> = ({ input, setInput, onSend, textareaRef, centered, placeholderLabel }) => {
  return (
    <div>
      <div className={`flex items-end gap-2 rounded-2xl border px-3 py-2 shadow-sm ${
        centered ? 'border-white/15 bg-white/[0.03] text-white' : 'border-white/15 bg-white/[0.03] text-white'
      }`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          rows={1}
          placeholder={`Message ${placeholderLabel || 'AgentX'}…`}
          className="min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
        />
        <div className="flex items-center gap-1 pb-1">
          <button
            type="button"
            aria-label="Voice input"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-200 hover:bg-white/10"
          >
            <FiMic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSend}
            aria-label="Send"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-colors hover:opacity-90"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </div>
      </div>
      {!centered && (
        <p className="mt-2 px-1 text-center text-[11px] text-zinc-500">{`You are signed in as ${userLabel()}`}</p>
      )}
    </div>
  )
}

// Helper for footer hint
const userLabel = () => {
  try {
    const u = (window as any).currentUserEmail as string | undefined
    return u || 'guest'
  } catch {
    return 'guest'
  }
}

export default ChatPage
