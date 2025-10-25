import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiDownload } from 'react-icons/fi'

export interface CanvasInsight {
  id: string
  title: string
  description: string
  type: 'insight' | 'pain-point' | 'idea' | 'persona' | 'market' | 'next-step'
  messageId: string
  addedAt: Date
}

interface CanvasPanelProps {
  insights: CanvasInsight[]
  onRemoveInsight: (id: string) => void
}

const typeConfig: Record<CanvasInsight['type'], { color: string; bgColor: string; label: string; borderColor: string }> = {
  'insight': { color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Insight', borderColor: 'border-blue-200' },
  'pain-point': { color: 'text-red-600', bgColor: 'bg-red-50', label: 'Pain Point', borderColor: 'border-red-200' },
  'idea': { color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Idea', borderColor: 'border-purple-200' },
  'persona': { color: 'text-green-600', bgColor: 'bg-green-50', label: 'Persona', borderColor: 'border-green-200' },
  'market': { color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'Market', borderColor: 'border-amber-200' },
  'next-step': { color: 'text-indigo-600', bgColor: 'bg-indigo-50', label: 'Next Step', borderColor: 'border-indigo-200' },
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ insights, onRemoveInsight }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {insights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex items-start justify-start pt-12"
          >
            <div className="max-w-lg">
              <h3 className="font-display text-6xl text-gray-900 mb-6 leading-tight font-semibold">
                Start building your canvas
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                Click "Add to Canvas" on AI responses to organize insights and build your thinking board.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {insights.map((insight, idx) => {
                const config = typeConfig[insight.type]
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -12 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    layout
                    className="group"
                  >
                    <motion.div 
                      className={`relative p-5 rounded-2xl border transition-all duration-200 bg-white ${config.borderColor}`}
                      whileHover={{ y: -2, shadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                    >
                      <motion.button
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        onClick={() => onRemoveInsight(insight.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove insight"
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>

                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mb-3 border ${config.bgColor} ${config.borderColor} border-current border-opacity-30`}>
                        <span className={`text-xs font-bold ${config.color} uppercase tracking-wide`}>
                          {config.label}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm mb-2 pr-7 text-gray-900 leading-snug">
                        {insight.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-gray-600 mb-4">
                        {insight.description}
                      </p>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          {insight.addedAt.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 px-8 py-4 bg-white flex items-center justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#fff5f0] text-gray-700 hover:text-[#ff6b00] text-xs font-semibold transition-all hover:shadow-sm"
          >
            <FiDownload className="w-3.5 h-3.5" />
            Export
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default CanvasPanel
