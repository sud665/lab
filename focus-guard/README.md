# Focus Guard ⏰💰

> **시간은 금이다** - 집중력 관리 크롬 익스텐션

## 개요

Focus Guard는 습관적인 웹 서핑과 쇼츠 시청으로 인한 집중력 저하를 해결하는 크롬 익스텐션입니다.
차단이 아닌 **지속적인 인지(Awareness)**를 통해 사용자가 현재 무엇을 하고 있는지 자각하게 하고,
시간의 가치를 실제 금액으로 환산하여 강력한 동기부여를 제공합니다.

## 주요 기능

### 🎯 상단 고정 바
- 모든 웹페이지 상단에 표시
- 현재 작업명, 경과 시간, 진행률
- 실시간 금액 환산 (획득/손실)
- 현재 시각 표시

### 📊 대시보드 (새 탭)
- 투두리스트 관리
- 작업 시작/완료
- 오늘 통계 (집중시간, 획득 금액, 완료 작업)
- 일간/주간 목표 설정

### 🔄 두 가지 모드
- **엄격 모드**: 새 탭마다 대시보드 강제 표시, 작업 선택 필수
- **자동 모드**: 자유로운 브라우징, 붙여넣기 감지로 자동 작업 제안

### 📋 붙여넣기 자동 감지
- 검색창/입력창 붙여넣기 감지
- 자동으로 작업 시작 제안
- 자연스러운 작업 전환

### 🚫 산만한 사이트 관리
- 유튜브 쇼츠, 인스타그램 등 설정
- **리다이렉트 모드**: 접속 시 대시보드로 이동
- **효과 모드**: 상단 바 빨간색 + 실시간 손실 금액 표시

### 🎁 보상 시스템
- 하루 목표 달성 시: 무제한 자유시간
- 추가 작업 완료 시: 작업당 1시간 추가

### 💾 Chrome Sync 동기화
- 여러 기기에서 자동 동기화
- 별도 로그인 불필요

## 기술 스택

- **Manifest**: V3
- **언어**: TypeScript
- **빌드**: Vite 6 + @crxjs/vite-plugin
- **UI**: React 19 + Tailwind CSS v4
- **상태 관리**: Zustand
- **스토리지**: Chrome Storage API
- **아이콘**: Lucide React
- **유틸리티**: date-fns

## 개발 환경 설정

### 필수 요구사항
- Node.js 20.x 이상
- npm 또는 pnpm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build
```

### 크롬에 로드

1. `npm run dev` 또는 `npm run build` 실행
2. Chrome 브라우저에서 `chrome://extensions` 접속
3. 우측 상단 "개발자 모드" 활성화
4. "압축 해제된 확장 프로그램 로드" 클릭
5. `dist` 폴더 선택

## 프로젝트 구조

```
focus-guard/
├── src/
│   ├── background/          # Background Service Worker
│   │   └── service-worker.ts
│   ├── content/             # Content Scripts
│   │   ├── TopBar.tsx
│   │   ├── content.ts
│   │   └── top-bar.css
│   ├── newtab/              # New Tab Override
│   │   ├── Dashboard.tsx
│   │   ├── index.tsx
│   │   └── index.html
│   ├── popup/               # Extension Popup
│   │   ├── Popup.tsx
│   │   ├── index.tsx
│   │   └── index.html
│   ├── shared/              # Shared Code
│   │   ├── components/
│   │   ├── store/           # Zustand Store
│   │   ├── types/           # TypeScript Types
│   │   └── utils/           # Utility Functions
│   └── styles/
│       └── global.css
├── public/
│   └── icons/
├── manifest.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 사용 방법

### 초기 설정
1. 익스텐션 설치 후 팝업 열기
2. 시급 설정 (예: 20,000원)
3. 모드 선택 (엄격/자동)
4. 산만한 사이트 및 처리 방식 설정

### 작업 시작
1. 새 탭 열기 → 대시보드
2. "오늘 할 일"에 작업 추가
3. 작업 클릭하여 시작
4. 상단 바에서 진행 상황 확인

### 작업 완료
1. 최소 시간 달성 후 체크박스 클릭
2. 하루 목표 달성 시 산만한 사이트 자유 접근

## 라이선스

MIT License

## 개발

- 디자인 문서: `docs/plans/2026-02-06-focus-guard-design.md`
- 버그 리포트 및 제안은 Issues에 남겨주세요

---

**⏰ 시간은 금이다 💰**
