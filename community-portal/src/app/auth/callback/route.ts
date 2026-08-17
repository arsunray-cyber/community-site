import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check user approval status
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('approval_status')
          .eq('id', user.id)
          .single()

        // Redirect based on approval status
        if (profile?.approval_status === 'PENDING_APPROVAL') {
          return NextResponse.redirect(`${origin}/dashboard/pending`)
        } else if (profile?.approval_status === 'REJECTED') {
          return NextResponse.redirect(`${origin}/dashboard/rejected`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
