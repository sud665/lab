# Focus Guard - 집중력 관리 크롬 익스텐션 Design Document

> **Summary**: 시간의 가치를 금액으로 환산하여 집중력을 관리하는 크롬 익스텐션
>
> **Project**: Focus Guard
> **Version**: 1.0.0
> **Author**: Claude
> **Date**: 2026-02-06
> **Status**: Draft

---

## 1. 개요 (Overview)

### 프로젝트명
**Focus Guard** - 집중력 관리 크롬 익스텐션

### 목적
습관적인 웹 서핑과 쇼츠 시청으로 인한 집중력 저하 문제를 해결하기 위한 시스템입니다. 차단이 아닌 **지속적인 인지(Awareness)**를 통해 사용자가 현재 무엇을 하고 있는지 자각하게 하고, 시간의 가치를 금액으로 환산하여 동기부여를 제공합니다.

### 핵심 컨셉
- **"시간은 금이다" (Time is Gold)**: 시급 기반 실제 금액 환산
- **인지 > 차단**: 강제 차단보다 지속적 알림으로 자율적 통제
- **보상 시스템**: 투두 완료 시 산만한 사이트 접근 권한 부여
- **두 가지 모드**: 엄격 모드 vs 자동 모드

### 타겟 사용자
- 온라인 작업이 많은 개발자, 디자이너, 기획자
- 습관적으로 새 탭을 열고 쇼츠/SNS를 보는 사람
- 시간 관리와 자기 통제를 개선하고 싶은 사람

---

## 2. 아키텍처 (Architecture)

### 크롬 익스텐션 구조

**Manifest V3 기반 구성:**

1. **Background Service Worker**
   - 작업 타이머 관리
   - 시간/금액 계산
   - 데이터 저장 (Chrome Sync Storage)
   - 탭 변경 감지

2. **Content Script**
   - 상단 고정 바 주입 (모든 웹페이지)
   - 붙여넣기 이벤트 감지
   - 산만한 사이트 감지 시 경고 오버레이
   - 실시간 금액 손실 효과

3. **New Tab Override**
   - 커스텀 대시보드 페이지
   - 투두리스트 관리
   - 통계 표시
   - 작업 시작/선택 인터페이스

4. **Popup UI**
   - 빠른 설정 (시급, 모드 전환)
   - 작업 시작/중지
   - 간단한 통계 요약

### 데이터 흐름
```
사용자 액션 → Content Script/Popup
     ↓
Background Service Worker (상태 관리)
     ↓
Chrome Sync Storage (데이터 저장)
     ↓
모든 컴포넌트 업데이트
```

---

## 3. 핵심 컴포넌트 (Core Components)

### 3.1 상단 고정 바 (Top Fixed Bar)
**위치**: 모든 웹페이지 최상단
**내용**:
- 현재 작업명
- 경과 시간 (00:00:00)
- 진행 바 (목표 대비 %)
- 획득/손실 금액 (₩ 형식)
- 현재 시각 (HH:MM)

**상태별 스타일**:
- 정상 작업 중: 금색 계열 (골드)
- 산만한 사이트: 빨간색 + 깜빡임 + "손실 중" 표시
- 작업 없음: 회색 + "작업을 시작하세요"

### 3.2 새 탭 대시보드
**레이아웃**:
- **상단**: 큰 시계 + "시간은 금이다" 문구
- **중앙 좌**: 현재 작업 + 진행 상황 + 금액
- **중앙 우**: 투두리스트 (체크박스, 최소 시간, 진행률)
- **하단**: 오늘/이번 주 통계
  - 총 집중시간
  - 획득 금액 💰
  - 손실 금액 ⚠️
  - 완료한 작업 수

**기능**:
- 작업 추가/삭제/완료
- 작업 클릭으로 시작
- 통계 탭 전환 (일간/주간/월간)

### 3.3 작업 감지 시스템
**붙여넣기 감지**:
- input, textarea, contenteditable 요소 모니터링
- 붙여넣은 텍스트 추출
- 토스트 알림: "'{텍스트}' 작업을 시작할까요?"
- [시작] [무시] 버튼

**산만한 사이트 처리**:
- 사용자 설정 목록 확인 (유튜브, 인스타 등)
- **리다이렉트 모드**: 전체 화면 경고 → 10초 후 대시보드로 이동
- **효과 모드**: 상단 바 빨간색 + 실시간 손실 금액 카운터

---

## 4. 데이터 구조 (Data Structure)

### 4.1 Chrome Sync Storage 스키마

```typescript
interface UserSettings {
  hourlyRate: number;              // 시급 (원)
  mode: 'strict' | 'auto';         // 엄격모드 / 자동모드
  distractingSites: {
    url: string;                   // 예: "youtube.com/shorts"
    name: string;                  // 예: "유튜브 쇼츠"
    action: 'redirect' | 'effect'; // 처리 방식
  }[];
  dailyGoal: {
    hours: number;                 // 일일 목표 시간
    tasks: number;                 // 일일 목표 작업 수
  };
  weeklyGoal: {
    hours: number;
  };
}

interface Task {
  id: string;
  title: string;
  minTime: number;                 // 최소 소요 시간 (분)
  startedAt?: number;              // 시작 타임스탬프
  completedAt?: number;            // 완료 타임스탬프
  totalTime: number;               // 누적 작업 시간 (초)
  isCompleted: boolean;
}

interface CurrentSession {
  taskId: string | null;           // 현재 작업 ID
  startTime: number | null;        // 세션 시작 시간
  isActive: boolean;
  accumulatedTime: number;         // 오늘 누적 시간 (초)
}

interface DailyStats {
  date: string;                    // YYYY-MM-DD
  totalFocusTime: number;          // 총 집중 시간 (초)
  totalDistractTime: number;       // 산만한 사이트 시간 (초)
  earnedMoney: number;             // 획득 금액
  lostMoney: number;               // 손실 금액
  completedTasks: number;
  tasks: Task[];
}

interface RewardStatus {
  unlimitedUntil: number | null;   // 무제한 자유시간 만료 (타임스탬프)
  bonusMinutes: number;            // 추가 작업으로 적립된 분
}
```

---

## 5. 사용자 플로우 (User Flow)

### 첫 설치 시
1. 익스텐션 설치 → 온보딩 페이지
2. 시급 설정 (예: 20,000원)
3. 모드 선택 (엄격/자동)
4. 산만한 사이트 선택 + 처리 방식 설정
5. 일일 목표 설정
6. 완료 → 대시보드로 이동

### 엄격 모드 일일 플로우
1. 브라우저/새 탭 열기 → 대시보드 강제 표시
2. 오늘 할 투두 입력
3. 작업 선택 → 타이머 시작 → 상단 바 표시
4. 작업 중 붙여넣기 감지 → 자동 작업명 제안
5. 산만한 사이트 접속 시 → 경고 또는 리다이렉트
6. 최소 시간 달성 → 수동 완료
7. 하루 목표 달성 → 무제한 자유시간

### 자동 모드 플로우
1. 자유롭게 브라우징
2. 붙여넣기 감지 시 작업 제안
3. 수락하면 타이머 시작
4. 나머지는 엄격 모드와 동일

---

## 6. 기술 스택 (Tech Stack)

| Category | Technology | Version |
|----------|------------|---------|
| Manifest | Chrome Extension Manifest | V3 |
| 언어 | TypeScript | 5.x |
| 빌드 도구 | Vite | 6.x |
| 익스텐션 플러그인 | @crxjs/vite-plugin | latest |
| UI 프레임워크 | React | 19.x |
| 스타일링 | Tailwind CSS | 4.x |
| 상태 관리 | Zustand | latest |
| 스토리지 | Chrome Storage API | - |
| 아이콘 | Lucide React | latest |
| 유틸리티 | date-fns | latest |

---

## 7. 구현 우선순위 (Implementation Priority)

### Phase 1: 핵심 기능 (MVP)
1. ✅ Manifest V3 설정 + 프로젝트 구조
2. ✅ 상단 고정 바 (작업명, 시간, 금액)
3. ✅ 새 탭 대시보드 (투두리스트)
4. ✅ Chrome Sync Storage 연동
5. ✅ 기본 타이머 로직

### Phase 2: 고급 기능
6. 붙여넣기 감지
7. 산만한 사이트 처리
8. 보상 시스템 (목표 달성 시 무제한, 추가 작업 시 1시간)
9. 통계 차트 (일간/주간/월간)

### Phase 3: 개선
10. 온보딩 페이지
11. 설정 페이지
12. 에러 핸들링 및 최적화
13. 테스트

---

## 8. 핵심 기능 상세 (Feature Details)

### 8.1 엄격 모드 vs 자동 모드

**엄격 모드 (Strict Mode)**:
- 새 탭 열 때마다 대시보드 강제 표시
- 투두리스트에서 작업 선택해야 진행 가능
- 하루 목표 미달성 시 산만한 사이트 차단/경고
- 강력한 자기 통제

**자동 모드 (Auto Mode)**:
- 새 탭은 일반 대시보드 (강제성 없음)
- 붙여넣기 감지로 자동 작업 제안
- 산만한 사이트 접속 시 경고/효과만
- 유연한 작업 방식

### 8.2 보상 시스템

**기본 목표 달성**:
- 사용자가 설정한 일일 목표 (예: 6시간 집중 또는 3개 작업 완료)
- 달성 시: 그날 하루 무제한 자유시간
- 산만한 사이트 모두 접근 가능

**추가 작업 완료**:
- 일일 목표 초과 달성 시
- 작업 1개당 1시간 추가 자유시간
- 적립된 시간은 다음 날로 이월 가능

### 8.3 금액 환산 시스템

**획득 금액 (Earned)**:
- 작업 중 집중 시간 × (시급 / 60분)
- 예: 30분 집중, 시급 20,000원 → 10,000원 획득

**손실 금액 (Lost)**:
- 산만한 사이트 시간 × (시급 / 60분)
- 예: 유튜브 쇼츠 15분, 시급 20,000원 → 5,000원 손실

---

## 9. UI/UX 디자인 가이드

### 9.1 색상 시스템

**상단 고정 바**:
- 정상: 금색 그라데이션 (#FFD700 → #FFA500)
- 경고: 빨간색 (#EF4444) + 깜빡임 애니메이션
- 비활성: 회색 (#6B7280)

**대시보드**:
- 배경: 다크 모드 (#0F172A)
- 강조: 금색 (#FFD700)
- 텍스트: 흰색 (#FFFFFF) / 회색 (#94A3B8)
- 성공: 초록색 (#10B981)
- 경고: 빨간색 (#EF4444)

### 9.2 타이포그래피

- 제목: 24-32px, Bold
- 본문: 14-16px, Regular
- 시간/금액: 20-28px, Bold, Monospace
- 버튼: 14px, Medium

---

## 10. 성공 지표 (Success Metrics)

### 기술적 성공 기준
- Chrome Web Store 배포 가능
- Manifest V3 정책 준수
- 메모리 사용량 < 50MB
- CPU 사용량 최소화 (백그라운드 < 1%)

### 사용자 경험 기준
- 설치 후 5분 내 첫 작업 시작
- 상단 바 표시 지연 < 100ms
- 데이터 동기화 오류율 < 1%

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-06 | Initial design document | Claude |
