"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Settings,
  Heart,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { logoutUser } from "@/features/auth/auth.api";

interface User {
  name: string;
  email: string;
  id: string;
}

interface NavbarClientProps {
  user: User | null;
  isAuthenticated: boolean;
}

export function NavbarClient({ user, isAuthenticated }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: redirect anyway
      router.push("/login");
      router.refresh();
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Heart className="h-8 w-8 text-emerald-600 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Arvyax Zen
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <Link
                    href="/my-sessions"
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    My Sessions
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/about"
                    onClick={() => handleNavigation("/about")}
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    About
                  </Link>
                  <Link
                    href="/#features"
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Features
                  </Link>
                  <Link
                    href="/#pricing"
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Pricing
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 bg-gray-100 p-2 hover:bg-gray-200 transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="ml-2 text-gray-700 font-medium max-w-32 truncate">
                    {user?.name || "User"}
                  </span>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || ""}
                        </p>
                      </div>
                      <hr className="my-1" />
                      <Button
                        onClick={handleLogout}
                        className="bg-background text-foreground hover:bg-background/90 cursor-pointer ml-4"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-foreground" />
                        Sign out
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-emerald-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-25 z-20 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="md:hidden relative z-30">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white shadow-lg">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-3 border-b border-gray-100 mb-2">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 w-full text-left px-3 py-3 rounded-md text-base font-medium flex items-center transition-colors duration-200"
                    >
                      <Home className="h-5 w-5 mr-3 text-gray-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/my-sessions"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 w-full text-left px-3 py-3 rounded-md text-base font-medium flex items-center transition-colors duration-200"
                    >
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      My Sessions
                    </Link>
                    <hr className="my-2" />
                    <Button
                      onClick={handleLogout}
                      className="bg-background text-foreground hover:bg-background/90 cursor-pointer ml-4"
                    >
                      <LogOut className="h-5 w-5 mr-3 text-foreground" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/#about"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      About
                    </Link>
                    <Link
                      href="/#features"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      Features
                    </Link>
                    <Link
                      href="/#pricing"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      Pricing
                    </Link>
                    <hr className="my-2" />
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
