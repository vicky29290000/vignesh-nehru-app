import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleRedirects: Record<string, string> = {
  super_admin: '/superadmin/dashboard',
  architect: '/architect/projects',
  structural_team: '/structural-team',
  client: '/client',
}

const publicPaths = ['/auth/login', '/favicon.ico']

function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1]
    const decodedPayload = decodeURIComponent(
      atob(base64Payload)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(decodedPayload)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('sb-access-token')?.value

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const payload = parseJwt(token)
  if (!payload) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const userRole =
    payload['role'] || payload['https://hasura.io/jwt/claims']?.['x-hasura-role']

  if (!userRole || !roleRedirects[userRole]) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

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

  if (!pathname.startsWith(allowedPrefix) && pathname !== '/messages') {
    return NextResponse.redirect(new URL(roleRedirects[userRole], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
