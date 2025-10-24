import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import StageWorkspace from '@/components/stage/StageWorkspace'

const stages = [
  { id: 'ignite', name: 'Ignite', description: 'Turn curiosity into a clear, structured idea.' },
  { id: 'explore', name: 'Explore', description: 'Discover patterns, opportunities, and spaces that matter.' },
  { id: 'empathize', name: 'Empathize', description: 'See your users clearly before you build for them.' },
  { id: 'differentiate', name: 'Differentiate', description: 'Analyze competitors and carve your unique edge.' },
  { id: 'architect', name: 'Architect', description: "Define your product's foundation, features, and logic." },
  { id: 'validate', name: 'Validate', description: 'Gather insights, measure interest, and prove demand.' },
  { id: 'construct', name: 'Construct', description: 'Plan sprints, map systems, and structure your build.' },
  { id: 'align', name: 'Align', description: 'Sync your strategy, message, and design with LaunchOS.' },
]

const StageDetail: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>()
  
  const stage = stages.find(s => s.id === stageId?.toLowerCase())
  
  if (!stage) {
    return <Navigate to="/foundryos/get-started" replace />
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
