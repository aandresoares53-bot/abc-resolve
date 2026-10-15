import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get('cc_session')?.value

  if (pathname.startsWith('/admin')) return NextResponse.next()

  if (pathname.startsWith('/login')) {
    if (session) return NextResponse.redirect(new URL('/', req.url))
    return NextResponse.next()
  }

  if (!session) return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-192.png|icon-512.png).*)'],
}
