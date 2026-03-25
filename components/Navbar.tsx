"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setUsername(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-neutral-900 dark:bg-neutral-950 text-white border-b border-neutral-700 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="text-xl font-bold hover:text-blue-400 transition-colors"
          >
            🚀 MyBlog
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
             
            {isLoggedIn ? (
              <>
                <span className="text-neutral-300 text-sm">
                  {t("nav.welcome")} <strong>{username}</strong>
                </span>
                <Link
                  href="/add"
                  className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {t("nav.addPost")}
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-neutral-300 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {theme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-neutral-700 dark:border-neutral-800">
            <div className="flex flex-col gap-4">
              {isLoggedIn ? (
                <>
                  <span className="text-neutral-300 text-sm">
                    {t("nav.welcome")} <strong>{username}</strong>
                  </span>
                  <Link
                    href="/add"
                    className="text-left text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                     {t("nav.addPost")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-left text-neutral-300 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
