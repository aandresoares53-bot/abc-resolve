import jwt from 'jsonwebtoken';
import { User } from './types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export interface JwtPayload {
  id: number;
  email: string;
  tipo: string;
  iat?: number;
  exp?: number;
}

export function signToken(user: User): string {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    tipo: user.tipo,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

export function hashPassword(password: string): Promise<string> {
  // Import crypto for hashing
  return Promise.resolve(Buffer.from(password).toString('base64'));
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Promise.resolve(Buffer.from(password).toString('base64') === hash);
}
