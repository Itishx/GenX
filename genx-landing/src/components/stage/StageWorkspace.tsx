import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import StageNavbar from './StageNavbar'
import ChatPanel, { ChatMessage } from './ChatPanel'
import CanvasPanel, { CanvasInsight } from './CanvasPanel'

interface StageWorkspaceProps {
  stageName: string
  stageDescription: string
  stageId: string
}

// Extract title and description from AI response
const extractInsightFromMessage = (message: string): { title: string; description: string; type: CanvasInsight['type'] } => {
  // Simple heuristic: first sentence is title, rest is description
  const sentences = message.split(/(?<=[.!?])\s+/)
  const title = sentences[0].substring(0, 60) + (sentences[0].length > 60 ? '...' : '')
  const description = sentences.slice(1).join(' ').substring(0, 200)

  // Determine type based on content
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
  const location = useLocation()

  // Save last accessed stage to localStorage on mount
  useEffect(() => {
    try {
      const isLaunch = location.pathname.startsWith('/launch/')
      const os = isLaunch ? 'launchos' : 'foundryos'
      
      // Get project name from query params or session storage
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

  // Simple mock AI responses - in production, call your actual AI API
  const generateAIResponse = (userMessage: string): string => {
    const responses: Record<string, string[]> = {
      ignite: [
        `Great question! For the Ignite stage, focus on clarifying your core vision. The key is identifying: What problem are you solving? Who has this problem? Why does it matter now? Document your answers clearly—these become your foundation.`,
        `A strong core vision should be specific but flexible. Instead of "We're building an app," try "We're helping [specific users] solve [specific problem] by [unique approach]." This clarity will guide all future decisions.`,
        `Consider these frameworks: Jobs to be Done (what job do users hire your product for?), or the Problem-Solution fit canvas. Both help you articulate your idea beyond the initial spark.`,
      ],
      explore: [
        `For Explore, you're mapping the landscape. Research competitor approaches, market gaps, user behavior patterns, and emerging trends. Document at least 3-5 competitors and identify what they do well and where they fall short.`,
        `Look for "white space"—areas where no one is serving the market well. Interview potential users (10-15 conversations give you solid patterns). Document their workflows, frustrations, and workarounds.`,
        `Create a simple competitive matrix showing how existing solutions compare on key dimensions. This visual helps you see where you can differentiate.`,
      ],
      empathize: [
        `User empathy is about going deep. Conduct user interviews, observe them in their environment, and truly understand their pain points. Look for patterns across interviews—these become personas.`,
        `Build 2-3 detailed personas: Name, background, goals, pain points, how they currently solve the problem. Make them real. This keeps you user-focused throughout development.`,
        `Document the user journey: What triggers them to seek a solution? What's their process now? Where do they get stuck? Where do they succeed? This journey map is gold for product design.`,
      ],
      differentiate: [
        `Differentiation isn't about doing everything—it's about being better at something that matters. Analyze what competitors do, then identify your defensible advantage. This could be: speed, cost, UX, audience focus, or novel approach.`,
        `Create a value proposition: "Unlike [competitor], we [unique approach] because [reason it matters]." This one sentence should be crystal clear to your team and future customers.`,
        `Consider switching costs. What makes it hard for users to leave once they adopt your solution? Strong differentiation often involves network effects, data network, or switching costs.`,
      ],
      architect: [
        `Architecture is about structure. Define your core features, user workflows, and technical foundation. Avoid feature bloat—focus on the minimum set that delivers core value.`,
        `Create a feature priority matrix: Impact (how much does it solve the user's problem?) vs. Effort (how hard is it to build?). Start with high-impact, low-effort items.`,
        `Document your tech stack decisions: What frameworks? Database? Infrastructure? These decisions compound, so make them intentionally based on your specific needs, not trends.`,
      ],
      validate: [
        `Validation means proving real demand exists. Run experiments: landing page tests, pre-orders, prototype testing, or pilot programs. Each experiment should answer a specific question about market demand.`,
        `Start with the cheapest way to test. Before building, can you validate with landing pages, surveys, or customer interviews? This saves months of development.`,
        `Track key metrics: How many sign up? How many convert? What's the feedback? Use these signals to iterate or pivot before full development.`,
      ],
      construct: [
        `Construction planning bridges strategy to execution. Break your MVP into development sprints (2-week cycles). Define dependencies, risks, and resource needs upfront.`,
        `Create a simple roadmap: What ships in sprint 1? Sprint 2? What's the MVP vs. nice-to-have? This clarity prevents endless feature creep and keeps the team aligned.`,
        `Define your "Definition of Done": What makes a feature complete? Tests? Documentation? Review? Clear standards prevent rework and maintain quality.`,
      ],
      align: [
        `Alignment means your strategy, messaging, and design all tell the same story. Does your landing page reflect your value prop? Does your product design match your brand? Do your team and investors understand the same vision?`,
        `Create clear messaging pillars: 2-3 core messages that appear everywhere. These anchor your positioning and make marketing consistent.`,
        `Before launch, ensure design, messaging, and positioning are synchronized. Inconsistency confuses users and dilutes your market impact.`,
      ],
    }

    const stageResponses = responses[stageId.toLowerCase()] || responses.ignite
    return stageResponses[Math.floor(Math.random() * stageResponses.length)]
  }

  const handleSendMessage = useCallback((content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content)
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 800)
  }, [stageName])

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

    // Show toast notification (in production, use a toast library)
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
      {/* Stage Navbar */}
      <StageNavbar
        stageName={stageName}
        stageDescription={stageDescription}
      />

      {/* Main split-screen layout */}
      <div className="pt-20 h-full flex overflow-hidden gap-0">
        {/* Left Panel: Chat */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full md:w-1/2 border-r border-[#e8e8e8] overflow-hidden flex flex-col bg-white"
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddToCanvas={handleAddToCanvas}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Right Panel: Canvas */}
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

      {/* Mobile canvas (hidden on desktop, shown below chat on mobile) */}
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
