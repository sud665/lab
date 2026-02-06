// 캘린더/일정 패턴용 목업 데이터

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  location?: string;
}

export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: '정기 운영회의',
    description: '월간 운영 현황 리뷰 및 다음 달 계획 수립',
    date: '2025-02-03',
    startTime: '10:00',
    endTime: '11:30',
    category: '회의',
    location: '본사 3층 회의실',
  },
  {
    id: 'e2',
    title: '신규 회원 오리엔테이션',
    description: '1월 가입 신규 회원 대상 오리엔테이션 진행',
    date: '2025-02-05',
    startTime: '14:00',
    endTime: '15:00',
    category: '교육',
    location: '교육센터 A동',
  },
  {
    id: 'e3',
    title: '시스템 정기 점검',
    description: '서버 및 데이터베이스 정기 점검',
    date: '2025-02-08',
    startTime: '02:00',
    endTime: '06:00',
    category: '점검',
  },
  {
    id: 'e4',
    title: '2월 정기 세미나',
    description: '최신 트렌드 분석 및 사례 공유 세미나',
    date: '2025-02-12',
    startTime: '13:00',
    endTime: '17:00',
    category: '세미나',
    location: '컨벤션홀 2층',
  },
  {
    id: 'e5',
    title: '팀 빌딩 워크숍',
    description: '상반기 팀 빌딩 및 커뮤니케이션 워크숍',
    date: '2025-02-14',
    startTime: '09:00',
    endTime: '18:00',
    category: '이벤트',
    location: '야외 연수원',
  },
  {
    id: 'e6',
    title: '분기 실적 보고',
    description: '1분기 실적 중간 점검 및 보고',
    date: '2025-02-20',
    startTime: '15:00',
    endTime: '16:30',
    category: '회의',
    location: '본사 5층 대회의실',
  },
  {
    id: 'e7',
    title: '장비 안전 교육',
    description: '장비 사용법 및 안전 수칙 정기 교육',
    date: '2025-02-25',
    startTime: '10:00',
    endTime: '12:00',
    category: '교육',
    location: '교육센터 B동',
  },
];

export interface AttendanceRecord {
  date: string;
  total: number;
  present: number;
  absent: number;
  late: number;
}

export const mockAttendance: AttendanceRecord[] = [
  {
    date: '2025-02-03',
    total: 48,
    present: 42,
    absent: 4,
    late: 2,
  },
  {
    date: '2025-02-04',
    total: 48,
    present: 45,
    absent: 2,
    late: 1,
  },
  {
    date: '2025-02-05',
    total: 48,
    present: 40,
    absent: 5,
    late: 3,
  },
  {
    date: '2025-02-06',
    total: 48,
    present: 44,
    absent: 3,
    late: 1,
  },
];
