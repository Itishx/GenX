import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import StageNavbar from './StageNavbar'
import ChatPanel, { ChatMessage } from './ChatPanel'
import StageNotesSidebar from './StageNotesSidebar'
import { useSyncInsights } from '../../hooks/useSyncInsights'
import { syncEmitter } from '../../hooks/notes/useNotes'
import { FOUNDRY_STAGES_ORDER, LAUNCH_STAGES_ORDER, ALL_STAGES } from '../../lib/stages';

interface StageWorkspaceProps {
  stageName: string
  stageDescription: string
  stageId: string
}

export interface CanvasInsight {
  id: string
  title: string
  description: string
  type: 'insight' | 'pain-point' | 'idea' | 'persona' | 'market' | 'next-step'
  messageId: string
  addedAt: Date
}

const extractInsightFromMessage = (message: string): { title: string; description: string; type: CanvasInsight['type'] } => {
  const sentences = message.split(/(?<=[.!?])\s+/)
  const title = sentences[0].substring(0, 60) + (sentences[0].length > 60 ? '...' : '')
  const description = sentences.slice(1).join(' ').substring(0, 200)

  let type: CanvasInsight['type'] = 'insight'
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes('pain') || lowerMessage.includes('problem') || lowerMessage.includes('stuck')) {
    type = 'pain-point'
  } else if (lowerMessage.includes('persona') || lowerMessage.includes('user')) {
    type = 'persona'
  } else if (lowerMessage.includes('idea') || lowerMessage.includes('feature')) {
    type = 'idea'
  } else if (lowerMessage.includes('market') || lowerMessage.includes('competitor')) {
    type = 'market'
  } else if (lowerMessage.includes('next') || lowerMessage.includes('then')) {
    type = 'next-step'
  }

  return { title, description, type }
}

const StageWorkspace: React.FC<StageWorkspaceProps> = ({
  stageName,
  stageDescription,
  stageId,
}) => {
  const { addInsight } = useSyncInsights()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previousInsights, setPreviousInsights] = useState<CanvasInsight[]>([])
  const [previousStageName, setPreviousStageName] = useState<string | null>(null)
  const [notesSidebarOpen, setNotesSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    const insightsKey = `canvas_insights_${stageId}`;
    const storedInsights = sessionStorage.getItem(insightsKey);
    
    const previousStageKey = `previous_stage_${stageId}`;
    const storedPreviousStage = sessionStorage.getItem(previousStageKey);
    
    if (storedInsights) {
      setPreviousInsights(JSON.parse(storedInsights));
      sessionStorage.removeItem(insightsKey);
    }
    
    if (storedPreviousStage) {
      setPreviousStageName(storedPreviousStage);
      sessionStorage.removeItem(previousStageKey);
    }
  }, [stageId]);

  useEffect(() => {
    const historyKey = `chat_history_${stageId}`;
    const storedHistory = sessionStorage.getItem(historyKey);
    if (storedHistory) {
      setMessages(JSON.parse(storedHistory));
    }
  }, [stageId]);

  useEffect(() => {
    if (messages.length > 0) {
      const historyKey = `chat_history_${stageId}`;
      sessionStorage.setItem(historyKey, JSON.stringify(messages));
    }
  }, [messages, stageId]);

  useEffect(() => {
    try {
      const isLaunch = location.pathname.startsWith('/launch/')
      const os = isLaunch ? 'launchos' : 'foundryos'
      const projectName = sessionStorage.getItem('currentProjectName') || 'Your Project'
      
      const lastStageData = {
        os,
        stageId,
        stageName,
        projectName,
      }
      
      localStorage.setItem('lastAccessedStage', JSON.stringify(lastStageData))
    } catch (err) {
      console.error('Error saving last accessed stage:', err)
    }
  }, [stageId, stageName, location.pathname])

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }))

      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          stage: stageName,
          stageId: stageId
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log(`🤖 AI Response received | Model: ${data.modelUsed || 'unknown'} | Tokens: ${data.usage?.total_tokens || 'N/A'}`)
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        content: data.reply.content,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'ai',
        content: "I'm having trouble connecting to the brain. Please check if the backend is running and try again.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, stageName, stageId])

  const handleClearChat = () => {
    setMessages([]);
    const historyKey = `chat_history_${stageId}`;
    sessionStorage.removeItem(historyKey);
  };

  const handleGoToNextStage = () => {
    const isFoundry = location.pathname.startsWith('/foundry/');
    const currentStages = isFoundry ? FOUNDRY_STAGES_ORDER : LAUNCH_STAGES_ORDER;
    const currentIndex = currentStages.indexOf(stageId);
    const nextStageId = currentIndex < currentStages.length - 1 ? currentStages[currentIndex + 1] : null;
    
    if (nextStageId) {
      const insightsKey = `canvas_insights_${nextStageId}`;
      sessionStorage.setItem(insightsKey, JSON.stringify(previousInsights));
      
      const previousStageKey = `previous_stage_${nextStageId}`;
      sessionStorage.setItem(previousStageKey, stageName);
      
      const nextChatHistoryKey = `chat_history_${nextStageId}`;
      sessionStorage.removeItem(nextChatHistoryKey);
      
      const nextStage = ALL_STAGES[nextStageId as keyof typeof ALL_STAGES];
      navigate(nextStage.path);
    }
  };

  const handleAddToNote = useCallback(async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) throw new Error('Message not found')

    try {
      const projectId = sessionStorage.getItem('currentProjectId') || 'default-project'
      
      // Use the new centralized sync service
      addInsight(message.content, stageId, projectId, 'chat')

      // Show success toast
      const toastEvent = new CustomEvent('showToast', {
        detail: { message: '✨ Added to AvioNote', type: 'success' },
      })
      window.dispatchEvent(toastEvent)
    } catch (error) {
      console.error('Error adding to AvioNote:', error)
      throw error
    }
  }, [messages, stageId, addInsight])

  return (
    <div className="fixed inset-0 bg-white overflow-hidden flex flex-col">
      <StageNavbar
        stageName={stageName}
        stageDescription={stageDescription}
        stageId={stageId}
        onGoToNextStage={handleGoToNextStage}
        onToggleNotesSidebar={() => setNotesSidebarOpen(!notesSidebarOpen)}
        notesOpen={notesSidebarOpen}
      />

      {/* Main Content Area with responsive layout */}
      <div className="flex-1 overflow-hidden flex pt-20">
        {/* Previous Insights Banner - Above Chat */}
        {previousInsights.length > 0 && !notesSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-20 left-0 right-0 border-b border-gray-200 bg-blue-50 px-6 py-4 z-10 overflow-y-auto max-h-48"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Previous Stage Insights</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                From {previousStageName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {previousInsights.map((insight, idx) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-2 text-xs hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 text-base">
                        {insight.type === 'pain-point' && <span>🎯</span>}
                        {insight.type === 'persona' && <span>👤</span>}
                        {insight.type === 'idea' && <span>💡</span>}
                        {insight.type === 'market' && <span>📊</span>}
                        {insight.type === 'next-step' && <span>→</span>}
                        {insight.type === 'insight' && <span>✨</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 line-clamp-1">{insight.title}</p>
                        <p className="text-gray-600 line-clamp-1">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat - Responsive width */}
        <motion.div 
          className="flex-1 overflow-hidden flex flex-col"
          animate={{
            width: notesSidebarOpen ? '50%' : '100%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddToNote={handleAddToNote}
            onClearChat={handleClearChat}
            isLoading={isLoading}
          />
        </motion.div>

        {/* AvioNote Sidebar - Fixed 50% width */}
        <StageNotesSidebar
          stageId={stageId}
          stageName={stageName}
          isOpen={notesSidebarOpen}
          onClose={() => setNotesSidebarOpen(false)}
        />
      </div>
    </div>
  )
}

export default StageWorkspace
