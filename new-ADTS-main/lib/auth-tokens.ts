import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

export const ADMIN_TOKEN_COOKIE_NAME = 'admin-token'

function getSecretKey() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET environment variable is not set')
  }
  return new TextEncoder().encode(secret)
}

export interface AdminTokenPayload extends JWTPayload {
  email: string
  name?: string
  role?: string
  type: 'admin'
}

export async function createAdminToken(input: {
  id: string
  email: string
  full_name?: string | null
  role?: string | null
}) {
  const secret = getSecretKey()

  const payload: AdminTokenPayload = {
    sub: input.id,
    email: input.email,
    name: input.full_name ?? undefined,
    role: input.role ?? 'admin',
    type: 'admin',
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload> {
  const secret = getSecretKey()
  const { payload } = await jwtVerify(token, secret)
  const adminPayload = payload as AdminTokenPayload

  if (adminPayload.type !== 'admin') {
    throw new Error('Invalid token type')
  }

  return adminPayload
}
