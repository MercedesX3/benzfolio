import { Archivo_Black, DM_Sans, Caveat } from 'next/font/google';
import AppShell from '@/components/AppShell';
import './globals.css';

const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

const hand = Caveat({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-hand',
  display: 'swap',
});

export const metadata = {
  title: 'Mercedes Xiong — Full Stack Developer',
  description:
    'CS @ UT Dallas. I build things people actually use — including SAGE, an AI advising platform serving 2,000+ students. VP of ACM @ UTD.',
};

// Runs before first paint so dark-mode visitors never see the light palette flash.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('darkMode');var d=s!==null?JSON.parse(s):window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark-mode')}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
