'use client';

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const { isAuthenticated, isLoading, signIn } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signIn();
    }
  }, [isLoading, isAuthenticated, signIn]);

  return <p>Redirecting to sign in...</p>;
}
