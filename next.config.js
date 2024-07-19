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
        source: '/api/uipath-jobs/:path*', // Ajusta la ruta según tus necesidades
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value:
              'https://cloud.uipath.com/demo_rch/DefaultTenant/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
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
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
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
