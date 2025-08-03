// api.ts or your API configuration file
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Debug log in development
if (process.env.NODE_ENV === "development") {
  console.log("API_URL:", API_URL);
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: "include",
      mode: "cors", // Explicitly set CORS mode
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}
