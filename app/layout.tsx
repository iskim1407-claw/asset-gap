import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '자산 격차 시뮬레이터 | 내 월급으로 언제 집 살 수 있을까?',
  description: '한국 직장인의 자산 축적 vs 부동산 가격 상승 격차를 시각화하는 시뮬레이터. 내 월급으로 언제 집을 살 수 있는지 확인해보세요.',
  openGraph: {
    title: '자산 격차 시뮬레이터',
    description: '내 월급으로 언제 집 살 수 있을까? 자산 vs 부동산 격차 시뮬레이션',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-950 text-white font-[Pretendard] antialiased min-h-screen">
        <nav className="border-b border-white/10 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-lg">
              <span className="text-[#3182F6]">자산격차</span> 시뮬레이터
            </a>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="/simulator" className="hover:text-white transition">시뮬레이터</a>
              <a href="/compare" className="hover:text-white transition">통계비교</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
