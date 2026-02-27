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
      // www → non-www redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.comparemymedication.com' }],
        destination: 'https://comparemymedication.com/:path*',
        permanent: true,
      },
      // Acetaminophen brand variants that 404 → parent drug page
      { source: '/drug/tempra-quicklets', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/anacin-advanced-headache-formula', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/mapap', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/percogesic-reformulated-jan-2011', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/capacet', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/pamprin-cramp-formula', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/panadol', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/tactinal', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/unisom-with-pain-relief', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/anacin-af', destination: '/drug/acetaminophen', permanent: true },
      // Additional common acetaminophen variants
      { source: '/drug/pharbetol', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/cetafen', destination: '/drug/acetaminophen', permanent: true },
      { source: '/drug/tycolene', destination: '/drug/acetaminophen', permanent: true },
    ];
  },
};

module.exports = nextConfig;
