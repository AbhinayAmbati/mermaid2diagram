/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint runs explicitly via `npm run lint`; type errors are caught by
  // `npm run typecheck`. Neither should block a production build.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
