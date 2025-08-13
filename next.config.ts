import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?m?js$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
