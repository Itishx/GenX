import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywvotknmlmcxxcnxlcwa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dm90a25tbG1jeHhjbnhsY3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjEwMTksImV4cCI6MjA3MzQzNzAxOX0.mqVmzNStM_k45bk-BfAbtAIHY7ZNzdM3MMBujYGtjWE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
