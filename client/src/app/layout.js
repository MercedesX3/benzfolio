import { Anton, Archivo, Archivo_Black } from 'next/font/google';
import AppShell from '@/components/AppShell';
import './globals.css';

const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const body = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const sign = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sign',
  display: 'swap',
});

export const metadata = {
  title: 'Mercedes Xiong — Full Stack Developer',
  description:
    'CS @ UT Dallas. I build things people actually use — including SAGE, an AI advising platform serving 2,000+ students. VP of ACM @ UTD.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${sign.variable}`}
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
