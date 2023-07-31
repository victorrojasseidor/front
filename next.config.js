/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  reactStrictMode: true,
  async headers () {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS, PUT, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ]
  }

  // i18n: {
  //     locales: ['en', 'es'], // Lista de idiomas disponibles
  //     defaultLocale: 'en', // Idioma por defecto
  //   }
}

module.exports = nextConfig
