# 3D Motion Landing Page - 설계 문서

## 개요

3D 모션이 풍부한 포트폴리오/쇼케이스 인터랙티브 랜딩페이지. 스크롤 스냅 기반으로 5개 섹션이 전환되며, 각 섹션에 Spline 또는 React Three Fiber 3D 씬이 포함된다.

## 기술 스택

| 기술 | 용도 |
|------|------|
| Next.js 16 (App Router) | 프레임워크 |
| React 19 | UI |
| TypeScript (strict) | 타입 시스템 |
| `@splinetool/react-spline` | Spline 3D 씬 임베드 |
| `@react-three/fiber` | React에서 Three.js 사용 |
| `@react-three/drei` | R3F 유틸리티 (OrbitControls, Text3D 등) |
| `three` | Three.js 코어 |
| `framer-motion` | 스크롤/UI 애니메이션 |
| Tailwind CSS v4 | 스타일링 |
| `next/font` (Geist Sans) | 폰트 최적화 |

## 프로젝트 구조

```
3d-motion/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (다크테마, 폰트)
│   │   └── page.tsx                # 메인 랜딩페이지 (섹션 조합)
│   ├── components/
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx     # Hero: 풀스크린 3D + 타이틀
│   │   │   ├── AboutSection.tsx    # About: 텍스트 + 3D 오브젝트
│   │   │   ├── WorksSection.tsx    # Works: 가로 스크롤 카드 갤러리
│   │   │   ├── SkillsSection.tsx   # Skills: 3D 기술 스택 시각화
│   │   │   └── ContactSection.tsx  # Contact: 연락처 + 앰비언트 3D
│   │   ├── ui/
│   │   │   ├── SplineScene.tsx     # Spline 래퍼 (lazy load + fallback)
│   │   │   ├── R3FCanvas.tsx       # R3F Canvas 래퍼 (lazy load)
│   │   │   ├── ScrollSnap.tsx      # 스크롤 스냅 컨테이너
│   │   │   └── AnimatedText.tsx    # 텍스트 등장 애니메이션
│   │   └── layout/
│   │       └── Navigation.tsx      # 플로팅 dot indicator 네비게이션
│   └── lib/
│       └── cn.ts                   # clsx + tailwind-merge
├── public/
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

## 섹션별 상세 설계

### 1. Hero Section
- **배경**: 전체 화면 Spline 3D 씬 (또는 R3F 파티클/지오메트리)
- **콘텐츠**: 중앙 정렬 대형 타이틀 + 서브타이틀 + CTA 버튼
- **애니메이션**: 페이지 로드 시 텍스트 stagger 페이드인, 3D 씬은 마우스 추적으로 미세 반응
- **아래 화살표**: 바운스 애니메이션으로 스크롤 유도

### 2. About Section
- **레이아웃**: 좌측 텍스트 + 우측 3D 오브젝트
- **3D**: R3F로 회전하는 지오메트리 또는 Spline 씬
- **애니메이션**: `whileInView`로 텍스트 슬라이드인, 3D 오브젝트 스케일업

### 3. Works/Projects Section
- **레이아웃**: 가로 스크롤 카드 갤러리 (섹션 내부 횡스크롤)
- **카드**: 호버 시 3D tilt 효과 (perspective transform) + 글로우
- **배경**: R3F 파티클 필드 또는 그라디언트 메쉬

### 4. Skills/Tech Section
- **레이아웃**: 3D 공간에 떠있는 기술 스택 아이콘들 (R3F)
- **인터랙션**: 호버하면 해당 기술 상세 정보 표시
- **애니메이션**: 섹션 진입 시 아이콘들이 랜덤 위치에서 제자리로 모이는 효과

### 5. Contact Section
- **레이아웃**: 연락처/소셜 링크 + 배경 3D 앰비언트 효과
- **애니메이션**: 텍스트 타이핑 효과 + 미니멀 3D 배경

## 네비게이션

- 화면 우측 고정 **dot indicator** (5개 점)
- 현재 활성 섹션 dot 확장/강조 (인디고 액센트)
- dot 클릭 시 해당 섹션으로 스무스 스크롤
- `IntersectionObserver`로 현재 섹션 추적

## 스크롤 스냅 시스템

```css
scroll-snap-type: y mandatory;
/* 각 섹션 */
scroll-snap-align: start;
height: 100vh;
```

## 애니메이션 패턴 (Framer Motion)

| 패턴 | 효과 |
|------|------|
| 텍스트 등장 | stagger children + `y: 30→0` + `opacity: 0→1` |
| 3D 씬 등장 | `scale: 0.8→1` + `opacity: 0→1` |
| 카드 호버 | `rotateX/Y` perspective tilt + `boxShadow` 글로우 |
| 섹션 전환 | `whileInView` 뷰포트 진입 시 트리거 (threshold: 0.3) |

## 성능 최적화

- Spline/R3F 컴포넌트: `next/dynamic` lazy load (SSR 비활성화)
- 뷰포트 밖 3D 씬: 렌더링 중지 (`frameloop="demand"`)
- GPU 가속: `will-change: transform`
- 폰트: `next/font`로 FOUT 방지

## 컬러 시스템

| 용도 | 값 |
|------|-----|
| 배경 | `#050505` (섹션별 미세 변주) |
| 텍스트 (메인) | `#f5f5f5` |
| 텍스트 (서브) | `#a0a0a0` |
| 액센트 | `#6366f1` (인디고) |
| 글로우 | 액센트 기반 `box-shadow` / `text-shadow` |
| 그라디언트 | 섹션 경계 radial gradient 오버레이 |

## 타이포그래피

| 요소 | 스타일 |
|------|--------|
| Hero 타이틀 | `text-6xl md:text-8xl font-bold tracking-tight` |
| 섹션 타이틀 | `text-4xl md:text-5xl font-semibold` |
| 본문 | `text-lg text-neutral-400 leading-relaxed` |
| 폰트 | Geist Sans (next/font) |

## 반응형

- **모바일**: 3D 씬 크기 축소, 텍스트 중앙 정렬, 카드 세로 스택
- **태블릿**: 2열 그리드
- **데스크톱**: 풀 레이아웃

## 구현 순서

1. 프로젝트 초기화 (Next.js 16 + 의존성 설치)
2. 레이아웃 + 스크롤 스냅 컨테이너 + 네비게이션
3. Hero 섹션 (placeholder 3D + 텍스트 애니메이션)
4. About 섹션
5. Works 섹션 (카드 갤러리 + tilt 효과)
6. Skills 섹션 (R3F 3D 시각화)
7. Contact 섹션
8. 성능 최적화 + 반응형 마무리
