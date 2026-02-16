/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

module.exports = nextConfig;
