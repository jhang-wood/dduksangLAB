'use client';

// 전체 앱 CSR 전환으로 단순화
export const dynamic = 'force-dynamic';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${montserrat.variable} font-sans bg-deepBlack-900 text-offWhite-200 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
