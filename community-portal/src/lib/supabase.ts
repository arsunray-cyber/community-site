import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side client (with RLS)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (service role - bypasses RLS, use carefully)
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Types
export type Profile = {
  id: string
  full_name: string
  father_name: string
  mother_name: string
  occupation: string
  children_count: number
  current_address: string
  native_place: string
  email: string
  phone: string
  approval_status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
  role: 'MEMBER' | 'ADMIN'
  created_at: string
  updated_at: string
}

export type Announcement = {
  id: string
  title: string
  content: string
  published_date: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export type FinancialAudit = {
  id: string
  title: string
  description: string | null
  pdf_url: string | null
  fiscal_year: number | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Trustee = {
  id: string
  name: string
  role: string
  email: string
  phone: string | null
  photo_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

// Helper functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function getCurrentUserRole(userId: string): Promise<'MEMBER' | 'ADMIN' | null> {
  const profile = await getProfile(userId)
  return profile?.role ?? null
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const role = await getCurrentUserRole(userId)
  return role === 'ADMIN'
}

export async function getUserApprovalStatus(userId: string): Promise<string | null> {
  const profile = await getProfile(userId)
  return profile?.approval_status ?? null
}
