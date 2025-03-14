/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image domains for Next.js Image component
  images: {
    // Allow Cloudinary domains for optimized image loading
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
