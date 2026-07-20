import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone', // Descomentar se usar Docker; Vercel não precisa
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },      // mock
      { protocol: 'https', hostname: '**.idealista.pt' },
      { protocol: 'https', hostname: '**.imovirtual.com' },
      { protocol: 'https', hostname: '**.olx.pt' },
      { protocol: 'https', hostname: '**.supercasa.pt' },
      { protocol: 'https', hostname: '**.remax.pt' },
      { protocol: 'https', hostname: '**.era.pt' },
      { protocol: 'https', hostname: '**.custojusto.pt' },
      { protocol: 'https', hostname: '**.sapo.pt' },
    ],
  },
};

export default nextConfig;
