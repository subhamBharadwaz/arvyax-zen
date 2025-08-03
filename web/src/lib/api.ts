export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw {
      message: errorData?.error || "API Error",
      status: res.status,
      raw: errorData,
    };
  }
  return res.json();
}
