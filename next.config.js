// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/uipath-jobs/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://cloud.uipath.com/demo_rch/DefaultTenant/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, stokenjwt',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://api.ariapp.ai/bpass/',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization ,stokenjwt ',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      jquery: 'jquery',
    };
    return config;
  },
};

module.exports = nextConfig;
