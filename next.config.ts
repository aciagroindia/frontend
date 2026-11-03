/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/products/red-vinegar',
        destination: '/products/red-vinegar-500-ml--red-food-vinegar-aci-agro-solution',
        permanent: true,
      },
    ];
  },

  reactStrictMode: true,

  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Largest image variant limited to 2048px.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
