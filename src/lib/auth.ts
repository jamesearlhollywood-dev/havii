import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-fallback-secret-32-chars!!";
const COOKIE_NAME = "havii_session";
const TOKEN_EXPIRY = "30d";

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function createSessionToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub) return null;
    return { userId: payload.sub, email: payload.email as string };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};
