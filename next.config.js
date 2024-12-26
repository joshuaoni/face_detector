/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new NodePolyfillPlugin());
    }

    config.resolve.fallback = {
      fs: false,  // Use false to mock the fs module 
      encoding: false,
      ...config.resolve.fallback, // Keep other existing fallbacks intact
    };

    return config;
  },
};


