'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleCallback } from "../../src/api/api";

function Callback() {
  const navigate = useRouter();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const user = await handleCallback();

        // Get original route
        const returnUrl = user?.state?.returnUrl || "/";

        navigate.push(returnUrl);
      } catch (err) {
        console.error("Login failed", err);
        navigate.push("/");
      }
    };

    processCallback();
  }, [navigate]);

  return <p>Signing you in...</p>;
}
export default Callback;