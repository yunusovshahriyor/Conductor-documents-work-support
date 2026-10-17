// Static export so the app can be hosted on GitHub Pages.
// NEXT_PUBLIC_BASE_PATH is "/<repo-name>" on project pages and empty everywhere else.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
