import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTag } from 'react-icons/fi'

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

const typeConfig: Record<CanvasInsight['type'], { color: string; bgColor: string; label: string; icon: string }> = {
  'insight': { color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Insight', icon: '💡' },
  'pain-point': { color: 'text-red-600', bgColor: 'bg-red-50', label: 'Pain Point', icon: '🎯' },
  'idea': { color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Idea', icon: '✨' },
  'persona': { color: 'text-green-600', bgColor: 'bg-green-50', label: 'Persona', icon: '👤' },
  'market': { color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'Market', icon: '📊' },
  'next-step': { color: 'text-indigo-600', bgColor: 'bg-indigo-50', label: 'Next Step', icon: '🎯' },
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ insights, onRemoveInsight }) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-50" style={{ backgroundColor: '#fff9f2' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-orange-200 bg-white">
        <h2 className="text-lg font-semibold" style={{ color: '#FF3B00' }}>Canvas</h2>
        <p className="text-xs mt-1" style={{ color: '#FF3B00', opacity: 0.7 }}>
          {insights.length} {insights.length === 1 ? 'insight' : 'insights'}
        </p>
      </div>

      {/* Canvas content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {insights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex items-center justify-center text-center"
          >
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#FFE5D4' }}>
                <span className="text-xl">📋</span>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#FF3B00' }}>Start building your canvas</h3>
              <p className="text-sm" style={{ color: '#FF3B00', opacity: 0.7 }}>
                Click "Add to Canvas" on AI messages to build your structured intelligence here.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {insights.map((insight, idx) => {
                const config = typeConfig[insight.type]
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    layout
                  >
                    <div className="relative p-4 rounded-lg border transition-all duration-200 group hover:shadow-md bg-white" style={{ borderColor: '#FFD9C0' }}>
                      {/* Remove button */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        onClick={() => onRemoveInsight(insight.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: '#fff', borderColor: '#FFD9C0', border: '1px solid #FFD9C0' }}
                        title="Remove insight"
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>

                      {/* Type tag */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md mb-2.5 border border-current border-opacity-20`} style={{ backgroundColor: config.bgColor }}>
                        <span className="text-xs">{config.icon}</span>
                        <span className={`text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm mb-1.5 pr-8" style={{ color: '#111111' }}>
                        {insight.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs leading-relaxed" style={{ color: '#666666' }}>
                        {insight.description}
                      </p>

                      {/* Timestamp */}
                      <p className="text-xs mt-2.5" style={{ color: '#FF3B00', opacity: 0.5 }}>
                        {insight.addedAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer info */}
      {insights.length > 0 && (
        <div className="border-t px-6 py-3 text-xs bg-white" style={{ borderColor: '#FFD9C0', color: '#FF3B00', opacity: 0.7 }}>
          Your insights are automatically organized and can be exported to PDF.
        </div>
      )}
    </div>
  )
}

export default CanvasPanel
