import AppShell from '@/components/AppShell';
import './globals.css';

export const metadata = {
  title: 'Mercedes Xiong Portfolio',
  description: 'Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
