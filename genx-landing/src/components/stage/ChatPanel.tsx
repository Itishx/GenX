import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiPlus, FiTrash2 } from 'react-icons/fi'

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
  onClearChat: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onAddToCanvas,
  isLoading = false,
  onClearChat,
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
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-12 md:px-12 py-8 space-y-6">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex items-start justify-start pt-12"
          >
            <div className="max-w-md">
              <h3 className="text-[2.75rem] leading-[1.1] font-semibold text-[#0f0f0f] tracking-tight mb-4 mt-0">
                Start your conversation
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Ask thoughtful questions about your strategy, market research, or next steps. Get structured insights to add to your canvas.
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              {message.role === 'ai' ? (
                // AI Response
                <div className="mb-6">
                  <div className="bg-[#fdfdfd] border border-[#f0f0f0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                    <p className="text-sm text-gray-800 leading-7 whitespace-pre-wrap font-medium">
                      {message.content}
                    </p>

                    {/* Add to Canvas Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => handleAddToCanvas(message.id)}
                      className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        addedMessages.has(message.id)
                          ? 'bg-green-100 text-green-700 shadow-sm'
                          : 'bg-white border border-[#e8e8e8] text-gray-700 hover:border-[#ff6b00] hover:bg-[#fff5f0] hover:text-[#ff6b00] hover:shadow-sm'
                      }`}
                    >
                      {addedMessages.has(message.id) ? (
                        <>
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <FiPlus className="w-4 h-4" />
                          <span>Add to Canvas</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                // User Message
                <div className="flex justify-end mb-6">
                  <div className="relative bg-[#f6f6f6] border border-[#ececec] rounded-2xl p-4 shadow-sm max-w-xs lg:max-w-sm flex items-end gap-3">
                    <p className="text-sm text-[#1a1a1a] leading-7 whitespace-pre-wrap font-medium pr-12 flex-1">
                      {message.content}
                    </p>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#ff9248] flex items-center justify-center flex-shrink-0 shadow-sm"
                    >
                      <span className="text-sm font-semibold text-white">👤</span>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-[#fdfdfd] border border-[#f0f0f0] rounded-2xl p-5 shadow-sm">
              <div className="flex gap-1.5">
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                />
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-[#ff6b00]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-[#e8e8e8] bg-white px-12 md:px-12 py-8">
        <motion.div 
          className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-300 ${
            isFocused
              ? 'border-[#ff6b00] bg-white shadow-lg'
              : 'border-[#e8e8e8] bg-white hover:border-[#d8d8d8] hover:shadow-md'
          }`}
          style={{
            boxShadow: isFocused 
              ? '0 8px 32px rgba(255, 107, 0, 0.15)' 
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
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff6b00] to-[#ff9248] text-white transition-all hover:shadow-lg hover:shadow-[rgba(255,107,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <FiSend className="w-4.5 h-4.5" />
          </motion.button>
        </motion.div>
        {messages.length > 0 && (
            <div className="text-center mt-4">
                <button 
                    onClick={onClearChat}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <FiTrash2 className="w-3 h-3" />
                    Clear Chat
                </button>
            </div>
        )}
      </div>
    </div>
  )
}

export default ChatPanel
