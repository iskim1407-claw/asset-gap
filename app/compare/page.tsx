'use client';

import { useState } from 'react';
import { SALARY_STATS, ASSET_STATS_30S, formatMoney, getSalaryPercentile } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

export default function ComparePage() {
  const [annualSalary, setAnnualSalary] = useState(4200);
  const [currentAsset, setCurrentAsset] = useState(8000);

  const salaryPercentile = getSalaryPercentile(annualSalary);

  const salaryData = [
    ...SALARY_STATS.percentiles.map(p => ({ name: p.label, value: p.value, fill: '#3182F6' })),
    { name: '나', value: annualSalary, fill: '#22c55e' },
  ].sort((a, b) => a.value - b.value);

  const assetData = [
    { name: '30대 중위', value: ASSET_STATS_30S.median, fill: '#3182F6' },
    { name: '30대 평균', value: ASSET_STATS_30S.average, fill: '#3182F6' },
    { name: '나', value: currentAsset, fill: '#22c55e' },
    { name: '30대 상위10%', value: ASSET_STATS_30S.top10, fill: '#f59e0b' },
  ].sort((a, b) => a.value - b.value);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users size={24} className="text-[#3182F6]" />
        통계 비교
      </h1>

      {/* Input */}
      <div className="glass p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">연봉 (세전, 만원)</label>
            <input
              type="number"
              className="input-field"
              value={annualSalary}
              onChange={e => setAnnualSalary(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">현재 총 자산 (만원)</label>
            <input
              type="number"
              className="input-field"
              value={currentAsset}
              onChange={e => setCurrentAsset(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Salary Position */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">연봉 위치</h2>
          <span className="bg-[#3182F6]/20 text-[#3182F6] px-3 py-1 rounded-full text-sm font-medium">
            {salaryPercentile}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          내 연봉 <span className="text-white font-bold">{formatMoney(annualSalary)}</span>은
          한국 근로자 중 <span className="text-[#3182F6] font-bold">{salaryPercentile}</span>에 해당합니다.
        </p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={v => `${v}만`} />
              <YAxis type="category" dataKey="name" stroke="#666" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                formatter={(value) => formatMoney(Number(value))}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {salaryData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Position */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">자산 위치 (30대 기준)</h2>
          <TrendingUp size={20} className="text-[#3182F6]" />
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={v => v >= 10000 ? `${Math.round(v/10000)}억` : `${v}만`} />
              <YAxis type="category" dataKey="name" stroke="#666" fontSize={12} width={90} />
              <Tooltip
                contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                formatter={(value) => formatMoney(Number(value))}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {assetData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Stats */}
      <div className="glass p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">핵심 통계 (2025 기준)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#3182F6]">3,600만</div>
            <div className="text-xs text-gray-400">연봉 중위값</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">2.5%</div>
            <div className="text-xs text-gray-400">물가상승률</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">5~8%</div>
            <div className="text-xs text-gray-400">서울 부동산 상승률</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">3.5%</div>
            <div className="text-xs text-gray-400">예금 금리</div>
          </div>
        </div>
      </div>

      {/* Ad slot */}
      <div className="ad-slot h-[250px] w-[300px] mx-auto mb-16">
        광고 영역 (300×250)
      </div>
    </div>
  );
}
