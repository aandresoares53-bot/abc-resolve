import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/clientes') ||
      pathname.startsWith('/orcamentos') ||
      pathname.startsWith('/servicos') ||
      pathname.startsWith('/produtos') ||
      pathname.startsWith('/configuracoes')) {
    const response = NextResponse.next()
    const session = await getIronSession<{ userId?: string }>(
      request,
      response,
      {
        password: process.env.SESSION_PASSWORD ?? 'fallback-password-change-in-production',
        cookieName: 'orcamento_facil_session',
      }
    )

    if (!session.userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clientes/:path*',
    '/orcamentos/:path*',
    '/servicos/:path*',
    '/produtos/:path*',
    '/configuracoes/:path*',
  ],
}
