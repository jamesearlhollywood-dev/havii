import type { NextConfig } from "next";

// The preview proxy forwards the browser's Server Actions requests with an
// `x-forwarded-host` set to the sandbox's internal host, while the browser's
// `origin` is the public preview host. These legitimately differ, so we
// explicitly allow the preview origin for both dev assets/HMR and the Server
// Actions CSRF check (otherwise Next aborts the action with E80).
const previewOrigin = process.env.BASE44_PUBLIC_HOST_SUFFIX
  ? "3000-" + process.env.BASE44_PUBLIC_HOST_SUFFIX
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: previewOrigin ? [previewOrigin] : [],
  experimental: {
    serverActions: {
      allowedOrigins: previewOrigin ? [previewOrigin] : [],
    },
  },
};

export default nextConfig;
