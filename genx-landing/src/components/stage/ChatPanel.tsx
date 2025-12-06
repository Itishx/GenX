import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiPlus, FiTrash2, FiUpload, FiSearch, FiChevronDown } from 'react-icons/fi'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  onAddToNote: (messageId: string) => Promise<void>
  isLoading?: boolean
  onClearChat: () => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex gap-1.5">
    <motion.div 
      className="w-2 h-2 rounded-full bg-gray-400"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div 
      className="w-2 h-2 rounded-full bg-gray-400"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div 
      className="w-2 h-2 rounded-full bg-gray-400"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
    />
  </div>
)

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onAddToNote,
  isLoading = false,
  onClearChat,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [addedMessages, setAddedMessages] = useState<Set<string>>(new Set())
  const [addingMessageId, setAddingMessageId] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedModel, setSelectedModel] = useState('GPT-4o')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Auto-expand textarea
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const nextHeight = Math.min(ta.scrollHeight, 120) // max 5 lines
    ta.style.height = `${nextHeight}px`
  }, [inputValue])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleAddToNote = async (messageId: string) => {
    setAddingMessageId(messageId)
    try {
      await onAddToNote(messageId)
      setAddedMessages(prev => new Set([...prev, messageId]))
      
      // Show success state for 2 seconds then reset
      setTimeout(() => {
        setAddedMessages(prev => {
          const newSet = new Set(prev)
          newSet.delete(messageId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to add to AvioNote:', error)
      // Show error toast
      const event = new CustomEvent('showToast', {
        detail: { message: 'Failed to add to AvioNote. Please try again.', type: 'error' },
      })
      window.dispatchEvent(event)
    } finally {
      setAddingMessageId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Messages Container - Full Width */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-2xl text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 mb-4">
                  <span className="text-3xl">💡</span>
                </div>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                What would you like to explore?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Ask questions about your strategy, market research, competitive analysis, or next steps. Get structured insights you can save to AvioNote.
              </p>
            </div>
          </motion.div>
        ) : (
          // Messages
          <div className="flex-1 px-4 sm:px-8 lg:px-12 py-8 space-y-6 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
                    {message.role === 'ai' ? (
                      // AI Message
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm font-semibold">AI</span>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="bg-gray-100 rounded-lg p-4 text-gray-900 text-sm leading-relaxed font-medium">
                              {message.content}
                            </div>
                            {/* Add to AvioNote Button */}
                            <motion.button
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 }}
                              onClick={() => handleAddToNote(message.id)}
                              disabled={addingMessageId === message.id}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                addedMessages.has(message.id)
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
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
                                  <span>Added to AvioNote</span>
                                </>
                              ) : addingMessageId === message.id ? (
                                <>
                                  <motion.div 
                                    className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  />
                                  <span>Adding...</span>
                                </>
                              ) : (
                                <>
                                  <FiPlus className="w-4 h-4" />
                                  <span>Add to AvioNote</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // User Message
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-3 text-sm leading-relaxed font-medium max-w-sm">
                          {message.content}
                        </div>
                      </div>
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
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">AI</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <TypingIndicator />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Bottom Input Bar - ChatGPT Style */}
      <div className="border-t border-gray-200 bg-white px-4 sm:px-8 lg:px-12 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Model & Controls Row */}
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <FiUpload className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
              
              {/* Model Selector */}
              <div className="relative group">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>{selectedModel}</span>
                  <FiChevronDown className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Input Bar */}
          <div className="space-y-3">
            <motion.div 
              className={`flex items-end gap-3 px-4 py-4 rounded-lg border transition-all duration-300 bg-white ${
                isFocused
                  ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                placeholder="Message..."
                rows={1}
                className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-500 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                whileHover={{ scale: !isLoading && inputValue.trim() ? 1.05 : 1 }}
                whileTap={{ scale: !isLoading && inputValue.trim() ? 0.95 : 1 }}
                className={`flex items-center justify-center w-9 h-9 rounded-lg text-white transition-all flex-shrink-0 ${
                  !isLoading && inputValue.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                <FiSend className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Footer Text & Clear Button */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <p>Powered by AI • Insights automatically extracted</p>
              {messages.length > 0 && (
                <motion.button 
                  onClick={onClearChat}
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
