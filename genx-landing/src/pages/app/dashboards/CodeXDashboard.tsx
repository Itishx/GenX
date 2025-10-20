import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiCode, 
  FiGithub, 
  FiBookOpen, 
  FiTerminal, 
  FiEdit3, 
  FiTrendingUp, 
  FiTarget,
  FiCalendar,
  FiActivity,
  FiUser,
  FiSettings,
  FiPlay,
  FiBarChart2,
  FiStar,
  FiGitBranch,
  FiClock
} from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export type AgentRecord = {
  slug: 'businessx' | 'marketx'
  name: string
  config: any
}

interface FormData {
  profession?: string
  purpose?: string
  devLevel?: string
  userType?: string
}

// Setup Edit Modal
const SetupEditModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSave: (data: FormData) => void
  currentData: FormData
}> = ({ isOpen, onClose, onSave, currentData }) => {
  const [formData, setFormData] = useState<FormData>(currentData)

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Edit Setup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Role</label>
            <input
              type="text"
              value={formData.profession || ''}
              onChange={e => setFormData((prev: FormData) => ({ ...prev, profession: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-zinc-400 focus:border-white/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Goal</label>
            <textarea
              value={formData.purpose || ''}
              onChange={e => setFormData((prev: FormData) => ({ ...prev, purpose: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-zinc-400 focus:border-white/40 focus:outline-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Experience Level</label>
            <select
              value={formData.devLevel || 'student'}
              onChange={e => setFormData((prev: FormData) => ({ ...prev, devLevel: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-white/40 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="junior">Junior Developer</option>
              <option value="mid">Mid-level Developer</option>
              <option value="senior">Senior Developer</option>
              <option value="lead">Tech Lead</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">User Type</label>
            <select
              value={formData.userType || 'student'}
              onChange={e => setFormData((prev: FormData) => ({ ...prev, userType: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-white/40 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="developer">Developer</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(formData)
              onClose()
            }}
            className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Dashboard Card Component
const DashboardCard: React.FC<{ 
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}> = ({ title, icon, children, className = '', action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-lg backdrop-blur-sm hover:border-white/20 transition-all duration-200 ${className}`}
  >
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
)

const CodeXDashboard: React.FC<{
  agent: AgentRecord
  onBack: () => void
  onGoToChat: () => void
}> = ({ agent, onBack, onGoToChat }) => {
  const { user, profile } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [agentConfig, setAgentConfig] = useState<FormData>(agent?.config || {})
  const [githubData, setGithubData] = useState<any>(null)
  const [weeklyStats, setWeeklyStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const devLevel = agentConfig?.devLevel ?? 'student'
  const profession = agentConfig?.profession ?? 'Developer'
  const purpose = agentConfig?.purpose ?? 'Build, learn, and ship faster.'
  const userType = agentConfig?.userType ?? 'student'

  // Mock GitHub data (replace with actual GitHub API integration)
  useEffect(() => {
    const fetchGitHubData = async () => {
      // Simulate API call
      setTimeout(() => {
        setGithubData({
          connectedRepos: 12,
          topLanguages: [
            { name: 'TypeScript', percentage: 45 },
            { name: 'JavaScript', percentage: 30 },
            { name: 'Python', percentage: 15 },
            { name: 'Go', percentage: 10 }
          ],
          weeklyCommits: 23,
          currentStreak: 7
        })
      }, 1000)
    }

    const fetchWeeklyStats = async () => {
      // Simulate Supabase query for weekly stats
      setTimeout(() => {
        setWeeklyStats({
          commitsThisWeek: 23,
          tasksCompleted: 8,
          problemsSolved: 15,
          hoursCodedWeekly: 32,
          aiInteractions: 45
        })
        setLoading(false)
      }, 1200)
    }

    fetchGitHubData()
    fetchWeeklyStats()
  }, [])

  const handleSaveSetup = async (data: FormData) => {
    try {
      // Save to Supabase agents table
      const { error } = await supabase
        .from('agents')
        .update({ config: data })
        .eq('user_id', user?.id)
        .eq('slug', 'codex')

      if (!error) {
        setAgentConfig(data)
      }
    } catch (e) {
      console.error('Failed to save setup:', e)
    }
  }

  const renderStudentRoadmap = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-emerald-200">Data Structures & Algorithms</span>
        </div>
        <span className="text-xs text-emerald-300">75% Complete</span>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className="text-sm text-blue-200">System Design</span>
        </div>
        <span className="text-xs text-blue-300">40% Complete</span>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-zinc-500/20 bg-zinc-500/10 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-zinc-500"></div>
          <span className="text-sm text-zinc-200">Database Design</span>
        </div>
        <span className="text-xs text-zinc-300">Not Started</span>
      </div>
    </div>
  )

  const renderProjectTracker = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
        <div className="flex items-center gap-2">
          <FiClock className="h-4 w-4 text-orange-400" />
          <span className="text-sm text-orange-200">API Authentication</span>
        </div>
        <span className="text-xs text-orange-300">In Progress</span>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
        <div className="flex items-center gap-2">
          <FiTarget className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-emerald-200">Database Schema</span>
        </div>
        <span className="text-xs text-emerald-300">Completed</span>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
        <div className="flex items-center gap-2">
          <FiPlay className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-purple-200">Frontend Components</span>
        </div>
        <span className="text-xs text-purple-300">Next</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <FiCode className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xl font-bold text-white">{agent.name || 'CodeX'}</div>
            <div className="text-sm text-zinc-400">Universal Developer Hub</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onBack} 
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
          >
            Back to Agents
          </button>
          <button 
            onClick={onGoToChat} 
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Go to Chat
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid gap-6">
        {/* Setup Card - Full Width */}
        <DashboardCard
          title="Developer Setup"
          icon={<FiUser className="h-4 w-4" />}
          action={
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10 transition-colors"
            >
              <FiEdit3 className="h-3 w-3" />
              Edit
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="text-xs text-zinc-400 mb-1">Role</div>
              <div className="text-sm font-medium text-white">{profession}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="text-xs text-zinc-400 mb-1">Experience</div>
              <div className="text-sm font-medium text-white capitalize">{devLevel}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="text-xs text-zinc-400 mb-1">Goal</div>
              <div className="text-sm text-white">{purpose}</div>
            </div>
          </div>
        </DashboardCard>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GitHub Sync + Repo Insights */}
          <DashboardCard
            title="GitHub Integration"
            icon={<FiGithub className="h-4 w-4" />}
            action={
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Connect GitHub
              </button>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              </div>
            ) : githubData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{githubData.connectedRepos}</div>
                    <div className="text-xs text-zinc-400">Repositories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{githubData.currentStreak}</div>
                    <div className="text-xs text-zinc-400">Day Streak</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400 mb-2">Top Languages</div>
                  <div className="space-y-2">
                    {githubData.topLanguages.slice(0, 3).map((lang: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-zinc-300">{lang.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${lang.percentage}%` }}></div>
                          </div>
                          <span className="text-xs text-zinc-400">{lang.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                <FiGithub className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">Connect your GitHub account to see insights</div>
              </div>
            )}
          </DashboardCard>

          {/* Adaptive Tracker */}
          <DashboardCard
            title={userType === 'student' ? 'Study Roadmap' : 'Project Tracker'}
            icon={userType === 'student' ? <FiBookOpen className="h-4 w-4" /> : <FiTarget className="h-4 w-4" />}
          >
            {userType === 'student' ? renderStudentRoadmap() : renderProjectTracker()}
          </DashboardCard>

          {/* AI Playground */}
          <DashboardCard
            title="AI Playground"
            icon={<FiTerminal className="h-4 w-4" />}
            action={
              <button 
                onClick={onGoToChat}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Open Chat
              </button>
            }
          >
            <div className="space-y-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <div className="text-xs text-zinc-400 mb-1">Context Aware</div>
                <div className="text-sm text-zinc-300">
                  AI responses tailored to your {devLevel} level and {userType === 'student' ? 'learning goals' : 'current projects'}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <div className="text-xs text-zinc-400 mb-1">Smart Suggestions</div>
                <div className="text-sm text-zinc-300">
                  Code reviews, debugging help, and architecture guidance
                </div>
              </div>
              <button 
                onClick={onGoToChat}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Start Coding Session
              </button>
            </div>
          </DashboardCard>

          {/* Weekly Summary */}
          <DashboardCard
            title="Weekly Summary"
            icon={<FiBarChart2 className="h-4 w-4" />}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              </div>
            ) : weeklyStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                    <div className="text-lg font-bold text-emerald-400">{weeklyStats.commitsThisWeek}</div>
                    <div className="text-xs text-zinc-400">Commits</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                    <div className="text-lg font-bold text-blue-400">{weeklyStats.tasksCompleted}</div>
                    <div className="text-xs text-zinc-400">Tasks Done</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                    <div className="text-lg font-bold text-purple-400">{weeklyStats.problemsSolved}</div>
                    <div className="text-xs text-zinc-400">Problems</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                    <div className="text-lg font-bold text-orange-400">{weeklyStats.hoursCodedWeekly}h</div>
                    <div className="text-xs text-zinc-400">Coded</div>
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FiTrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-200">This Week's Insight</span>
                  </div>
                  <div className="text-xs text-emerald-300">
                    Great consistency! You're coding 23% more than last week. 
                    Consider focusing on system design next.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                <FiActivity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No activity data available</div>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>

      {/* Setup Edit Modal */}
      <SetupEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveSetup}
        currentData={agentConfig}
      />
    </div>
  )
}

export default CodeXDashboard
