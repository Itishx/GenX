import React from 'react'

type State = { hasError: boolean; error?: Error | null }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'Something went wrong.'
      return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <div className="max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-zinc-300">The app encountered an unexpected error.</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90">Reload</button>
            {import.meta.env.DEV && (
              <pre className="mt-4 overflow-auto rounded-md border border-white/10 bg-black/50 p-3 text-left text-xs text-zinc-300">
                {msg}
              </pre>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
