/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'links.papareact.com',
      'avatars.dicebear.com',
      'www.redditstatic.com',
      'i.redd.it',
      'i.picsum.photos',
    ],
  },
}

module.exports = nextConfig
