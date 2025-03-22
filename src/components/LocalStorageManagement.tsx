"use client";
import { CookiesProps } from "@/lib/interfaces";

export async function setLocalStorage(props: CookiesProps) {
  const response = localStorage.setItem(props.name, props.value);
  return response;
}

export async function getLocalStorage(key:string) {
  const response = localStorage.getItem(key);
  return response
}
