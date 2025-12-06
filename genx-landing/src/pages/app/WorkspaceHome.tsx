import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiBook, FiArrowRight } from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'
import ProjectSidebar, { Project } from '@/components/ProjectSidebar'
import ProgressSection from '@/components/ProgressSection'

interface LastStage {
  os: 'foundryos' | 'launchos'
  stageId: string
  stageName: string
  projectName: string
}

const foundryStages = [
  { id: 'ignite', name: 'Ignite' },
  { id: 'explore', name: 'Explore' },
  { id: 'empathize', name: 'Empathize' },
  { id: 'differentiate', name: 'Differentiate' },
  { id: 'architect', name: 'Architect' },
  { id: 'validate', name: 'Validate' },
  { id: 'construct', name: 'Construct' },
  { id: 'align', name: 'Align' },
]

const launchStages = [
  { id: 'research', name: 'Research' },
  { id: 'position', name: 'Position' },
  { id: 'strategy', name: 'Strategy' },
  { id: 'campaigns', name: 'Campaigns' },
  { id: 'messaging', name: 'Messaging' },
  { id: 'channels', name: 'Channels' },
  { id: 'execute', name: 'Execute' },
  { id: 'scale', name: 'Scale' },
]

const WorkspaceHome: React.FC = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [lastStage, setLastStage] = useState<LastStage | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('evening')
  const [projects, setProjects] = useState<Project[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  // Determine time of day for greeting
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
  }, [])

  // Load projects and last accessed stage
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        // Load projects
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, os, created_at, is_active')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2)

        if (!error && data) {
          const loadedProjects: Project[] = (data || []).map((p) => ({
            id: p.id,
            name: p.name,
            os: p.os as 'foundryos' | 'launchos',
            createdAt: new Date(p.created_at),
            isActive: p.is_active,
          }))
          setProjects(loadedProjects)
          if (loadedProjects.length > 0) {
            setActiveProjectId(loadedProjects[0].id)
          }
        }

        // Load last accessed stage from localStorage
        const stored = localStorage.getItem('lastAccessedStage')
        if (stored) {
          const parsed = JSON.parse(stored)
          setLastStage(parsed)
        }
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const getGreeting = () => {
    const greetings = {
      morning: 'Good Morning',
      afternoon: 'Good Afternoon',
      evening: 'Good Evening',
    }
    return greetings[timeOfDay]
  }

  const handleContinueStage = () => {
    if (!lastStage) return
    const path = `/${lastStage.os}/${lastStage.stageId}`
    navigate(path)
  }

  const getStageIcon = (os: 'foundryos' | 'launchos') => {
    return os === 'foundryos' ? '💡' : '🚀'
  }

  const getStageColor = (os: 'foundryos' | 'launchos') => {
    return os === 'foundryos' 
      ? 'from-orange-100 to-orange-50 border-orange-200' 
      : 'from-blue-100 to-blue-50 border-blue-200'
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleProjectSelect = (projectId: string) => {
    setActiveProjectId(projectId)
    navigate('/app/agents')
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleEditProject = () => {
    // Not needed for workspace home, but required by sidebar props
  }

  const handleDeleteProject = () => {
    // Not needed for workspace home, but required by sidebar props
  }

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar */}
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        onSignOut={handleSignOut}
        isOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          {/* Greeting Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1
              className="text-4xl md:text-5xl font-black text-gray-900 mb-2"
              style={{ fontFamily: "'Neue Haas Display', serif" }}
            >
              {getGreeting()}, {profile?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-lg text-gray-500">Welcome back to your workspace</p>
          </motion.div>

          {/* Continue Where You Left Off Section */}
          {lastStage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue where you left off</h2>
              
              <motion.button
                onClick={handleContinueStage}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full md:w-96 rounded-2xl bg-gradient-to-br ${getStageColor(lastStage.os)} border-2 p-8 shadow-md hover:shadow-xl transition-all text-left group`}
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{getStageIcon(lastStage.os)}</div>
                  <FiArrowRight className="h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    {lastStage.os === 'foundryos' ? 'FoundryOS' : 'LaunchOS'}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {lastStage.stageName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Project: <span className="font-semibold text-gray-900">{lastStage.projectName}</span>
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      lastStage.os === 'foundryos'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-16 p-8 rounded-2xl bg-gray-100 border-2 border-gray-300 text-center"
            >
              <p className="text-gray-600">
                No recent stages. Visit your agents to get started!
              </p>
            </motion.div>
          )}

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="my-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            style={{ transformOrigin: 'left' }}
          />

          {/* Progress Section */}
          <ProgressSection
            projects={projects}
            activeProjectId={activeProjectId}
            onProjectSelect={handleProjectSelect}
          />

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="my-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            style={{ transformOrigin: 'left' }}
          />

          {/* Learn Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FiBook className="h-6 w-6 text-gray-900" />
              <h2 className="text-2xl font-bold text-gray-900">Learn</h2>
            </div>

            {/* Learning Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder cards for future learning content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-lg">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                <p className="text-sm text-gray-600">Learn the fundamentals and best practices</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-lg">🎓</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Techniques</h3>
                <p className="text-sm text-gray-600">Master advanced features and workflows</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-lg">💡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Case Studies</h3>
                <p className="text-sm text-gray-600">See how others succeeded with Aviate</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-lg">🎥</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600">Follow step-by-step video guides</p>
              </motion.div>
            </div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200 text-center"
            >
              <p className="text-sm text-blue-700">
                📝 More learning content coming soon. Stay tuned!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default WorkspaceHome
