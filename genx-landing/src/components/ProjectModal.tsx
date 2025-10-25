import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiTrendingUp } from 'react-icons/fi'
import { createPortal } from 'react-dom'

export type OSType = 'foundryos' | 'launchos'

export interface ProjectFormData {
  name: string
  description: string
  industry: string
  goal: string
  os: OSType | null
}

interface ProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => Promise<void>
  initialData?: ProjectFormData
  isLoading?: boolean
  editingProject?: { id: string; name: string; os: OSType; createdAt: Date; isActive: boolean } | null
}

const OSOption: React.FC<{
  icon: React.ReactNode
  name: string
  osType: OSType
  description: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}> = ({ icon, name, osType, description, selected, onClick, disabled = false }) => (
  <motion.button
    type="button"
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) onClick()
    }}
    disabled={disabled}
    className={`relative flex-1 rounded-xl border-2 p-4 text-left transition-all ${
      selected
        ? 'border-[#f03612] bg-[#fff5f2]'
        : 'border-gray-200 bg-white hover:border-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    whileHover={disabled ? {} : { scale: 1.02 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-1 ${selected ? 'text-[#f03612]' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
    {selected && (
      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: '#f03612' }}>
        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )}
  </motion.button>
)

const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  editingProject,
}) => {
  const isEditing = !!editingProject
  const [formData, setFormData] = React.useState<ProjectFormData>(
    initialData || {
      name: '',
      description: '',
      industry: '',
      goal: '',
      os: null,
    }
  )
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleOSSelect = React.useCallback((osType: OSType) => {
    if (!isEditing) {
      setFormData((prevData) => ({
        ...prevData,
        os: osType,
      }))
    }
  }, [isEditing])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    setError(null)
    setSubmitted(true)

    // Validate form
    if (!formData.name.trim()) {
      setError('Project name is required')
      return
    }
    
    if (!formData.os) {
      setError('Please select an operating system')
      return
    }

    try {
      console.log('Submitting project:', formData)
      await onSubmit(formData)
      console.log('Project submitted successfully')
      
      // Reset form after successful submission
      setFormData({ name: '', description: '', industry: '', goal: '', os: null })
      setSubmitted(false)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      console.error('Project creation error:', err)
      setError(errorMessage)
    }
  }

  React.useEffect(() => {
    if (open) {
      if (isEditing && editingProject) {
        setFormData({
          name: editingProject.name,
          description: '',
          industry: '',
          goal: '',
          os: editingProject.os,
        })
      } else {
        setFormData(
          initialData || {
            name: '',
            description: '',
            industry: '',
            goal: '',
            os: null,
          }
        )
      }
      setSubmitted(false)
      setError(null)
    }
  }, [open, isEditing, editingProject, initialData])

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
            className="relative w-[min(92vw,600px)] max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isEditing ? 'Edit Project' : 'Create Your Project'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200"
              >
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                    setError(null)
                  }}
                  placeholder="e.g., Startup Idea #1"
                  className="w-full rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f03612]"
                />
                {submitted && !formData.name.trim() && (
                  <p className="mt-1 text-xs text-red-500">Project name is required</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Briefly describe your project..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f03612]"
                />
              </div>

              {/* Industry / Focus Area */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Industry / Focus Area
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., SaaS, E-commerce, Healthcare"
                  className="w-full rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f03612]"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  What's your goal?
                </label>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                  placeholder="e.g., Build an MVP, validate idea, plan go-to-market"
                  className="w-full rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f03612]"
                />
              </div>

              {/* OS Selection */}
              {!isEditing && (
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Choose an Operating System *
                  </label>
                  <div className="flex gap-3">
                    <OSOption
                      icon={<FiBriefcase className="h-6 w-6" />}
                      name="FoundryOS"
                      osType="foundryos"
                      description="Operations & strategy companion. Perfect for building and validating your idea."
                      selected={formData.os === 'foundryos'}
                      onClick={() => handleOSSelect('foundryos')}
                    />
                    <OSOption
                      icon={<FiTrendingUp className="h-6 w-6" />}
                      name="LaunchOS"
                      osType="launchos"
                      description="Marketing & growth partner. Perfect for planning your launch strategy."
                      selected={formData.os === 'launchos'}
                      onClick={() => handleOSSelect('launchos')}
                    />
                  </div>
                  {submitted && !formData.os && (
                    <p className="mt-2 text-xs text-red-500">Please select an operating system</p>
                  )}
                </div>
              )}

              {/* OS Display (when editing) */}
              {isEditing && (
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Operating System
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          {formData.os === 'foundryos' ? <FiBriefcase className="h-6 w-6" /> : <FiTrendingUp className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {formData.os === 'foundryos' ? 'FoundryOS' : 'LaunchOS'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.os === 'foundryos'
                              ? 'Operations & strategy companion'
                              : 'Marketing & growth partner'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Cannot be changed after creation</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(to right, #f03612, #f03612)`,
                    border: '1px solid #f03612',
                  }}
                >
                  {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Save Changes' : 'Continue'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Render modal in portal to escape parent flex container
  return createPortal(modalContent, document.body)
}

export default ProjectModal
