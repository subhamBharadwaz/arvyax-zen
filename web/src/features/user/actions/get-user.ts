"use server";
import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function getUser() {
  console.log("🚀 getUser server action called");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Debug all cookies
    const allCookies = cookieStore.getAll();
    console.log(
      "🍪 All cookies:",
      allCookies.map((c) => ({ name: c.name, hasValue: !!c.value })),
    );

    console.log("🔑 Token exists:", !!token);
    console.log(
      "🔑 Token value (first 20 chars):",
      token ? token.substring(0, 20) + "..." : "null",
    );

    if (!token) {
      console.log("❌ No token found, returning null");
      return null;
    }

    const apiUrl = `${API_URL}/api/v1/me`;
    console.log("🌐 API_URL:", API_URL);
    console.log("📡 Full API URL:", apiUrl);

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("📊 Response status:", res.status);
    console.log("📊 Response statusText:", res.statusText);
    console.log("📊 Response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.log("❌ API Error Response:", errorText);
      return null;
    }

    const data = await res.json();
    console.log("📋 Raw API response:", data);
    console.log("👤 User data:", data.user);

    return data.user;
  } catch (error) {
    console.error("💥 Server action error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 500),
    });
    return null;
  }
}
