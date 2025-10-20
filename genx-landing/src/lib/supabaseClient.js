import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missingEnv = !supabaseUrl || !supabaseAnonKey
if (missingEnv) {
  console.warn('Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

// Build a safe shim so imports don't crash when env is missing
function makeShim(reason) {
  const chain = {
    // allow reading these directly after await in certain code paths
    count: 0,
    error: null,
    select() { return chain },
    eq() { return chain },
    insert() { return Promise.resolve({ data: null, error: { message: reason } }) },
    upsert() { return Promise.resolve({ data: null, error: { message: reason } }) },
    maybeSingle() { return Promise.resolve({ data: null, error: { code: 'PGRST116', message: reason } }) },
    single() { return Promise.resolve({ data: null, error: { message: reason } }) },
  }
  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null }
      },
      onAuthStateChange(_event, _cb) {
        return { data: { subscription: { unsubscribe() {} } } }
      },
      async signInWithPassword() { return { data: null, error: { message: reason } } },
      async signUp() { return { data: null, error: { message: reason } } },
      async signInWithOAuth() { console.warn(reason); return { data: null, error: { message: reason } } },
      async signOut() { return { error: null } },
    },
    from() { return chain },
    storage: {
      from() {
        return {
          async upload() { return { data: null, error: { message: reason } } },
          getPublicUrl(_path) { return { data: { publicUrl: '' } } },
        }
      },
    },
  }
}

export const supabase = /** @type {import('@supabase/supabase-js').SupabaseClient<any>} */ (
  missingEnv
    ? makeShim('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
    : createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          redirectTo: window.location.origin,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
)
