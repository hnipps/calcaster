/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: [
    { source: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/data`, destination: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/data.json` },
  ],
};

module.exports = nextConfig;
