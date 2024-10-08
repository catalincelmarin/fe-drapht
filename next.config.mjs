import removeImports from 'next-remove-imports';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  output: "export"
};

export default removeImports()(nextConfig);
