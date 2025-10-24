import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiCopy, FiEdit2 } from 'react-icons/fi'

export interface CanvasInsight {
  id: string
  title: string
  description: string
  type: 'pain-point' | 'persona' | 'idea' | 'market' | 'next-step' | 'insight'
  messageId: string
  addedAt: Date
}

interface CanvasPanelProps {
  insights: CanvasInsight[]
  onRemoveInsight: (id: string) => void
}

const typeConfig: Record<CanvasInsight['type'], { icon: string; label: string }> = {
  'pain-point': { icon: '📍', label: 'Pain Point' },
  'persona': { icon: '👤', label: 'Persona' },
  'idea': { icon: '��', label: 'Idea' },
  'market': { icon: '📊', label: 'Market' },
  'next-step': { icon: '→', label: 'Next Step' },
  'insight': { icon: '⭐', label: 'Insight' },
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ insights, onRemoveInsight }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [userNotes, setUserNotes] = useState('')

  const stageSummary = insights.slice(0, 2)
  const keyInsights = insights.slice(2, 5)

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col h-full bg-[#fafafa] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #ddd 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10 px-6 py-4 border-b border-[#eaeaea] bg-white/80 backdrop-blur-sm">
        <h2 className="font-semibold text-lg text-gray-900">Notes Canvas</h2>
        <p className="text-xs text-gray-500 mt-1">{insights.length} {insights.length === 1 ? 'insight' : 'insights'} added</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10 space-y-4">
        {insights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex items-center justify-center text-center"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b00]/20 to-[#ff9248]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start building your canvas</h3>
              <p className="text-sm text-gray-600 max-w-xs">
                Click "Add to Canvas" on AI responses to organize insights and build your thinking board.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {stageSummary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#eaeaea] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Stage Summary</h3>
                    <p className="text-xs text-gray-500 mt-1">Auto-generated recap</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(stageSummary.map(i => i.description).join('\n'))}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    title="Copy"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {stageSummary.map((insight) => (
                    <div key={insight.id} className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span className="text-lg flex-shrink-0">{typeConfig[insight.type].icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">{typeConfig[insight.type].label}</p>
                        <p className="text-sm text-gray-700">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#eaeaea] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">Your Notes</h3>
                  <p className="text-xs text-gray-500 mt-1">Editable workspace</p>
                </div>
                <button
                  onClick={() => setEditingId(editingId === 'notes' ? null : 'notes')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              </div>
              {editingId === 'notes' ? (
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Write your thoughts…"
                  className="w-full px-4 py-3 rounded-lg border border-[#ff6b00] bg-white text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 resize-none"
                  rows={5}
                />
              ) : (
                <div className="min-h-[100px] px-4 py-3 rounded-lg bg-gray-50 text-sm text-gray-700">
                  {userNotes || <span className="text-gray-400">No notes yet. Click edit to add your thoughts.</span>}
                </div>
              )}
            </motion.div>

            {keyInsights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#eaeaea] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Key Insights</h3>
                    <p className="text-xs text-gray-500 mt-1">Highlights</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(keyInsights.map(i => `${i.title}: ${i.description}`).join('\n\n'))}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    title="Copy"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {keyInsights.map((insight, idx) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-orange-50 hover:to-orange-50/30 border border-transparent hover:border-[#ff6b00]/20 transition-all"
                    >
                      <div className="flex gap-3 items-start">
                        <span className="text-lg flex-shrink-0">{typeConfig[insight.type].icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase">{typeConfig[insight.type].label}</p>
                          <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                          <p className="text-xs text-gray-600 mt-2">{insight.description}</p>
                        </div>
                        <motion.button
                          onClick={() => onRemoveInsight(insight.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                          title="Remove"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {insights.length > 0 && (
        <div className="relative z-10 border-t border-[#eaeaea] px-6 py-3 text-xs bg-white">
          <p style={{ color: '#FF3B00', opacity: 0.7 }}>
            💾 Insights saved. Click "Export to PDF" to download your workspace.
          </p>
        </div>
      )}
    </div>
  )
}

export default CanvasPanel
