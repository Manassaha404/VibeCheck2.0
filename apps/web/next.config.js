/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/trpc", "@repo/database", "@repo/error", "@repo/services"],
};

export default nextConfig;
