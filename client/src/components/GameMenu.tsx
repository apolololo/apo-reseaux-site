import { Inter } from 'next/font/google';
import './globals.css';
import MusicPlayer from '@/components/MusicPlayer';
import GameMenu from '@/components/GameMenu';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <MusicPlayer />
        <GameMenu />
      </body>
    </html>
  );
}
