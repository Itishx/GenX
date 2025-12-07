import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

const Signup: React.FC = () => {
  const { signUpWithPassword, signInWithGoogle, updateProfile } = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [country, setCountry] = React.useState('')
  const [stateRegion, setStateRegion] = React.useState('')
  const [phoneCountry, setPhoneCountry] = React.useState('US')
  const [phone, setPhone] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)
    const { error } = await signUpWithPassword(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    // Save name into profile after sign up (best-effort)
    const name = [firstName, lastName].filter(Boolean).join(' ').trim()
    if (name) {
      updateProfile({ name }).catch(() => {})
    }
    setInfo('Check your email to confirm your account, then sign in.')
  }

  const onGoogle = async () => {
    setError(null)
    setInfo(null)
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
          <div className="mx-auto w-full max-w-xl">
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
            <h1 className="text-2xl font-semibold text-gray-900">Let’s get started</h1>

            {/* Google Sign Up */}
            <button
              onClick={onGoogle}
              disabled={googleLoading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              <img src="https://www.gstatic.com/images/branding/product/2x/google_gsuite_64dp.png" alt="Google" className="h-5 w-5" />
              {googleLoading ? 'Connecting…' : 'Continue with Google'}
            </button>

            {/* Separator */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">or create your account</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-rose-500/40 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
            )}
            {info && (
              <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">State</label>
                  <input
                    type="text"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="State / Region"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Phone number</label>
                <div className="flex items-center gap-2">
                  {/* Country flag dropdown placeholder */}
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Country code"
                  >
                    <option value="US">🇺🇸 +1</option>
                    <option value="IN">🇮🇳 +91</option>
                    <option value="GB">🇬🇧 +44</option>
                    <option value="CA">🇨🇦 +1</option>
                    <option value="AU">🇦🇺 +61</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Phone number"
                  />
                </div>
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

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? 'Creating…' : 'Get Started →'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 underline underline-offset-4 hover:opacity-90">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Signup
