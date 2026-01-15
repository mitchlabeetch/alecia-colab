/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asset prefix for proper static file serving in multi-zone deployment
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://colab.alecia.markets' 
    : undefined,
  
  // Enable source maps for debugging
  productionBrowserSourceMaps: true,
  
  // Redirects
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/mitchlabeetch/alecia-colab",
        permanent: true,
      },
    ];
  },
  
  // Headers for cross-origin embedding and security
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://alecia.fr https://alecia.markets https://panel.alecia.markets",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://alecia.fr https://*.alecia.fr https://alecia.markets https://*.alecia.markets",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://alecia.markets",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

