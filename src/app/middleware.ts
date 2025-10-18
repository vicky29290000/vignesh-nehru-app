import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleRedirects: Record<string, string> = {
  super_admin: '/superadmin/dashboard',
  architect: '/architect/projects',
  structural_team: '/structural-team',
  client: '/client',
}

const publicPaths = ['/auth/login', '/favicon.ico']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('sb-access-token')?.value

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  let userRole: string | undefined = undefined
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())

    userRole = payload['role'] || payload['https://hasura.io/jwt/claims']?.['x-hasura-role']
  } catch (err) {
    console.error('Failed to decode JWT token:', err)
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (!userRole || !roleRedirects[userRole]) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect root to role-based dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL(roleRedirects[userRole], request.url))
  }

  // Allowed prefixes per role
  const rolePaths: Record<string, string> = {
    super_admin: '/superadmin',
    architect: '/architect',
    structural_team: '/structural-team',
    client: '/client',
  }

  const allowedPrefix = rolePaths[userRole]

  // Allow /messages for all authenticated users
  if (!pathname.startsWith(allowedPrefix) && pathname !== '/messages') {
    return NextResponse.redirect(new URL(roleRedirects[userRole], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
