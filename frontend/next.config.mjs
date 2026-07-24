/** @type {import('next').NextConfig} */
const nextConfig = {
  // next/image necesita saber qué dominios remotos son válidos.
  // GitHub sirve avatares desde varios subdominios numerados.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "avatars0.githubusercontent.com" },
      { protocol: "https", hostname: "avatars1.githubusercontent.com" },
      { protocol: "https", hostname: "avatars2.githubusercontent.com" },
      { protocol: "https", hostname: "avatars3.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
