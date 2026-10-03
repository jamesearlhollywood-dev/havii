import type { NextConfig } from "next";

const previewHost = process.env.BASE44_PUBLIC_HOST_SUFFIX
  ? `3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: previewHost ? [previewHost] : [],
  experimental: {
    serverActions: {
      allowedOrigins: previewHost
        ? [previewHost, "*.imported.base44-preview.app"]
        : [],
    },
  },
};

export default nextConfig;
