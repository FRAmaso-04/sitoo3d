import type { Metadata } from 'next';
import { Bebas_Neue, Space_Mono, Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-jp',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Never Stop Exploring — Drop Collection Since 2004',
  description:
    'Nordic wilderness meets Japanese streetwear vintage. Heavy cotton, heavy intentions. Explore the drop collection.',
  openGraph: {
    title: 'Never Stop Exploring',
    description: 'An expedition into the unknown. Heavy cotton, heavy intentions.',
    images: ['/og-image.jpg'],
    locale: 'it_IT',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${bebasNeue.variable} ${spaceMono.variable} ${notoSansJP.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
