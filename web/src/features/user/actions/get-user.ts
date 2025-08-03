"use server";
import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const apiUrl = `${API_URL}/api/v1/me`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.user;
  } catch (error: any) {
    return null;
  }
}
