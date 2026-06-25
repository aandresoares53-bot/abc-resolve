import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { generatePixPayload, SUBSCRIPTION_PIX } from '@/lib/pix';

export async function GET() {
  const txid = `ABCRES${Date.now().toString().slice(-10)}`;

  const pixCode = generatePixPayload({
    ...SUBSCRIPTION_PIX,
    txid,
  });

  const qrDataUrl = await QRCode.toDataURL(pixCode, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
    color: { dark: '#1e3a8a', light: '#ffffff' },
  });

  return NextResponse.json({ qrDataUrl, pixCode });
}
