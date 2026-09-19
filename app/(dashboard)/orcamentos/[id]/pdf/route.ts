import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { getQuoteByIdAndUserId } from '@/lib/db/queries/quotes'
import { getBusinessByUserId } from '@/lib/db/queries/users'
import { generateQuotePDF } from '@/lib/pdf/generator'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth()
  const { id } = await params

  const [quote, business] = await Promise.all([
    getQuoteByIdAndUserId(id, user.id),
    getBusinessByUserId(user.id),
  ])

  if (!quote) {
    return new NextResponse('Orçamento não encontrado', { status: 404 })
  }

  const pdfBuffer = await generateQuotePDF({ quote, business })

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${quote.quoteNumber}.pdf"`,
    },
  })
}
