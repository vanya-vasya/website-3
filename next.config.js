const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    // Ensure the PDF font and logo are bundled into the serverless
    // function on Vercel (they are read from disk at runtime)
    outputFileTracingIncludes: {
      "/api/generate-receipt": [
        "./public/assets/fonts/Nunito-Regular.ttf",
        "./public/logos/yum-mi-onigiri-logo.png",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
