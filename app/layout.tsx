import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from './providers';
import './globals.css';

const spaceGrotesk = localFont({
  src: [
    { path: './fonts/tap-rush-fonts/SpaceGrotesk-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/tap-rush-fonts/SpaceGrotesk-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-space-grotesk',
});

const ibmPlexMono = localFont({
  src: [
    { path: './fonts/tap-rush-fonts/IBMPlexMono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/tap-rush-fonts/IBMPlexMono-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/tap-rush-fonts/IBMPlexMono-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: 'Base Tap Rush',
  description: '10秒の反射神経チャレンジ。ハイスコアをBaseチェーンに記録しよう。',
  other: {
    'base:app_id': '6a4224fb8bbb28b54e0b3384',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="font-display">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
