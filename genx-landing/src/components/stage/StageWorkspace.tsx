import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import StageNavbar from './StageNavbar'
import ChatPanel, { ChatMessage } from './ChatPanel'
import CanvasPanel, { CanvasInsight } from './CanvasPanel'
import { FOUNDRY_STAGES_ORDER, LAUNCH_STAGES_ORDER, ALL_STAGES } from '../../lib/stages';

interface StageWorkspaceProps {
  stageName: string
  stageDescription: string
  stageId: string
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
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [insights, setInsights] = useState<CanvasInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previousInsights, setPreviousInsights] = useState<CanvasInsight[]>([])
  const [previousStageName, setPreviousStageName] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate();

  // Load canvas insights from previous stage (passed via sessionStorage when moving to next stage)
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

  // Load canvas insights from localStorage (persistent across sessions and back navigation)
  useEffect(() => {
    const canvasKey = `canvas_${stageId}`;
    const storedCanvas = localStorage.getItem(canvasKey);
    if (storedCanvas) {
      setInsights(JSON.parse(storedCanvas));
    }
  }, [stageId]);

  // Save canvas insights to localStorage whenever they change
  useEffect(() => {
    if (insights.length > 0) {
      const canvasKey = `canvas_${stageId}`;
      localStorage.setItem(canvasKey, JSON.stringify(insights));
    }
  }, [insights, stageId]);

  // Load messages from session storage on initial render
  useEffect(() => {
    const historyKey = `chat_history_${stageId}`;
    const storedHistory = sessionStorage.getItem(historyKey);
    if (storedHistory) {
      setMessages(JSON.parse(storedHistory));
    }
  }, [stageId]);

  // Save messages to session storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      const historyKey = `chat_history_${stageId}`;
      sessionStorage.setItem(historyKey, JSON.stringify(messages));
    }
  }, [messages, stageId]);

  // Save last accessed stage to localStorage on mount
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
      // Save ONLY the canvas insights to the next stage - NOT the chat messages
      const insightsKey = `canvas_insights_${nextStageId}`;
      sessionStorage.setItem(insightsKey, JSON.stringify(insights));
      
      // Save the current stage name so we can show context
      const previousStageKey = `previous_stage_${nextStageId}`;
      sessionStorage.setItem(previousStageKey, stageName);
      
      // Clear the chat history for the next stage so it starts fresh
      const nextChatHistoryKey = `chat_history_${nextStageId}`;
      sessionStorage.removeItem(nextChatHistoryKey);
      
      const nextStage = ALL_STAGES[nextStageId as keyof typeof ALL_STAGES];
      navigate(nextStage.path);
    }
  };

  const handleAddToCanvas = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    const { title, description, type } = extractInsightFromMessage(message.content)

    const insight: CanvasInsight = {
      id: `insight-${Date.now()}`,
      title,
      description,
      type,
      messageId,
      addedAt: new Date(),
    }

    setInsights(prev => [...prev, insight])

    const event = new CustomEvent('showToast', {
      detail: { message: 'Insight added to canvas!', type: 'success' },
    })
    window.dispatchEvent(event)
  }, [messages])

  const handleRemoveInsight = useCallback((id: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== id))
  }, [])

  return (
    <div className="fixed inset-0 bg-[#fafafa] overflow-hidden">
      <StageNavbar
        stageName={stageName}
        stageDescription={stageDescription}
        stageId={stageId}
        onGoToNextStage={handleGoToNextStage}
      />

      <div className="pt-20 h-full flex overflow-hidden gap-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full md:w-1/2 border-r border-[#e8e8e8] overflow-hidden flex flex-col bg-white"
        >
          {previousInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border-b border-[#e8e8e8] bg-[#fafafa] px-6 py-4 max-h-48 overflow-y-auto flex-shrink-0"
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-1 rounded-full bg-[#ff6b00]" />
                  <span className="text-xs font-semibold text-[#ff6b00] uppercase tracking-wide">What you figured out</span>
                </div>
                <h3 className="text-sm font-semibold text-[#111111] mb-3">
                  From {previousStageName}
                </h3>
                <div className="space-y-2">
                  {previousInsights.map((insight, idx) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-[#e8e8e8] rounded-lg p-3 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {insight.type === 'pain-point' && <span className="text-lg">🎯</span>}
                          {insight.type === 'persona' && <span className="text-lg">👤</span>}
                          {insight.type === 'idea' && <span className="text-lg">💡</span>}
                          {insight.type === 'market' && <span className="text-lg">📊</span>}
                          {insight.type === 'next-step' && <span className="text-lg">→</span>}
                          {insight.type === 'insight' && <span className="text-lg">✨</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#111111]">{insight.title}</p>
                          <p className="text-xs text-[#666666] mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddToCanvas={handleAddToCanvas}
            onClearChat={handleClearChat}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:flex w-1/2 overflow-hidden flex-col bg-white border-l border-[#e8e8e8]"
        >
          <div data-canvas-export className="w-full h-full">
            <CanvasPanel
              insights={insights}
              onRemoveInsight={handleRemoveInsight}
            />
          </div>
        </motion.div>
      </div>

      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e8e8] h-48 overflow-y-auto shadow-2xl"
        >
          <CanvasPanel
            insights={insights}
            onRemoveInsight={handleRemoveInsight}
          />
        </motion.div>
      )}
    </div>
  )
}

export default StageWorkspace
