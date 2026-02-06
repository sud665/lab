// 대시보드 패턴용 목업 데이터

export interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon?: string;
}

export const mockStats: StatCard[] = [
  {
    id: 's1',
    label: '총 회원수',
    value: '1,284',
    change: '+12.5%',
    changeType: 'up',
  },
  {
    id: 's2',
    label: '월간 매출',
    value: '₩8,450,000',
    change: '+8.2%',
    changeType: 'up',
  },
  {
    id: 's3',
    label: '신규 가입',
    value: '48',
    change: '-3.1%',
    changeType: 'down',
  },
  {
    id: 's4',
    label: '활성 이용률',
    value: '92.4%',
    change: '+0.8%',
    changeType: 'up',
  },
];

export interface ChartDataPoint {
  name: string;
  value: number;
}

export const mockMonthlyRevenue: ChartDataPoint[] = [
  { name: '1월', value: 6500000 },
  { name: '2월', value: 5900000 },
  { name: '3월', value: 7200000 },
  { name: '4월', value: 6800000 },
  { name: '5월', value: 7800000 },
  { name: '6월', value: 8100000 },
  { name: '7월', value: 7500000 },
  { name: '8월', value: 8450000 },
  { name: '9월', value: 7900000 },
  { name: '10월', value: 8200000 },
  { name: '11월', value: 8800000 },
  { name: '12월', value: 9100000 },
];

export const mockMemberGrowth: ChartDataPoint[] = [
  { name: '1월', value: 980 },
  { name: '2월', value: 1020 },
  { name: '3월', value: 1055 },
  { name: '4월', value: 1090 },
  { name: '5월', value: 1130 },
  { name: '6월', value: 1165 },
  { name: '7월', value: 1190 },
  { name: '8월', value: 1220 },
  { name: '9월', value: 1240 },
  { name: '10월', value: 1258 },
  { name: '11월', value: 1270 },
  { name: '12월', value: 1284 },
];

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export const mockCategoryDistribution: CategoryData[] = [
  { name: '멤버십', value: 4200000, percentage: 42 },
  { name: '교육', value: 2800000, percentage: 28 },
  { name: '장비', value: 1800000, percentage: 18 },
  { name: '이벤트', value: 1200000, percentage: 12 },
];

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'a1',
    user: '김민수',
    action: '회원 승인',
    target: '오준서',
    timestamp: '2025-01-15T09:35:00',
  },
  {
    id: 'a2',
    user: '이서연',
    action: '상품 등록',
    target: '대회 참가권 (개인전)',
    timestamp: '2025-01-15T09:20:00',
  },
  {
    id: 'a3',
    user: '박지훈',
    action: '결제 완료',
    target: '프리미엄 멤버십 (1개월)',
    timestamp: '2025-01-15T08:50:00',
  },
  {
    id: 'a4',
    user: '최유진',
    action: '문의 등록',
    target: '환불 요청 관련',
    timestamp: '2025-01-15T08:30:00',
  },
  {
    id: 'a5',
    user: '정하늘',
    action: '일정 등록',
    target: '2월 정기 세미나',
    timestamp: '2025-01-15T08:15:00',
  },
  {
    id: 'a6',
    user: '강도윤',
    action: '리뷰 작성',
    target: '기초 트레이닝 패키지',
    timestamp: '2025-01-14T17:45:00',
  },
  {
    id: 'a7',
    user: '윤서현',
    action: '프로필 수정',
    target: '연락처 변경',
    timestamp: '2025-01-14T16:20:00',
  },
  {
    id: 'a8',
    user: '한소희',
    action: '보고서 생성',
    target: '월간 매출 리포트',
    timestamp: '2025-01-14T15:00:00',
  },
];
