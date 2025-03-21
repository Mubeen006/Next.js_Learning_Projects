/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set Pages Router as the default
  useFileSystemPublicRoutes: true,
  // Keep the pages directory as the primary router
  experimental: {
    ppr: false
  }
};

export default nextConfig;
