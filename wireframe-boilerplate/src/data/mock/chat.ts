// 채팅/메시지 패턴용 목업 데이터

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'u2',
    senderName: '이서연',
    message: '안녕하세요, 이번 달 세미나 일정 확정되었나요?',
    timestamp: '2025-01-15T09:00:00',
    isOwn: false,
  },
  {
    id: 'msg2',
    senderId: 'u1',
    senderName: '김민수',
    message: '네, 2월 12일로 확정되었습니다. 장소는 컨벤션홀 2층이에요.',
    timestamp: '2025-01-15T09:02:00',
    isOwn: true,
  },
  {
    id: 'msg3',
    senderId: 'u2',
    senderName: '이서연',
    message: '감사합니다! 참가 인원은 몇 명 정도 예상하시나요?',
    timestamp: '2025-01-15T09:03:00',
    isOwn: false,
  },
  {
    id: 'msg4',
    senderId: 'u1',
    senderName: '김민수',
    message: '현재 등록된 인원은 35명이고, 최대 50명까지 수용 가능합니다.',
    timestamp: '2025-01-15T09:05:00',
    isOwn: true,
  },
  {
    id: 'msg5',
    senderId: 'u2',
    senderName: '이서연',
    message: '알겠습니다. 발표 자료는 언제까지 준비하면 될까요?',
    timestamp: '2025-01-15T09:07:00',
    isOwn: false,
  },
  {
    id: 'msg6',
    senderId: 'u1',
    senderName: '김민수',
    message: '2월 5일까지 초안을 보내주시면 검토 후 피드백 드리겠습니다.',
    timestamp: '2025-01-15T09:10:00',
    isOwn: true,
  },
];
