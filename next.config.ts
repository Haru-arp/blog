import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ 빌드 시 TypeScript 에러를 무시합니다
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ 빌드 시 ESLint 에러를 무시합니다
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
