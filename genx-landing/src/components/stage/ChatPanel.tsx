import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiPlus, FiTrash2, FiUpload, FiSearch, FiChevronDown, FiEdit2 } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

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
  const { profile } = useAuth();
  const [inputValue, setInputValue] = useState('')
  const [addedMessages, setAddedMessages] = useState<Set<string>>(new Set())
  const [addingMessageId, setAddingMessageId] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const nextHeight = Math.min(ta.scrollHeight, 120) // max 5 lines
    ta.style.height = `${nextHeight}px`
  }, [inputValue])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      if (editingMessageId) {
        setEditingMessageId(null)
      }
      onSendMessage(inputValue)
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setInputValue(content)
    inputRef.current?.focus()
  }

  const handleAddToNote = async (messageId: string) => {
    setAddingMessageId(messageId)
    try {
      await onAddToNote(messageId)
      setAddedMessages(prev => new Set([...prev, messageId]))
      setTimeout(() => {
        setAddedMessages(prev => {
          const newSet = new Set(prev)
          newSet.delete(messageId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to add to AvioNote:', error)
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
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-2xl text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                What would you like to explore, {profile?.name || 'there'}?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Ask questions about your strategy, market research, competitive analysis, or next steps. Get structured insights you can save to AvioNote.
              </p>
            </div>
          </motion.div>
        ) : (
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
                      <div className="space-y-3">
                        <div className="flex-1 space-y-4">
                          <div className="text-gray-800 text-base leading-relaxed font-medium">
                            {message.content.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                            ))}
                          </div>
                          <div className="flex items-center justify-start text-xs text-gray-500 gap-2">
                            <motion.button
                              onClick={() => handleAddToNote(message.id)}
                              disabled={addingMessageId === message.id}
                              whileHover={{ scale: addingMessageId === message.id ? 1 : 1.05 }}
                              whileTap={{ scale: addingMessageId === message.id ? 1 : 0.95 }}
                              className="text-orange-500 hover:text-orange-600"
                            >
                              <FiPlus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm leading-relaxed font-medium max-w-sm shadow-md relative">
                          {message.content}
                          <motion.button
                            onClick={() => handleEditMessage(message.id, message.content)}
                            className="absolute bottom-1 right-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </motion.button>
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

      <div className="border-t border-gray-200 bg-white px-4 sm:px-8 lg:px-12 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            <motion.div 
              className={`flex items-center gap-3 px-4 py-4 rounded-full border transition-all duration-300 bg-white ${
                isFocused
                  ? 'border-orange-500 shadow-lg shadow-orange-500/10'
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
                className={`flex items-center justify-center w-9 h-9 rounded-full text-white transition-all flex-shrink-0 ${
                  !isLoading && inputValue.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                <FiSend className="w-4 h-4" />
              </motion.button>
            </motion.div>

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
