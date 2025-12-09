import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

const Login: React.FC = () => {
  const { signInWithPassword, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = React.useState(false)

  const from = location.state?.from?.pathname || '/app'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signInWithPassword(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate(from, { replace: true })
  }

  const onGoogle = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (e: any) {
      setError(e?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left: Orange Panel */}
        <div className="relative flex items-center justify-center bg-orange-600 px-6 py-10 text-white">
          <div className="mx-auto w/full max-w-xl">
            <div className="flex items-center gap-3">
              <img src="/assets/aviatelogo.png" alt="Aviate" className="h-10 w-auto" />
              <span className="text-sm font-semibold tracking-wide uppercase">Aviate</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-8 text-4xl font-bold leading-tight md:text-5xl"
            >
              Build smarter. Launch faster. Welcome to Aviate.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="mt-4 text-base/relaxed text-orange-50 md:text-lg"
            >
              Aviate helps founders navigate their startup journey with structured frameworks, AI-powered insights, and a workspace built for execution.
            </motion.p>

            {/* Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-12 rounded-2xl bg-white/10 p-5 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20" />
                <div>
                  <div className="text-sm font-semibold">Founder Name</div>
                  <div className="text-xs text-orange-50/80">CEO, Startup Inc.</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-orange-50">
                “Aviate gave us structure and momentum. Our launch plan went from chaos to clarity in days.”
              </p>
            </motion.div>
          </div>

          {/* Decorative blobs */}
          <motion.div
            className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            animate={{ opacity: [0.2, 0.35, 0.2], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            animate={{ opacity: [0.2, 0.35, 0.2], y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        {/* Right: Form Panel */}
        <div className="flex items-center justify-center bg-white px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto w-full max-w-md"
          >
            <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>

            {/* Google Sign In */}
            <button
              onClick={onGoogle}
              disabled={googleLoading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              <img src="/assets/googlelogo.png" alt="Google" className="h-5 w-5 object-contain" style={{marginRight: '2px'}} />
              {googleLoading ? 'Connecting…' : 'Continue with Google'}
            </button>

            {/* Separator */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-rose-500/40 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-gray-900 underline underline-offset-4 hover:opacity-90">Sign up</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Login
