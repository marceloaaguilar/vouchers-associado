import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sistema.exclusivepass.com.br',
        port: '',
        pathname: '/api/files/**',
        search: '',
      },
    ],
  },
}

export default nextConfig;
