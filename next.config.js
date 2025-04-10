/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['crests.football-data.org'],
  },
  async rewrites() {
    return [
      {
        source: '/api/football/:path*',
        destination: 'https://api.football-data.org/v4/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/football/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 