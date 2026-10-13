import type { NextConfig } from "next";

const isPreview = process.env.BASE44_PREVIEW_MODE === "1";
const previewHost = isPreview && process.env.BASE44_PUBLIC_HOST_SUFFIX
  ? "3000-" + process.env.BASE44_PUBLIC_HOST_SUFFIX
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: previewHost ? [previewHost] : undefined,
  // In the preview proxy environment, x-forwarded-host (sandbox internal host)
  // differs from the browser's origin (preview proxy URL). Server Actions reject
  // this mismatch as a CSRF protection. allowedOrigins lets the preview origin
  // through so Server Actions work behind the proxy.
  serverActions: {
    allowedOrigins: previewHost ? [`https://${previewHost}`] : [],
  },
  // Workaround for Next.js 16 framework bug: /_global-error prerendering fails with
  // "Cannot read properties of null (reading 'useContext')" during static generation.
  // This is a confirmed framework defect (GitHub #86178, #84994) affecting Next.js 16.x
  // with React 19. The /_global-error page renders correctly at runtime as a dynamic
  // route; only the build-time static prerender fails. Disabling prerenderEarlyExit
  // allows the build to complete without aborting on this non-fatal prerender error.
  experimental: {
    prerenderEarlyExit: false,
    allowDevelopmentBuild: true,
  },
};

export default nextConfig;
