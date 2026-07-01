"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, signIn } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("auth.redirect", redirectPath);
      signIn();
    }
  }, [isLoading, isAuthenticated, signIn]);

  if (isLoading || !isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-muted-foreground text-sm animate-pulse">
          Redirecting to sign-in…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
