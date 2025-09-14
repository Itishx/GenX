import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const Signup: React.FC = () => {
  const { signUpWithPassword, signInWithGoogle } = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)

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
    setInfo('Check your email to confirm your account, then sign in.')
  }

  const onGoogle = async () => {
    await signInWithGoogle()
  }

  return (
    <section className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
        >
          <h1 className="text-center text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-center text-sm text-zinc-300">Start building with your agents.</p>

          {error && (
            <div className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div>
          )}
          {info && (
            <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{info}</div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="••••••••"
              />
            </div>
            <Button disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:opacity-90">
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Button onClick={onGoogle} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white underline underline-offset-4 hover:opacity-90">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Signup
