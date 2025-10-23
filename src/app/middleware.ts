import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

const roleRedirects: Record<string, string> = {
  super_admin: '/superadmin/dashboard',
  architect: '/architect/projects',
  structural_team: '/structural-team',
  client: '/client',
}

const publicPaths = ['/auth/login', '/favicon.ico']

export async function middleware(request: NextRequest) {
  // Skip the middleware for public paths
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req: request, res: response })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // Handle errors or missing session
  if (error || !session) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const userRole = session.user?.role || session.user?.user_metadata?.role || parseRoleFromJwt(session.access_token)

  // Handle invalid or missing role
  if (!userRole || !roleRedirects[userRole]) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const pathname = request.nextUrl.pathname

  // If the user is on the root, redirect them based on role
  if (pathname === '/') {
    return NextResponse.redirect(new URL(roleRedirects[userRole], request.url))
  }

  const rolePaths: Record<string, string> = {
    super_admin: '/superadmin',
    architect: '/architect',
    structural_team: '/structural-team',
    client: '/client',
  }

  const allowedPrefix = rolePaths[userRole]

  // If the user is not authorized to view the current path, redirect
  if (!pathname.startsWith(allowedPrefix) && pathname !== '/messages') {
    return NextResponse.redirect(new URL(roleRedirects[userRole], request.url))
  }

  return response
}

function parseRoleFromJwt(token: string): string | null {
  try {
    const payloadBase64 = token.split('.')[1]
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8')
    const payload = JSON.parse(payloadJson)
    return payload['role'] || payload['https://hasura.io/jwt/claims']?.['x-hasura-role'] || null
  } catch (error) {
    console.error('Error parsing JWT token:', error)
    return null
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
