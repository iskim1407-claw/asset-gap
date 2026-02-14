import { ArrowRight, TrendingUp, Home, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 text-sm text-gray-400 mb-6">
          <TrendingUp size={16} className="text-[#3182F6]" />
          2026년 1월 KB부동산 시세 기준
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          내 월급으로<br />
          <span className="text-[#3182F6]">언제 집 살 수 있을까?</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
          월급, 저축, 투자 시나리오별로<br />
          자산 축적 vs 부동산 가격 상승 격차를 시뮬레이션합니다.
        </p>
        <Link href="/simulator" className="btn-primary inline-flex items-center gap-2 text-lg">
          시뮬레이션 시작하기 <ArrowRight size={20} />
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-4 pb-16">
        {[
          { icon: <Home size={24} />, title: '지역별 시세', desc: '서울 13개 구 + 경기도 실거래 기반 시세' },
          { icon: <BarChart3 size={24} />, title: '4가지 시나리오', desc: '현 유지 / 절약 / 투자 / 부업 비교' },
          { icon: <TrendingUp size={24} />, title: '통계 비교', desc: '내 위치 vs 한국 30대 평균 vs 상위 10%' },
        ].map((f, i) => (
          <div key={i} className="glass-hover p-6">
            <div className="text-[#3182F6] mb-3">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats */}
      <section className="glass p-8 mb-16 text-center">
        <h2 className="text-xl font-bold mb-6">2026년 서울 아파트 시세</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: '강남', price: '25억' },
            { name: '서초', price: '22억' },
            { name: '송파', price: '18억' },
            { name: '마포', price: '14억' },
            { name: '성동', price: '13억' },
            { name: '노원', price: '7억' },
          ].map((r) => (
            <div key={r.name}>
              <div className="text-2xl font-bold text-[#3182F6]">{r.price}</div>
              <div className="text-sm text-gray-400">{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad slot */}
      <div className="ad-slot h-[90px] mb-16">
        광고 영역 (728×90)
      </div>
    </div>
  );
}
