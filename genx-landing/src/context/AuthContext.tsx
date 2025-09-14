import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>
  signUpWithPassword: (email: string, password: string) => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) => Promise<{ error?: string }>
  uploadAvatar: (file: File) => Promise<{ publicUrl?: string; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (u: User) => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, avatar_url').eq('id', u.id).maybeSingle()
    if (error && error.code !== 'PGRST116') {
      console.error('Fetch profile error', error)
      return
    }
    // If no row, create a default one
    if (!data) {
      const insert = await supabase.from('profiles').insert({ id: u.id, full_name: u.user_metadata?.full_name ?? null, avatar_url: u.user_metadata?.avatar_url ?? null })
      if (insert.error) console.warn('Profile insert warning', insert.error)
      setProfile({ id: u.id, full_name: u.user_metadata?.full_name ?? null, avatar_url: u.user_metadata?.avatar_url ?? null })
      return
    }
    setProfile(data as Profile)
  }

  useEffect(() => {
    let mounted = true
    const init = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      const sess = data.session
      if (!mounted) return
      setUser(sess?.user ?? null)
      if (sess?.user) await fetchProfile(sess.user)
      setLoading(false)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword: AuthContextType['signInWithPassword'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  }

  const signUpWithPassword: AuthContextType['signUpWithPassword'] = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    return {}
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/app` } })
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      // Immediately clear local state so Navbar/Homepage reflect logged-out UI
      setUser(null)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    await fetchProfile(user)
  }

  const updateProfile: AuthContextType['updateProfile'] = async (updates) => {
    if (!user) return { error: 'Not authenticated' }
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates })
      .select('id, full_name, avatar_url')
      .single()
    if (error) return { error: error.message }
    setProfile(data as Profile)
    return {}
  }

  const uploadAvatar: AuthContextType['uploadAvatar'] = async (file) => {
    if (!user) return { error: 'Not authenticated' }
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`
    // Use the 'profile_pic' bucket as requested
    const { error: upErr } = await supabase.storage.from('profile_pic').upload(path, file, { upsert: false, contentType: file.type })
    if (upErr) return { error: upErr.message }
    const { data } = supabase.storage.from('profile_pic').getPublicUrl(path)
    const publicUrl = data.publicUrl
    // Save to profile
    const res = await updateProfile({ avatar_url: publicUrl })
    if (res.error) return { error: res.error }
    return { publicUrl }
  }

  const value = useMemo(
    () => ({ user, profile, loading, signInWithPassword, signUpWithPassword, signInWithGoogle, signOut, refreshProfile, updateProfile, uploadAvatar }),
    [user, profile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
