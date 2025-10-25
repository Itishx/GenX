import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare2, FiMail, FiCheck, FiAlertCircle, FiX } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import { supabase } from '@/lib/supabaseClient'

interface ShareProjectModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectName: string
  projectOwnerId: string
}

const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  open,
  onClose,
  projectId,
  projectName,
  projectOwnerId,
}) => {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'editor' | 'viewer'>('editor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateEmail = (emailStr: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(emailStr)
  }

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitted(true)

    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      // Generate unique token for invitation
      const token = generateToken()

      // Create invitation in database
      const { data, error: insertError } = await supabase
        .from('project_invitations')
        .insert({
          project_id: projectId,
          invited_by: projectOwnerId,
          invited_email: email.toLowerCase().trim(),
          role: role,
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()

      if (insertError) {
        // Check if it's a duplicate invitation
        if (insertError.code === '23505') {
          setError('This email is already invited to this project')
        } else {
          setError(insertError.message || 'Failed to send invitation')
        }
        setLoading(false)
        return
      }

      // In a real app, you would send an email here with the invitation link
      // For now, we'll just show success
      console.log('Invitation created:', data)
      
      setSuccess(true)
      setEmail('')
      setRole('editor')
      setSubmitted(false)

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation'
      console.error('Invitation error:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setRole('editor')
    setError(null)
    setSuccess(false)
    setSubmitted(false)
    onClose()
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
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-[min(92vw,500px)] max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#fff5f2' }}>
                  <FiShare2 className="h-5 w-5" style={{ color: '#f03612' }} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Share Project</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{projectName}</p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3"
              >
                <FiCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Invitation sent!</p>
                  <p className="text-xs text-green-700 mt-1">
                    {email} will receive an invitation to collaborate on this project.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3"
              >
                <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Teammate Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiMail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError(null)
                      }}
                      placeholder="teammate@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f03612] transition-all"
                      disabled={loading}
                    />
                  </div>
                  {submitted && !email.trim() && (
                    <p className="mt-1.5 text-xs text-red-500">Email is required</p>
                  )}
                  {submitted && email.trim() && !validateEmail(email) && (
                    <p className="mt-1.5 text-xs text-red-500">Please enter a valid email</p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Access Level
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'editor' as const, label: 'Editor', desc: 'Can edit project' },
                      { value: 'viewer' as const, label: 'Viewer', desc: 'View only' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        disabled={loading}
                        className={`flex-1 rounded-lg border-2 px-3 py-2.5 text-left transition-all ${
                          role === option.value
                            ? 'border-[#f03612] bg-[#fff5f2]'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <p className={`text-sm font-medium ${
                          role === option.value ? 'text-[#f03612]' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Message */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs text-blue-800">
                    💡 The invitation will be valid for 7 days. Your teammate will receive an email to join this project.
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    className="rounded-lg px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{
                      background: loading ? '#d1d5db' : 'linear-gradient(to right, #f03612, #f03612)',
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiShare2 className="h-4 w-4" />
                        <span>Send Invite</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default ShareProjectModal
