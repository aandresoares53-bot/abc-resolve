function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

function field(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`;
}

export function generatePixPayload({
  key,
  name,
  city,
  amount,
  txid,
  description,
}: {
  key: string;
  name: string;
  city: string;
  amount: string;
  txid: string;
  description?: string;
}): string {
  const merchantInfo = field(
    '26',
    field('00', 'br.gov.bcb.pix') +
    field('01', key) +
    (description ? field('02', description.substring(0, 72)) : '')
  );

  const additionalData = field('62', field('05', txid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 25)));

  const payload =
    field('00', '01') +
    field('01', '12') +
    merchantInfo +
    field('52', '0000') +
    field('53', '986') +
    field('54', amount) +
    field('58', 'BR') +
    field('59', name.substring(0, 25)) +
    field('60', city.substring(0, 15)) +
    additionalData +
    '6304';

  return payload + crc16(payload);
}

export const SUBSCRIPTION_PIX = {
  key: 'suporte@gde.com.br',
  name: 'ABC Resolve',
  city: 'Santo Andre',
  amount: '19.90',
  description: 'Assinatura mensal ABCResolve',
};
