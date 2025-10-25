import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiFilter, FiDownload, FiUser, FiClock, FiTrendingUp } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Activity {
  id: string
  user_id: string
  activity_type: string
  activity_title: string
  activity_description: string
  progress_metric: string | null
  created_at: string
  user_email?: string
  user_name?: string
}

interface ActivityModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

type TimePeriod = '24h' | 'week' | 'all_time'

const getActivityIcon = (activityType: string) => {
  const icons: Record<string, React.ReactNode> = {
    stage_completed: '✅',
    stage_started: '🚀',
    content_edited: '✏️',
    note_added: '📝',
    file_uploaded: '📁',
    collaboration_invited: '👥',
    feedback_given: '💬',
    research_added: '🔍',
    custom_action: '⚡',
  }
  return icons[activityType] || '•'
}

const getActivityColor = (activityType: string) => {
  const colors: Record<string, string> = {
    stage_completed: 'bg-green-100 text-green-800',
    stage_started: 'bg-blue-100 text-blue-800',
    content_edited: 'bg-purple-100 text-purple-800',
    note_added: 'bg-yellow-100 text-yellow-800',
    file_uploaded: 'bg-orange-100 text-orange-800',
    collaboration_invited: 'bg-pink-100 text-pink-800',
    feedback_given: 'bg-indigo-100 text-indigo-800',
    research_added: 'bg-cyan-100 text-cyan-800',
    custom_action: 'bg-gray-100 text-gray-800',
  }
  return colors[activityType] || 'bg-gray-100 text-gray-800'
}

const getTimeRange = (period: TimePeriod) => {
  const now = new Date()
  let startDate: Date

  switch (period) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'all_time':
      startDate = new Date('2000-01-01')
      break
  }

  return { startDate: startDate.toISOString(), endDate: now.toISOString() }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

const TeammateActivityModal: React.FC<ActivityModalProps> = ({
  open,
  onClose,
  projectId,
  projectName,
}) => {
  const { user } = useAuth()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week')
  const [activities, setActivities] = useState<Activity[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load activities and summary
  useEffect(() => {
    if (!open || !projectId) return

    const loadActivityData = async () => {
      setLoading(true)
      setError(null)

      try {
        const { startDate, endDate } = getTimeRange(timePeriod)

        // Load activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activity_log')
          .select('*')
          .eq('project_id', projectId)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: false })

        if (activitiesError) {
          throw new Error(activitiesError.message)
        }

        // Fetch user profiles for activities
        if (activitiesData && activitiesData.length > 0) {
          const userIds = [...new Set(activitiesData.map(a => a.user_id))]
          const { data: profiles } = await supabase
            .from('auth.users')
            .select('id, email, user_metadata')
            .in('id', userIds)

          const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

          const enrichedActivities = activitiesData.map(activity => ({
            ...activity,
            user_email: profileMap.get(activity.user_id)?.email,
            user_name: profileMap.get(activity.user_id)?.user_metadata?.full_name ||
                       profileMap.get(activity.user_id)?.email?.split('@')[0] ||
                       'Unknown',
          }))

          setActivities(enrichedActivities)
        } else {
          setActivities([])
        }

        // Load summary
        const { data: summaryData, error: summaryError } = await supabase
          .from('activity_summary')
          .select('*')
          .eq('project_id', projectId)
          .eq('time_period', timePeriod)
          .single()

        if (!summaryError) {
          setSummary(summaryData)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load activities'
        console.error('Activity load error:', err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadActivityData()
  }, [open, projectId, timePeriod])

  // Generate sample summary if none exists
  const generateSummary = () => {
    if (activities.length === 0) return null

    const uniqueContributors = new Set(activities.map(a => a.user_id)).size
    const completedStages = activities.filter(a => a.activity_type === 'stage_completed').length
    const timeText = {
      '24h': 'the past 24 hours',
      'week': 'the past week',
      'all_time': 'all time',
    }[timePeriod]

    return {
      text: `In ${timeText}, ${uniqueContributors} teammate${uniqueContributors !== 1 ? 's' : ''} completed ${activities.length} action${activities.length !== 1 ? 's' : ''} across this project. Most activity: ${
        completedStages > 0 ? `Stage completions (${completedStages})` : 'Content editing and notes'
      }.`,
      totalActions: activities.length,
      uniqueContributors,
      keyMilestones: activities
        .filter(a => a.activity_type === 'stage_completed')
        .slice(0, 3)
        .map(a => a.activity_title),
    }
  }

  const displaySummary = summary || generateSummary()

  const handleGenerateReport = () => {
    // Placeholder for PDF generation
    console.log('Generate report for period:', timePeriod)
    alert('Report generation feature coming soon! This would export a structured PDF with timeline and summary.')
  }

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-[min(95vw,900px)] max-h-[85vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 px-6 py-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Teammate Activity</h2>
                  <p className="text-sm text-gray-600 mt-1">See what your team's been working on — progress, updates, and AI summaries</p>
                  <p className="text-xs text-gray-500 mt-1">{projectName}</p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Time Period Filter */}
              <div className="flex items-center gap-2">
                <FiFilter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <div className="flex gap-2">
                  {(['24h', 'week', 'all_time'] as const).map((period) => (
                    <motion.button
                      key={period}
                      onClick={() => setTimePeriod(period)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                        timePeriod === period
                          ? 'bg-[#f03612] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {period === '24h' ? 'Last 24h' : period === 'week' ? 'This Week' : 'All Time'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex gap-6">
              {/* Left: Activity Feed */}
              <div className="flex-1 overflow-y-auto px-6 py-6 border-r border-gray-200">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4"
                  >
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                        <div className="h-4 w-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                      </div>
                      <p className="text-sm text-gray-600 mt-3">Loading activities...</p>
                    </div>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">No activities yet</p>
                      <p className="text-xs text-gray-400 mt-1">Activities will appear as your team collaborates</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                      >
                        {/* Activity Card Header */}
                        <div className="flex items-start gap-3">
                          <div className="text-lg flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {activity.activity_title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-white">
                                      {activity.user_name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    <span className="font-medium">{activity.user_name}</span> • {formatTimeAgo(activity.created_at)}
                                  </span>
                                </div>
                              </div>
                              {activity.progress_metric && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium flex-shrink-0 ${
                                  getActivityColor(activity.activity_type)
                                }`}>
                                  <FiTrendingUp className="h-3 w-3" />
                                  {activity.progress_metric}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Activity Description */}
                        {activity.activity_description && (
                          <p className="mt-3 text-sm text-gray-600 ml-9 leading-relaxed">
                            {activity.activity_description}
                          </p>
                        )}

                        {/* Activity Divider */}
                        {idx < activities.length - 1 && (
                          <div className="mt-4 border-t border-gray-100" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Summary Section */}
              <div className="flex-shrink-0 w-72 overflow-y-auto px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress Summary</h3>

                {displaySummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Summary Text */}
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="text-sm text-blue-900 leading-relaxed">
                        {displaySummary.text}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiTrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="text-xs font-medium text-gray-600">Total Actions</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {displaySummary.totalActions}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiUser className="h-4 w-4 text-orange-600" />
                          <span className="text-xs font-medium text-gray-600">Contributors</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {displaySummary.uniqueContributors}
                        </p>
                      </div>
                    </div>

                    {/* Key Milestones */}
                    {displaySummary.keyMilestones && displaySummary.keyMilestones.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Milestones</h4>
                        <div className="space-y-2">
                          {displaySummary.keyMilestones.map((milestone, idx) => (
                            <div key={idx} className="rounded-lg bg-white border border-gray-200 p-3">
                              <p className="text-sm text-gray-700">{milestone}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Report Button */}
                    <motion.button
                      onClick={handleGenerateReport}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all"
                      style={{ background: 'linear-gradient(to right, #f03612, #f03612)' }}
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>Generate Full Report</span>
                    </motion.button>

                    {/* Info Box */}
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <p className="text-xs text-amber-800">
                        📊 This summary is auto-generated from team activity. Use "Generate Full Report" for detailed insights and timeline.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default TeammateActivityModal
