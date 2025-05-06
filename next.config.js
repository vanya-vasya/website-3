const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com", // Add this line to allow images from twitter
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // 👈 Unsplash
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
