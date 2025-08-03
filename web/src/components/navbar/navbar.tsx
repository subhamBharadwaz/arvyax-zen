"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavbarClient } from "./navbar-client";
import { API_URL } from "@/lib/api";

export function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // Re-check auth state when route changes
  useEffect(() => {
    fetchUser();
  }, [pathname]);

  // Listen for custom auth events
  useEffect(() => {
    const handleAuthChange = () => {
      fetchUser();
    };

    const handleStorageChange = (e: any) => {
      if (e.key === "accessToken") {
        fetchUser();
      }
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  const isAuthenticated = !!user;
  return <NavbarClient user={user} isAuthenticated={isAuthenticated} />;
}
