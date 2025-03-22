"use server";

import { CookiesProps } from "@/lib/interfaces";
import { cookies } from "next/headers";

export default async function setCookies(props: CookiesProps) {
  const cookiesData = await cookies();
  cookiesData.set(props.name, props.value);

  return { success: true };
}

export async function removeToken() {
  const cookiesData = await cookies();
  cookiesData.delete("token");

  return { success: true };
}

export async function getCookies(prop: string) {
  const cookiesData = await cookies();
  const data = cookiesData.get(prop);

  return data?.value || null;
}

export async function removeCookies(key: string) {
  const cookiesData = await cookies();
  cookiesData.delete(key);

}
