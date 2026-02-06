// 공통 사용자 데이터, 상태 맵, 유틸리티

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  { id: 'u1', name: '김민수', email: 'minsu.kim@example.com', role: '관리자' },
  { id: 'u2', name: '이서연', email: 'seoyeon.lee@example.com', role: '매니저' },
  { id: 'u3', name: '박지훈', email: 'jihun.park@example.com', role: '일반회원' },
  { id: 'u4', name: '최유진', email: 'yujin.choi@example.com', role: '일반회원' },
  { id: 'u5', name: '정하늘', email: 'haneul.jung@example.com', role: '매니저' },
];

export const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: '활성', color: 'text-white' },
  inactive: { label: '비활성', color: 'text-neutral-500' },
  pending: { label: '대기중', color: 'text-neutral-400' },
  approved: { label: '승인됨', color: 'text-white' },
  rejected: { label: '거절됨', color: 'text-neutral-500' },
  completed: { label: '완료', color: 'text-white' },
  cancelled: { label: '취소됨', color: 'text-neutral-600' },
};

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}
