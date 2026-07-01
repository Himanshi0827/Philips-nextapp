"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "oidc-client-ts";
import { getUserManager } from "./oidc-config";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mgr = getUserManager();

    mgr.getUser().then((u) => {
      setUser(u && !u.expired ? u : null);
      setIsLoading(false);
    });

    const onUserLoaded = (u: User) => setUser(u);
    const onUserUnloaded = () => setUser(null);
    const onSilentRenewError = () => setUser(null);

    mgr.events.addUserLoaded(onUserLoaded);
    mgr.events.addUserUnloaded(onUserUnloaded);
    mgr.events.addSilentRenewError(onSilentRenewError);
    mgr.events.addAccessTokenExpired(onUserUnloaded);

    return () => {
      mgr.events.removeUserLoaded(onUserLoaded);
      mgr.events.removeUserUnloaded(onUserUnloaded);
      mgr.events.removeSilentRenewError(onSilentRenewError);
      mgr.events.removeAccessTokenExpired(onUserUnloaded);
    };
  }, []);

  const signIn = useCallback(async () => {
    await getUserManager().signinRedirect();
  }, []);

  const signOut = useCallback(async () => {
    await getUserManager().signoutRedirect();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
