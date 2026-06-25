import { SignJWT, jwtVerify } from 'jose';

const TOKEN_NAME = 'abc_admin_token';
const EXPIRY = '8h';

function getSecret(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(secret: string): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret(secret));
}

export async function verifyAdminToken(token: string, secret: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret(secret));
    return true;
  } catch {
    return false;
  }
}

export { TOKEN_NAME };
