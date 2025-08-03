import { apiFetch } from "@/lib/api";
import { RegisterInput } from "./schema/auth-schema";

// Helper function to set token in both localStorage and cookies
function setAuthToken(token: string) {
  localStorage.setItem("accessToken", token);
}

// Helper function to clear token from both localStorage and cookies
function clearAuthToken() {
  localStorage.removeItem("accessToken");

  if (typeof document !== "undefined") {
    document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
  }
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
  return res.user;
}

export async function logoutUser() {
  try {
    const token = localStorage.getItem("accessToken");
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

    // Redirect to sign in page
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
