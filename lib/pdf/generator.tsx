import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Quote, QuoteItem, Client, Business } from '@/drizzle/schema'
import { formatCurrency, formatDate, QUOTE_STATUS_LABELS } from '@/lib/utils'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a8a',
  },
  companyDetail: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 2,
  },
  quoteInfo: {
    alignItems: 'flex-end',
  },
  quoteNumber: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  quoteMeta: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 5,
    backgroundColor: '#dbeafe',
    padding: '3 8',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    color: '#1e40af',
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a8a',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  clientInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  clientField: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 8,
    color: '#6b7280',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 10,
    color: '#111827',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    padding: '6 8',
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6 8',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: '6 8',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
  },
  colDescription: { flex: 4 },
  colQty: { flex: 1, textAlign: 'right' },
  colUnit: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  totalsSection: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 9,
    color: '#374151',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
    borderTopWidth: 2,
    borderTopColor: '#1e3a8a',
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a8a',
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a8a',
  },
  notes: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  notesText: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
})

interface PDFData {
  quote: Quote & { items: QuoteItem[]; client: Client | null }
  business: Business | null
}

function QuoteDocument({ quote, business }: PDFData) {
  const subtotal = parseFloat(quote.subtotal || '0')
  const discount = parseFloat(quote.discount || '0')
  const additionalCost = parseFloat(quote.additionalCost || '0')
  const total = parseFloat(quote.total || '0')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {business?.logoUrl && (
              <Image src={business.logoUrl} style={styles.logo} />
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{business?.businessName || 'Empresa'}</Text>
              {business?.document && <Text style={styles.companyDetail}>CNPJ/CPF: {business.document}</Text>}
              {business?.phone && <Text style={styles.companyDetail}>Tel: {business.phone}</Text>}
              {business?.email && <Text style={styles.companyDetail}>{business.email}</Text>}
              {business?.city && <Text style={styles.companyDetail}>{business.city}{business.state ? `, ${business.state}` : ''}</Text>}
            </View>
          </View>
          <View style={styles.quoteInfo}>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
            <Text style={styles.quoteMeta}>Data: {formatDate(quote.createdAt)}</Text>
            {quote.validUntil && (
              <Text style={styles.quoteMeta}>Válido até: {formatDate(quote.validUntil)}</Text>
            )}
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{QUOTE_STATUS_LABELS[quote.status] || quote.status}</Text>
            </View>
          </View>
        </View>

        {/* Client */}
        {quote.client && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CLIENTE</Text>
            <View style={styles.clientInfo}>
              <View style={{ flex: 1 }}>
                <View style={styles.clientField}>
                  <Text style={styles.fieldLabel}>Nome</Text>
                  <Text style={styles.fieldValue}>{quote.client.name}</Text>
                </View>
                {quote.client.document && (
                  <View style={styles.clientField}>
                    <Text style={styles.fieldLabel}>CPF/CNPJ</Text>
                    <Text style={styles.fieldValue}>{quote.client.document}</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {quote.client.phone && (
                  <View style={styles.clientField}>
                    <Text style={styles.fieldLabel}>Telefone</Text>
                    <Text style={styles.fieldValue}>{quote.client.phone}</Text>
                  </View>
                )}
                {quote.client.email && (
                  <View style={styles.clientField}>
                    <Text style={styles.fieldLabel}>E-mail</Text>
                    <Text style={styles.fieldValue}>{quote.client.email}</Text>
                  </View>
                )}
                {quote.client.address && (
                  <View style={styles.clientField}>
                    <Text style={styles.fieldLabel}>Endereço</Text>
                    <Text style={styles.fieldValue}>{quote.client.address}{quote.client.city ? `, ${quote.client.city}` : ''}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITENS DO ORÇAMENTO</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colDescription]}>Descrição</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qtd</Text>
              <Text style={[styles.tableHeaderText, styles.colUnit]}>Un</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>Preço Unit.</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
            </View>
            {quote.items.map((item, index) => (
              <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{parseFloat(item.quantity || '1').toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.colUnit]}>{item.unit}</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(item.unitPrice || '0')}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(item.total || '0')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Desconto</Text>
              <Text style={styles.totalValue}>- {formatCurrency(discount)}</Text>
            </View>
          )}
          {additionalCost > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Custos adicionais</Text>
              <Text style={styles.totalValue}>{formatCurrency(additionalCost)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Gerado por Orçamento Fácil</Text>
          <Text style={styles.footerText}>{quote.quoteNumber} • {formatDate(quote.createdAt)}</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateQuotePDF(data: PDFData): Promise<Buffer> {
  return renderToBuffer(<QuoteDocument {...data} />)
}
