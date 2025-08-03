import { apiFetch } from "@/lib/api";
import { RegisterInput } from "./schema/auth-schema";

// Helper function to set token in both localStorage and cookies
function setAuthToken(token: string) {
  // Set in localStorage for client-side usage
  localStorage.setItem("accessToken", token);

  // Set in cookies for middleware usage
  if (typeof document !== "undefined") {
    // Set cookie with proper attributes for cross-site requests
    const cookieOptions = [
      `token=${token}`,
      "path=/",
      "max-age=604800", // 7 days
      "SameSite=Lax", // Changed from Strict to Lax for cross-site
      "Secure", // Only send over HTTPS in production
    ];

    document.cookie = cookieOptions.join("; ");
  }
}

// Helper function to clear token from both localStorage and cookies
function clearAuthToken() {
  localStorage.removeItem("accessToken");
  if (typeof document !== "undefined") {
    document.cookie = `token=; path=/; max-age=0; SameSite=Lax; Secure`;
  }
}

// Helper function to get token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function loginUser(email: string, password: string) {
  const res = await apiFetch<{ accessToken: string; user: any }>(
    "/api/v1/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  setAuthToken(res.accessToken);

  // Force a page reload to update the middleware state
  // Alternative: use router.refresh() if you're using app router
  setTimeout(() => {
    window.location.reload();
  }, 100);

  return res.user;
}

export async function registerUser(input: RegisterInput) {
  const { confirmPassword, ...payload } = input;
  const res = await apiFetch<{ accessToken: string; user: any }>(
    "/api/v1/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  setAuthToken(res.accessToken);

  // Force a page reload to update the middleware state
  setTimeout(() => {
    window.location.reload();
  }, 100);

  return res.user;
}

export async function logoutUser() {
  try {
    const token = getAuthToken();
    if (token) {
      try {
        await apiFetch("/api/v1/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.warn("Logout API call failed:", error);
      }
    }

    // Clear tokens from client storage
    clearAuthToken();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if logout fails, clear local tokens and redirect
    clearAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
