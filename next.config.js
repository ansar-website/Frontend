/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

// const withImages = require('next-images');

// module.exports = withImages();

const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([[withImages]], {
  images: {
    disableStaticImages: true,
  },
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});
