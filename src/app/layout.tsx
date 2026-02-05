import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'the-house-of-the-depp | Agentic Engineer',
    template: '%s | the-house-of-the-depp',
  },
  description: 'Agentic Engineer의 기술 블로그 & 포트폴리오. AI, 소프트웨어 개발, 그리고 에이전트 기반 시스템에 대한 이야기.',
  keywords: ['기술 블로그', '포트폴리오', 'Agentic Engineer', 'AI', '개발'],
  authors: [{ name: 'the-house-of-the-depp' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'the-house-of-the-depp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
