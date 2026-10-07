import { Albert_Sans, Caveat } from 'next/font/google';
import AppShell from '@/components/AppShell';
import './globals.css';

/**
 * Two Google faces plus one self-hosted one.
 *
 * Kelsi is declared as @font-face in globals.css rather than here, because
 * next/font/local wants the file inside the app tree and the woff2 already
 * lives in public/ where the browser can cache it independently of the build.
 *
 * Caveat is standing in for Casual Sunday, which is a licensed font and is not
 * in the repo yet. Swapping it is a two-line change: drop the woff2 into
 * public/fonts/, add an @font-face beside Kelsi's, and point --font-hand at it.
 */
const body = Albert_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const hand = Caveat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-hand',
  display: 'swap',
});

const DESCRIPTION =
  'CS @ UT Dallas. Full-stack developer and designer. SAGE, Semantica, Lexicon, Lumina — and everything else on the desk.';

/* The icon, apple-icon and opengraph/twitter images are files beside this one
   (app/icon.png and friends), which Next wires into <head> by name. These
   fields only describe the link preview around them. */
export const metadata = {
  title: 'Mercedes Xiong — Full-Stack Developer',
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Mercedes Xiong',
    title: 'Mercedes Xiong — Full-Stack Developer',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mercedes Xiong — Full-Stack Developer',
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${hand.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
