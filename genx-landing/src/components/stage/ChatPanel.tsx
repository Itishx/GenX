import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiPlus, FiStar } from 'react-icons/fi'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  onAddToCanvas: (messageId: string) => void
  isLoading?: boolean
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onAddToCanvas,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [addedMessages, setAddedMessages] = useState<Set<string>>(new Set())
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleAddToCanvas = (messageId: string) => {
    onAddToCanvas(messageId)
    setAddedMessages(prev => new Set([...prev, messageId]))
    
    setTimeout(() => {
      setAddedMessages(prev => {
        const newSet = new Set(prev)
        newSet.delete(messageId)
        return newSet
      })
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white via-gray-50 to-gray-50 overflow-hidden">
      {/* Tab Bar / Header */}
      <div className="px-6 pt-4 pb-3 border-b border-gray-200/50 backdrop-blur-sm bg-white/80">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Intelligence</span>
        </div>
        <h2 className="text-lg font-display font-semibold text-gray-900">Chat</h2>
        <p className="text-xs text-gray-500 mt-1">Ask questions, get insights, build your canvas</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center max-w-sm">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50 flex items-center justify-center"
              >
                <FiStar className="w-8 h-8 text-orange-600" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">Start the conversation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ask questions about your idea, strategy, market research, or goals for this stage. Our AI will provide actionable insights you can add to your canvas.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-500">💡 Tip: Start with "What should I focus on..." or "Help me validate..."</p>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05, type: 'spring', bounce: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-sm">✨</span>
                </div>
              )}
              
              <div
                className={`max-w-xs lg:max-w-sm xl:max-w-md px-4 py-3 rounded-2xl transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-900 shadow-sm hover:shadow-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {message.content}
                </p>

                {message.role === 'ai' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleAddToCanvas(message.id)}
                    className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      addedMessages.has(message.id)
                        ? 'bg-green-100 text-green-700 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm'
                    }`}
                  >
                    {addedMessages.has(message.id) ? (
                      <>
                        <motion.svg 
                          className="w-4 h-4" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                        Added to Canvas
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-4 h-4" />
                        Add to Canvas
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 mr-3">
              <span className="text-sm">✨</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex gap-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-orange-600"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-orange-600"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-orange-600"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar - Premium Design */}
      <div className="border-t border-gray-200/50 bg-gradient-to-b from-gray-50 to-white px-6 py-4 backdrop-blur-sm">
        <motion.div 
          className={`flex gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
            isFocused
              ? 'border-orange-400 bg-white shadow-lg shadow-orange-500/10'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }`}
          animate={{
            boxShadow: isFocused 
              ? '0 8px 32px rgba(255, 107, 53, 0.15)' 
              : '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            placeholder="Ask anything... What should I focus on?"
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="w-4 h-4" />
          </motion.button>
        </motion.div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold">Enter</kbd> to send
        </p>
      </div>
    </div>
  )
}

export default ChatPanel
