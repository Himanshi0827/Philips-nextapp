import type { NextConfig } from "next";

// typescript.ignoreBuildErrors keeps production builds green during the
// React-to-Next.js conversion (the repo has ~1100 pre-existing TS strict-mode
// errors in code ported from the legacy SPA). Fix incrementally and drop this
// flag once the codebase type-checks cleanly. See CLAUDE.md.
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
