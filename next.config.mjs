/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./lib/**/*'],
    },
  },
};

export default nextConfig;
