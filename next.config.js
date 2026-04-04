/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build for hackathon - focus on shipping
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds with type warnings for hackathon speed
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
