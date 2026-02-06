// 설정 패턴용 목업 데이터

export interface SettingsItem {
  id: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'toggle' | 'select';
  value: string | number | boolean;
  options?: { label: string; value: string }[];
}

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  items: SettingsItem[];
}

export const mockSettingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: '일반',
    description: '서비스의 기본 설정을 관리합니다.',
    items: [
      {
        id: 'site-name',
        label: '사이트 이름',
        description: '서비스에 표시되는 사이트 이름을 설정합니다.',
        type: 'text',
        value: '와이어프레임 관리자',
      },
      {
        id: 'language',
        label: '언어',
        description: '서비스에서 사용할 기본 언어를 선택합니다.',
        type: 'select',
        value: 'ko',
        options: [
          { label: '한국어', value: 'ko' },
          { label: 'English', value: 'en' },
          { label: '日本語', value: 'ja' },
        ],
      },
      {
        id: 'timezone',
        label: '시간대',
        description: '서비스에서 사용할 시간대를 선택합니다.',
        type: 'select',
        value: 'Asia/Seoul',
        options: [
          { label: '서울 (UTC+9)', value: 'Asia/Seoul' },
          { label: '도쿄 (UTC+9)', value: 'Asia/Tokyo' },
          { label: '뉴욕 (UTC-5)', value: 'America/New_York' },
          { label: '런던 (UTC+0)', value: 'Europe/London' },
        ],
      },
      {
        id: 'items-per-page',
        label: '페이지당 항목 수',
        description: '목록에서 한 페이지에 표시할 항목 수를 설정합니다.',
        type: 'number',
        value: 20,
      },
      {
        id: 'dark-mode',
        label: '다크 모드',
        description: '다크 모드를 활성화합니다.',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    id: 'notifications',
    title: '알림',
    description: '알림 수신 방법과 종류를 설정합니다.',
    items: [
      {
        id: 'email-notifications',
        label: '이메일 알림',
        description: '중요한 업데이트를 이메일로 수신합니다.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'push-notifications',
        label: '푸시 알림',
        description: '브라우저 푸시 알림을 활성화합니다.',
        type: 'toggle',
        value: false,
      },
      {
        id: 'notification-sound',
        label: '알림 소리',
        description: '새 알림 수신 시 소리를 재생합니다.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'digest-frequency',
        label: '요약 알림 주기',
        description: '알림 요약을 받을 주기를 설정합니다.',
        type: 'select',
        value: 'daily',
        options: [
          { label: '실시간', value: 'realtime' },
          { label: '매일', value: 'daily' },
          { label: '매주', value: 'weekly' },
          { label: '사용 안 함', value: 'never' },
        ],
      },
    ],
  },
  {
    id: 'security',
    title: '보안',
    description: '계정 보안 및 접근 권한을 관리합니다.',
    items: [
      {
        id: 'two-factor',
        label: '2단계 인증',
        description: '로그인 시 추가 인증 단계를 활성화합니다.',
        type: 'toggle',
        value: false,
      },
      {
        id: 'session-timeout',
        label: '세션 만료 시간 (분)',
        description: '비활동 시 자동 로그아웃까지의 시간을 설정합니다.',
        type: 'number',
        value: 30,
      },
      {
        id: 'login-alert',
        label: '로그인 알림',
        description: '새로운 기기에서 로그인 시 알림을 보냅니다.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'password-expiry',
        label: '비밀번호 변경 주기',
        description: '비밀번호를 정기적으로 변경하도록 알림을 받습니다.',
        type: 'select',
        value: '90days',
        options: [
          { label: '30일', value: '30days' },
          { label: '60일', value: '60days' },
          { label: '90일', value: '90days' },
          { label: '사용 안 함', value: 'never' },
        ],
      },
    ],
  },
];
