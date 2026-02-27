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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.comparemymedication.com' }],
        destination: 'https://comparemymedication.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
