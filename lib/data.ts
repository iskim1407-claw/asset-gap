// 서울 지역별 평균 아파트 시세 (KB부동산 2026.01 기준, 억원)
export const REGIONS = [
  { id: 'gangnam', name: '강남구', price: 250000, growth: 0.06 },
  { id: 'seocho', name: '서초구', price: 220000, growth: 0.06 },
  { id: 'songpa', name: '송파구', price: 180000, growth: 0.055 },
  { id: 'yongsan', name: '용산구', price: 200000, growth: 0.06 },
  { id: 'mapo', name: '마포구', price: 140000, growth: 0.055 },
  { id: 'seongdong', name: '성동구', price: 130000, growth: 0.05 },
  { id: 'gwangjin', name: '광진구', price: 120000, growth: 0.05 },
  { id: 'dongjak', name: '동작구', price: 110000, growth: 0.05 },
  { id: 'yangcheon', name: '양천구', price: 100000, growth: 0.045 },
  { id: 'nowon', name: '노원구', price: 70000, growth: 0.04 },
  { id: 'dobong', name: '도봉구', price: 60000, growth: 0.04 },
  { id: 'jungnang', name: '중랑구', price: 65000, growth: 0.04 },
  { id: 'gyeonggi', name: '경기도 평균', price: 55000, growth: 0.035 },
] as const;

// 연봉 분위 (통계청 2025, 만원)
export const SALARY_STATS = {
  median: 3600,
  average: 4200,
  top10: 7800,
  top1: 15000,
  percentiles: [
    { label: '하위 25%', value: 2400 },
    { label: '중위 50%', value: 3600 },
    { label: '상위 25%', value: 5400 },
    { label: '상위 10%', value: 7800 },
    { label: '상위 1%', value: 15000 },
  ],
};

// 30대 자산 통계 (만원)
export const ASSET_STATS_30S = {
  median: 8000,
  average: 15000,
  top10: 45000,
};

export const RATES = {
  inflation: 0.025,
  deposit: 0.035,
  stock: 0.07,
  seoulGrowth: 0.06,
  gyeonggiGrowth: 0.04,
};

export type Scenario = {
  id: string;
  name: string;
  icon: string;
  monthlySavingsMultiplier: number;
  investmentReturn: number;
  extraIncome: number; // 만원/월
  description: string;
};

export const SCENARIOS: Scenario[] = [
  { id: 'current', name: '현 유지', icon: '📊', monthlySavingsMultiplier: 1, investmentReturn: RATES.deposit, extraIncome: 0, description: '현재 저축 패턴 유지, 예금 금리 적용' },
  { id: 'frugal', name: '절약 모드', icon: '💰', monthlySavingsMultiplier: 1.3, investmentReturn: RATES.deposit, extraIncome: 0, description: '저축액 30% 증가, 예금 금리 적용' },
  { id: 'invest', name: '투자 병행', icon: '📈', monthlySavingsMultiplier: 1, investmentReturn: RATES.stock, extraIncome: 0, description: '현재 저축 + 주식 평균 수익률 7% 적용' },
  { id: 'hustle', name: '부업 추가', icon: '🔥', monthlySavingsMultiplier: 1.3, investmentReturn: RATES.stock, extraIncome: 150, description: '절약 + 투자 + 월 150만원 부업 수입' },
];

export interface SimulationInput {
  monthlySalary: number;    // 만원
  monthlySaving: number;    // 만원
  currentAsset: number;     // 만원
  regionId: string;
}

export interface YearData {
  year: number;
  asset: number;
  housePrice: number;
  gap: number;
}

export interface SimulationResult {
  scenario: Scenario;
  yearData: YearData[];
  crossYear: number | null; // 집 살 수 있는 연도
  yearsNeeded: number | null;
}

export function simulate(input: SimulationInput, scenario: Scenario, years: number = 30): SimulationResult {
  const region = REGIONS.find(r => r.id === input.regionId) || REGIONS[0];
  let asset = input.currentAsset;
  let housePrice = region.price;
  const monthlySaving = input.monthlySaving * scenario.monthlySavingsMultiplier + scenario.extraIncome;
  const yearData: YearData[] = [];
  let crossYear: number | null = null;

  const currentYear = new Date().getFullYear();

  for (let i = 0; i <= years; i++) {
    yearData.push({
      year: currentYear + i,
      asset: Math.round(asset),
      housePrice: Math.round(housePrice),
      gap: Math.round(housePrice - asset),
    });

    if (asset >= housePrice && crossYear === null && i > 0) {
      crossYear = currentYear + i;
    }

    // Next year
    asset = asset * (1 + scenario.investmentReturn) + monthlySaving * 12;
    housePrice = housePrice * (1 + region.growth);
  }

  return {
    scenario,
    yearData,
    crossYear,
    yearsNeeded: crossYear ? crossYear - currentYear : null,
  };
}

export function formatMoney(amount: number): string {
  if (amount >= 10000) {
    const uk = Math.floor(amount / 10000);
    const man = amount % 10000;
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만원` : `${uk}억원`;
  }
  return `${amount.toLocaleString()}만원`;
}

export function getSalaryPercentile(annualSalary: number): string {
  if (annualSalary >= 15000) return '상위 1%';
  if (annualSalary >= 7800) return '상위 10%';
  if (annualSalary >= 5400) return '상위 25%';
  if (annualSalary >= 3600) return '상위 50%';
  return '하위 50%';
}
