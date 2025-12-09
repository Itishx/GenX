import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiPlus, FiTrash2, FiChevronDown, FiEdit2, FiMic } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  imageUrl?: string // Added for image messages
}

interface ChatPanelProps {
  messages: ChatMessage[]
  onSendMessage: (content: string, model?: string) => Promise<any>
  onAddToNote: (messageId: string) => Promise<void>
  isLoading?: boolean
  onClearChat: () => void;
}

const MODEL_OPTIONS = [
  { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
  { label: 'Claude Sonnet', value: 'claude-sonnet' },
]

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
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showPlusModal, setShowPlusModal] = useState<boolean>(false); // Added state for modal visibility
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

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const ta = inputRef.current;
      if (ta) {
        ta.style.height = 'auto'; // Reset height to calculate scrollHeight accurately
        ta.style.height = `${ta.scrollHeight}px`; // Set height to match content
      }
    };

    adjustTextareaHeight(); // Adjust height on initial render

    const observer = new MutationObserver(adjustTextareaHeight);
    if (inputRef.current) {
      observer.observe(inputRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [inputValue]);

  const handleTogglePlusModal = () => {
    setShowPlusModal((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      if (editingMessageId) {
        setEditingMessageId(null);
      }
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current?.focus();
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
                {`Let's dive in ${profile?.name || 'homie'}`}
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
                message.role === 'ai' ? (
                  <div className="flex w-full justify-start mb-4" key={message.id}>
                    <div className="w-full">
                      {/* Show image if present */}
                      {message.imageUrl ? (
                        <img src={message.imageUrl} alt="Generated" className="rounded-lg max-w-xs border mb-2" />
                      ) : null}
                      <p className="text-gray-800 text-base leading-relaxed font-medium whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-start text-xs text-gray-500 gap-2 mt-2">
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
                  <div className="flex w-full justify-end mb-4" key={message.id}>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm w-auto max-w-[60%] break-words">
                      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <motion.button
                        onClick={() => handleEditMessage(message.id, message.content)}
                        className="absolute bottom-1 right-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )
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
              {/* Plus Icon */}
              <div className="relative">
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-green-600 transition-colors"
                  type="button"
                  tabIndex={-1}
                  aria-label="Add"
                  onClick={() => setShowPlusModal((v) => !v)}
                >
                  <FiPlus className="w-5 h-5" />
                </button>
                {showPlusModal && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                      type="button"
                      onClick={() => setShowPlusModal(false)}
                    >
                      Upload photos and files
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                      type="button"
                      onClick={() => setShowPlusModal(false)}
                    >
                      Create an Image
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                      type="button"
                      onClick={() => setShowPlusModal(false)}
                    >
                      Connect External Tools
                    </button>
                  </div>
                )}
              </div>
              {/* Model Switcher */}
              <div className="relative">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-xs font-medium text-gray-700 hover:border-orange-400 focus:outline-none"
                  onClick={() => setShowModelDropdown((v) => !v)}
                  type="button"
                >
                  {MODEL_OPTIONS.find((m) => m.value === selectedModel)?.label}
                  <FiChevronDown className="w-3 h-3 ml-1" />
                </button>
                {showModelDropdown && (
                  <div className="absolute left-0 bottom-full mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {MODEL_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 ${selectedModel === option.value ? 'bg-orange-100 font-semibold' : ''}`}
                        onClick={() => {
                          setSelectedModel(option.value)
                          setShowModelDropdown(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Textarea */}
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
                className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-500 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed font-medium overflow-hidden break-words"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box',
                }}
              />
              {/* Microphone Icon */}
              <button
                className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-blue-600 transition-colors"
                type="button"
                tabIndex={-1}
                aria-label="Voice input"
              >
                <FiMic className="w-5 h-5" />
              </button>
              {/* Send Button */}
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
