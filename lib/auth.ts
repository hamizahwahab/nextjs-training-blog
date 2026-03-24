import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const AUTH_COOKIE = "blog_user";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(AUTH_COOKIE)?.value;
  
  if (!userCookie) return null;
  
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

export async function setUserSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, JSON.stringify({ username }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
