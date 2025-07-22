/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now stable in Next.js 14, no need to specify
  },
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
