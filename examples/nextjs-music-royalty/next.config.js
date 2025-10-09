/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Handle node modules that need polyfills for browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Handle WASM files for TFHE
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  // Disable ESLint during builds to avoid configuration issues
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
