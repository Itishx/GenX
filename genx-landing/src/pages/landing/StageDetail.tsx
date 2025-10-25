import React from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import StageWorkspace from '@/components/stage/StageWorkspace'

const foundryStages = [
  { id: 'ignite', name: 'Ignite', description: 'Turn curiosity into a clear, structured idea.' },
  { id: 'explore', name: 'Explore', description: 'Discover patterns, opportunities, and spaces that matter.' },
  { id: 'empathize', name: 'Empathize', description: 'See your users clearly before you build for them.' },
  { id: 'differentiate', name: 'Differentiate', description: 'Analyze competitors and carve your unique edge.' },
  { id: 'architect', name: 'Architect', description: "Define your product's foundation, features, and logic." },
  { id: 'validate', name: 'Validate', description: 'Gather insights, measure interest, and prove demand.' },
  { id: 'construct', name: 'Construct', description: 'Plan sprints, map systems, and structure your build.' },
  { id: 'align', name: 'Align', description: 'Sync your strategy, message, and design with LaunchOS.' },
]

const launchStages = [
  { id: 'research', name: 'Research', description: 'Understand your audience, market, and competitive landscape.' },
  { id: 'position', name: 'Position', description: 'Define your unique value proposition and brand positioning.' },
  { id: 'strategy', name: 'Strategy', description: 'Craft your go-to-market strategy and launch roadmap.' },
  { id: 'campaigns', name: 'Campaigns', description: 'Plan multi-channel campaigns and content initiatives.' },
  { id: 'messaging', name: 'Messaging', description: 'Develop compelling copy and brand messaging frameworks.' },
  { id: 'channels', name: 'Channels', description: 'Optimize distribution channels and audience touchpoints.' },
  { id: 'execute', name: 'Execute', description: 'Launch campaigns and measure performance in real-time.' },
  { id: 'scale', name: 'Scale', description: 'Iterate, optimize, and scale what works across channels.' },
]

const StageDetail: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>()
  const location = useLocation()
  
  // Determine which OS based on the route path
  const isLaunch = location.pathname.startsWith('/launch/')
  const stagesList = isLaunch ? launchStages : foundryStages
  
  const stage = stagesList.find(s => s.id === stageId?.toLowerCase())
  
  if (!stage) {
    // Redirect to appropriate get-started page based on OS
    const redirectPath = isLaunch ? '/app/agents' : '/app/agents'
    return <Navigate to={redirectPath} replace />
  }

  return (
    <StageWorkspace
      stageName={stage.name}
      stageDescription={stage.description}
      stageId={stage.id}
    />
  )
}

export default StageDetail
