'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { AccessTokenPayload } from './interfaces';

export async function validateSession(): Promise<boolean> {

  const cookiesUser = await cookies();
  const sessionCookie = cookiesUser.get('token');
  if (!sessionCookie) return false

  try {
    const accessToken = sessionCookie.value;
    const { exp: expires } = await openAccessToken(accessToken);
    const currentDate = new Date().getTime();
    return (expires as number) * 1000 > currentDate;
  } catch (error) {
    console.log("Erro: " + error);
    return false;
  }
}

export async function openAccessToken(accessToken: string): Promise<AccessTokenPayload> {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_AUTH_SECRET);
  const { payload }: { payload: AccessTokenPayload } = await jwtVerify(accessToken, secret);
  return payload
}

export async function createSession(accessToken: string, nutricionistId: string ) {
  const userCookies = await cookies();
  userCookies.set(
    "token",
    JSON.stringify({ accessToken, nutricionistId }),
    {
      maxAge: 60 * 60 * 2,
      path: '/',
      sameSite: 'strict'
    }
  )
}