import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  /**
   * Lexicon used to live at /work/gopro-translation and is now a project
   * case study. Permanent, because the old URL has been shared.
   */
  async redirects() {
    return [
      {
        source: '/work/gopro-translation',
        destination: '/projects/lexicon',
        permanent: true,
      },
      /* Nothing else was ever published under /work, so the rest of the
         segment goes to the projects section rather than a 404. */
      {
        source: '/work/:slug*',
        destination: '/projects',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
