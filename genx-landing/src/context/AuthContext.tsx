import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  name: string | null
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
  updateProfile: (updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>) => Promise<{ error?: string }>
  uploadAvatar: (file: File) => Promise<{ publicUrl?: string; error?: string }>
  hasAgents: boolean
  refreshAgentsStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAgents, setHasAgents] = useState(false)

  const fetchProfile = async (u: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', u.id)
      .maybeSingle()
    if (error && error.code !== 'PGRST116') {
      console.error('Fetch profile error', error)
      return
    }
    if (!data) {
      // Create a minimal profile row if it doesn't exist yet
      const insert = await supabase
        .from('profiles')
        .insert({ id: u.id, name: (u.user_metadata as any)?.full_name ?? null, avatar_url: (u.user_metadata as any)?.avatar_url ?? null })
      if (insert.error) console.warn('Profile insert warning', insert.error)
      setProfile({ id: u.id, name: (u.user_metadata as any)?.full_name ?? null, avatar_url: (u.user_metadata as any)?.avatar_url ?? null })
      return
    }
    setProfile(data as Profile)
  }

  const refreshAgentsStatus = async () => {
    if (!user) {
      setHasAgents(false)
      return
    }
    try {
      const { count, error } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      if (error) {
        console.warn('refreshAgentsStatus error (ignored):', error)
        setHasAgents(false)
        return
      }
      setHasAgents((count ?? 0) > 0)
    } catch (e) {
      console.warn('refreshAgentsStatus exception (ignored):', e)
      setHasAgents(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        const sess = data.session
        setUser(sess?.user ?? null)
        if (sess?.user) {
          fetchProfile(sess.user).catch((e) => console.error('Profile fetch error (init)', e))
          refreshAgentsStatus().catch((e) => console.error('Agents status error (init)', e))
        } else {
          setProfile(null)
          setHasAgents(false)
        }
      } catch (e) {
        console.error('getSession error', e)
        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user).catch((e) => console.error('Profile fetch error (onAuthStateChange)', e))
        refreshAgentsStatus().catch((e) => console.error('Agents status error (auth change)', e))
      } else {
        setProfile(null)
        setHasAgents(false)
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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app`,
        skipBrowserRedirect: true,
      },
    })
    if (error) throw new Error(error.message)
    if (data?.url) {
      window.location.href = data.url
      return
    }
    throw new Error('Unable to start Google sign-in. Please try again later.')
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setUser(null)
      setProfile(null)
      setHasAgents(false)
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
      .upsert({ id: user.id, ...updates }, { onConflict: 'id' })
      .select('id, name, avatar_url')
      .single()
    if (error) return { error: error.message }
    setProfile(data as Profile)
    return {}
  }

  // Helper: downscale large images to ~1024px max dimension and JPEG to reduce size
  async function downscaleImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 1024
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas unsupported'))
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'))
            const f = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
            resolve(f)
          },
          'image/jpeg',
          0.88
        )
      }
      img.onerror = () => reject(new Error('Image decode failed'))
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadAvatar: AuthContextType['uploadAvatar'] = async (file) => {
    if (!user) return { error: 'Not authenticated' }

    const ext0 = (file.name.split('.').pop() || '').toLowerCase()
    if (ext0 === 'heic' || ext0 === 'heif' || file.type === 'image/heic' || file.type === 'image/heif') {
      try {
        const converted = await downscaleImage(file)
        file = converted
      } catch {
        return { error: 'HEIC images are not supported in this browser. Please upload a JPG/PNG/WEBP image.' }
      }
    }

    if (file.size > 2_000_000 && file.type.startsWith('image/')) {
      try {
        file = await downscaleImage(file)
      } catch (e) {
        console.warn('Downscale failed, proceeding with original file', e)
      }
    }

    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const path = `${user.id}/avatar.${ext}`
    const mimeFromExt = (e: string) => (
      e === 'jpg' || e === 'jpeg' ? 'image/jpeg'
      : e === 'png' ? 'image/png'
      : e === 'gif' ? 'image/gif'
      : e === 'webp' ? 'image/webp'
      : 'application/octet-stream'
    )
    const contentType = file.type || mimeFromExt(ext)
    const { error: upErr } = await supabase.storage
      .from('profile_pic')
      .upload(path, file, { upsert: true, contentType })
    if (upErr) {
      console.error('Supabase Storage upload error (profile_pic):', upErr)
      return { error: upErr.message }
    }
    const { data } = supabase.storage.from('profile_pic').getPublicUrl(path)
    const publicUrl = data.publicUrl
    const res = await updateProfile({ avatar_url: publicUrl })
    if (res.error) {
      console.error('Update profile with avatar_url failed:', res.error)
      return { error: res.error }
    }
    return { publicUrl }
  }

  const value = useMemo(
    () => ({ user, profile, loading, signInWithPassword, signUpWithPassword, signInWithGoogle, signOut, refreshProfile, updateProfile, uploadAvatar, hasAgents, refreshAgentsStatus }),
    [user, profile, loading, hasAgents]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
