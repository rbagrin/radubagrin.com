"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/v1/auth/logout", { method: "POST" });
      if (res.ok) {
        // Hard reload to clear client state and trigger middleware
        window.location.href = "/login";
      } else {
        setIsLoggingOut(false);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-fg hover:text-accent transition-colors">
            Personal App
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-fg-muted hover:bg-surface-hover hover:text-fg disabled:opacity-50 transition-colors"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
