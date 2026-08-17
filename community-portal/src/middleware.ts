import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const publicPaths = ['/', '/login', '/signup', '/register', '/announcements', '/trustees', '/financial-audits']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Allow public paths
  if (isPublicPath) {
    return supabaseResponse
  }

  // Protect all other routes - require authentication
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check approval status for protected routes
  const protectedPaths = ['/dashboard', '/directory', '/admin']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('approval_status, role')
      .eq('id', user.id)
      .single()

    // If pending approval, redirect to pending page (except admin)
    if (profile?.approval_status === 'PENDING_APPROVAL' && !request.nextUrl.pathname.startsWith('/dashboard/pending')) {
      return NextResponse.redirect(new URL('/dashboard/pending', request.url))
    }

    // If rejected, show rejected page
    if (profile?.approval_status === 'REJECTED') {
      return NextResponse.redirect(new URL('/dashboard/rejected', request.url))
    }

    // Admin-only routes
    if (request.nextUrl.pathname.startsWith('/admin') && profile?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Directory requires approved status
    if (request.nextUrl.pathname.startsWith('/directory') && profile?.approval_status !== 'APPROVED') {
      return NextResponse.redirect(new URL('/dashboard/pending', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
