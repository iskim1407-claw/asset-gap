'use client';

import { useState, useEffect } from 'react';
import { REGIONS, SCENARIOS, simulate, formatMoney, SimulationInput, SimulationResult } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calculator, Share2, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const STORAGE_KEY = 'asset-gap-input';

export default function SimulatorPage() {
  const [input, setInput] = useState<SimulationInput>({
    monthlySalary: 350,
    monthlySaving: 150,
    currentAsset: 5000,
    regionId: 'mapo',
  });
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [activeScenario, setActiveScenario] = useState<string>('current');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setInput(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleSimulate = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    const res = SCENARIOS.map(s => simulate(input, s));
    setResults(res);
    // Save to API
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, results: res.map(r => ({ scenario: r.scenario.id, crossYear: r.crossYear, yearsNeeded: r.yearsNeeded })) }),
    }).catch(() => {});
  };

  const activeResult = results?.find(r => r.scenario.id === activeScenario);
  const region = REGIONS.find(r => r.id === input.regionId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calculator size={24} className="text-[#3182F6]" />
        시뮬레이터
      </h1>

      {/* Input Form */}
      <div className="glass p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">월급 (세후, 만원)</label>
            <input
              type="number"
              className="input-field"
              value={input.monthlySalary}
              onChange={e => setInput({...input, monthlySalary: Number(e.target.value)})}
              placeholder="350"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">월 저축액 (만원)</label>
            <input
              type="number"
              className="input-field"
              value={input.monthlySaving}
              onChange={e => setInput({...input, monthlySaving: Number(e.target.value)})}
              placeholder="150"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">현재 자산 (만원)</label>
            <input
              type="number"
              className="input-field"
              value={input.currentAsset}
              onChange={e => setInput({...input, currentAsset: Number(e.target.value)})}
              placeholder="5000"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">목표 지역</label>
            <select
              className="input-field"
              value={input.regionId}
              onChange={e => setInput({...input, regionId: e.target.value})}
            >
              {REGIONS.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({formatMoney(r.price)})</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleSimulate} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
          <TrendingUp size={18} /> 시뮬레이션 실행
        </button>
      </div>

      {results && (
        <>
          {/* Scenario Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {results.map(r => (
              <button
                key={r.scenario.id}
                onClick={() => setActiveScenario(r.scenario.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeScenario === r.scenario.id
                    ? 'bg-[#3182F6] text-white'
                    : 'glass-hover text-gray-400'
                }`}
              >
                {r.scenario.icon} {r.scenario.name}
              </button>
            ))}
          </div>

          {activeResult && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="glass p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">현재 자산</div>
                  <div className="text-lg font-bold text-[#3182F6]">{formatMoney(input.currentAsset)}</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">목표 집값</div>
                  <div className="text-lg font-bold text-red-400">{formatMoney(region?.price || 0)}</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">현재 격차</div>
                  <div className="text-lg font-bold text-yellow-400 flex items-center justify-center gap-1">
                    <TrendingDown size={16} />
                    {formatMoney((region?.price || 0) - input.currentAsset)}
                  </div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">집 살 수 있는 시점</div>
                  <div className="text-lg font-bold flex items-center justify-center gap-1">
                    <Clock size={16} className="text-[#3182F6]" />
                    {activeResult.crossYear ? (
                      <span className="text-green-400">{activeResult.crossYear}년 ({activeResult.yearsNeeded}년 후)</span>
                    ) : (
                      <span className="text-red-400">30년 내 불가</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="glass p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">자산 vs 집값 추이</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeResult.yearData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={v => v >= 10000 ? `${Math.round(v/10000)}억` : `${v}만`} />
                      <Tooltip
                        contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        formatter={(value) => formatMoney(Number(value))}
                        labelStyle={{ color: '#999' }}
                      />
                      <Legend />
                      {activeResult.crossYear && (
                        <ReferenceLine x={activeResult.crossYear} stroke="#22c55e" strokeDasharray="5 5" label={{ value: '🎉', position: 'top' }} />
                      )}
                      <Line type="monotone" dataKey="asset" name="내 자산" stroke="#3182F6" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="housePrice" name="집값" stroke="#ef4444" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2">{activeResult.scenario.description}</p>
              </div>

              {/* Ad slot */}
              <div className="ad-slot h-[250px] mb-6">
                광고 영역 (네이티브)
              </div>

              {/* All Scenarios Comparison */}
              <div className="glass p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">시나리오별 비교</h2>
                <div className="space-y-3">
                  {results.map(r => (
                    <div key={r.scenario.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{r.scenario.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{r.scenario.name}</div>
                          <div className="text-xs text-gray-500">{r.scenario.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {r.crossYear ? (
                          <div className="text-green-400 font-bold">{r.yearsNeeded}년 후</div>
                        ) : (
                          <div className="text-red-400 font-bold">불가</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="flex gap-3 mb-16">
                <button
                  onClick={() => {
                    const text = `내 월급으로 ${region?.name} 집 사려면 ${activeResult.crossYear ? `${activeResult.yearsNeeded}년` : '30년 이상'} 걸린다고? 😱`;
                    navigator.clipboard?.writeText(text + '\n' + window.location.href);
                    alert('클립보드에 복사되었습니다!');
                  }}
                  className="glass-hover px-4 py-2 text-sm flex items-center gap-2"
                >
                  <Share2 size={16} /> 결과 공유
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
