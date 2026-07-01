import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing ~1100 strict-mode errors across 39 files — tracked in CLAUDE.md Known issues.
    // Remove this flag once those errors are resolved.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
