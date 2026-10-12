import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.BASE44_PREVIEW_MODE === "1" && process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? ["3000-" + process.env.BASE44_PUBLIC_HOST_SUFFIX]
    : undefined,
  // Workaround for Next.js 16 framework bug: /_global-error prerendering fails with
  // "Cannot read properties of null (reading 'useContext')" during static generation.
  // This is a confirmed framework defect (GitHub #86178, #84994) affecting Next.js 16.x
  // with React 19. The /_global-error page renders correctly at runtime as a dynamic
  // route; only the build-time static prerender fails. Disabling prerenderEarlyExit
  // allows the build to complete without aborting on this non-fatal prerender error.
  experimental: {
    prerenderEarlyExit: false,
  },
};

export default nextConfig;
