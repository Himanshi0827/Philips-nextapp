'use client';

import { useEffect } from "react";
import { getUserManager } from "@/lib/auth/oidc-config";

export default function SilentRenewPage() {
  useEffect(() => {
    getUserManager().signinSilentCallback().catch(console.error);
  }, []);

  return null;
}
