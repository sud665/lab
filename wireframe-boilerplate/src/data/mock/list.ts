// 리스트/테이블 패턴용 목업 데이터

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
}

export const mockMembers: Member[] = [
  {
    id: 'm1',
    name: '김민수',
    email: 'minsu.kim@example.com',
    phone: '010-1234-5678',
    role: '관리자',
    status: 'active',
    joinedAt: '2024-03-15',
  },
  {
    id: 'm2',
    name: '이서연',
    email: 'seoyeon.lee@example.com',
    phone: '010-2345-6789',
    role: '매니저',
    status: 'active',
    joinedAt: '2024-05-22',
  },
  {
    id: 'm3',
    name: '박지훈',
    email: 'jihun.park@example.com',
    phone: '010-3456-7890',
    role: '일반회원',
    status: 'active',
    joinedAt: '2024-06-10',
  },
  {
    id: 'm4',
    name: '최유진',
    email: 'yujin.choi@example.com',
    phone: '010-4567-8901',
    role: '일반회원',
    status: 'pending',
    joinedAt: '2024-08-01',
  },
  {
    id: 'm5',
    name: '정하늘',
    email: 'haneul.jung@example.com',
    phone: '010-5678-9012',
    role: '매니저',
    status: 'active',
    joinedAt: '2024-07-18',
  },
  {
    id: 'm6',
    name: '강도윤',
    email: 'doyun.kang@example.com',
    phone: '010-6789-0123',
    role: '일반회원',
    status: 'inactive',
    joinedAt: '2024-04-05',
  },
  {
    id: 'm7',
    name: '윤서현',
    email: 'seohyun.yoon@example.com',
    phone: '010-7890-1234',
    role: '일반회원',
    status: 'active',
    joinedAt: '2024-09-12',
  },
  {
    id: 'm8',
    name: '임재원',
    email: 'jaewon.lim@example.com',
    phone: '010-8901-2345',
    role: '일반회원',
    status: 'active',
    joinedAt: '2024-10-03',
  },
  {
    id: 'm9',
    name: '한소희',
    email: 'sohee.han@example.com',
    phone: '010-9012-3456',
    role: '매니저',
    status: 'pending',
    joinedAt: '2024-11-20',
  },
  {
    id: 'm10',
    name: '오준서',
    email: 'junseo.oh@example.com',
    phone: '010-0123-4567',
    role: '일반회원',
    status: 'active',
    joinedAt: '2024-12-01',
  },
];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '프리미엄 멤버십 (1개월)',
    category: '멤버십',
    price: 99000,
    stock: 999,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: 'p2',
    name: '프리미엄 멤버십 (12개월)',
    category: '멤버십',
    price: 990000,
    stock: 999,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: 'p3',
    name: '기초 트레이닝 패키지',
    category: '교육',
    price: 250000,
    stock: 30,
    status: 'active',
    createdAt: '2024-03-15',
  },
  {
    id: 'p4',
    name: '심화 과정 (온라인)',
    category: '교육',
    price: 180000,
    stock: 50,
    status: 'active',
    createdAt: '2024-04-20',
  },
  {
    id: 'p5',
    name: '공식 유니폼 세트',
    category: '장비',
    price: 85000,
    stock: 120,
    status: 'active',
    createdAt: '2024-02-28',
  },
  {
    id: 'p6',
    name: '보호대 풀세트',
    category: '장비',
    price: 145000,
    stock: 45,
    status: 'active',
    createdAt: '2024-05-10',
  },
  {
    id: 'p7',
    name: '대회 참가권 (개인전)',
    category: '이벤트',
    price: 50000,
    stock: 200,
    status: 'pending',
    createdAt: '2024-06-01',
  },
  {
    id: 'p8',
    name: '단체 워크숍 (10인)',
    category: '이벤트',
    price: 350000,
    stock: 0,
    status: 'inactive',
    createdAt: '2024-07-15',
  },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: '새 회원 가입',
    message: '오준서님이 새로 가입했습니다.',
    type: 'info',
    read: false,
    createdAt: '2025-01-15T09:30:00',
  },
  {
    id: 'n2',
    title: '결제 완료',
    message: '프리미엄 멤버십 결제가 완료되었습니다.',
    type: 'success',
    read: false,
    createdAt: '2025-01-15T08:15:00',
  },
  {
    id: 'n3',
    title: '재고 부족 알림',
    message: '보호대 풀세트 재고가 5개 이하입니다.',
    type: 'warning',
    read: true,
    createdAt: '2025-01-14T16:45:00',
  },
  {
    id: 'n4',
    title: '시스템 점검 예정',
    message: '1월 20일 02:00~06:00 서버 점검이 예정되어 있습니다.',
    type: 'info',
    read: true,
    createdAt: '2025-01-14T10:00:00',
  },
  {
    id: 'n5',
    title: '결제 실패',
    message: '카드 결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
    type: 'error',
    read: false,
    createdAt: '2025-01-13T14:20:00',
  },
];
