# Arcade Redesign — Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Scope:** 전체 시각 리디자인 (게임 로직 변경 없음)

---

## 1. 목표

과일 게임의 전체 UI/UX를 팩맨 스타일의 도트 디자인 오락실 느낌으로 변경한다.
게임 엔진 로직(물리, 충돌, 합치기)은 건드리지 않는다.

---

## 2. 컬러 팔레트

| 역할 | 색상 | 코드 |
|------|------|------|
| 전체 배경 | 어두운 남색 | `#0a0a1a` |
| 캔버스 배경 | 순수 검정 | `#000000` |
| 타이틀 텍스트 | 팩맨 황금 | `#FFE000` |
| UI 레이블 / 테두리 | 시안 네온 | `#00ffff` |
| 액센트 / HI SCORE | 핑크 네온 | `#ff00ff` |
| 스폰 라인 | 붉은 경고 | `#ff0055` |
| 점수 숫자 | 흰색 | `#ffffff` |
| 비활성 텍스트 | 어두운 회색 | `#555555` |

---

## 3. 타이포그래피

- **폰트**: `Press Start 2P` (Google Fonts) — 전체 UI 통일
- 로드: `<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">`

| 용도 | 크기 |
|------|------|
| 게임 타이틀 | 14px (canvas) / 11px (HTML) |
| 점수 레이블 (1UP, HI) | 7–8px |
| 점수 숫자 | 10–11px |
| 캔버스 GAME OVER | 32px |
| 조작 안내 | 7px |

---

## 4. UI 레이아웃 (HTML)

```
┌──────────────────────────────┐
│     ★ FRUIT GAME ★           │  ← #FFE000, 글로우
│  1UP        HI SCORE  LEVEL  │  ← #00ffff 레이블
│  08640      99999      01    │  ← #fff 숫자
│ ┌────────────────────────┐   │
│ │  [캔버스 400×600]       │   │  ← #00ffff 테두리
│ └────────────────────────┘   │
│  NEXT: [픽셀과일]  ← → SPACE  │
└──────────────────────────────┘
```

**변경 파일**: `src/components/GameUI.tsx`
- 전체 배경: `bg-[#0a0a1a]`
- 타이틀: `★ FRUIT GAME ★` (이모지 제거), Press Start 2P, #FFE000
- 점수판: 1UP / HI SCORE / LEVEL 3열 구조
- 버튼: `PRESS START` 스타일 (핑크 테두리, 깜박임)
- 조작 안내: 하단 희미한 텍스트

---

## 5. Canvas 렌더링 변경

**변경 파일**: `src/components/Game.tsx` (gameLoop 내부)

### 5-1. 배경
```ts
// Before
ctx.fillStyle = '#f5f5f5';
// After
ctx.fillStyle = '#000000';
```

### 5-2. 스폰 라인
```ts
// Before: 빨간 점선
ctx.strokeStyle = 'rgba(255,0,0,0.3)'; ctx.setLineDash([5, 5]);
// After: 네온 붉은 실선
ctx.strokeStyle = 'rgba(255,0,85,0.5)'; ctx.setLineDash([4, 4]);
```

### 5-3. 과일 외곽선
```ts
// Before: rgba(0,0,0,0.2)
// After: 각 레벨별 네온 색상으로 글로우 효과
ctx.shadowColor = NEON_COLORS[fruit.level];
ctx.shadowBlur = 6;
```

### 5-4. 게임오버 화면
```
배경: rgba(0, 0, 0, 0.88)
"GAME OVER"  → #FFE000, 32px Press Start 2P, glow
"SCORE: XXXXX" → #fff, 16px
"PRESS SPACE" → #ff00ff, 10px, 깜박임(1초 토글)
```

### 5-5. Canvas 테두리
`GameCanvas.tsx`의 `border-2 border-gray-800` → `border-2 border-[#00ffff]` + box-shadow 네온

---

## 6. 픽셀 아트 과일 (FruitSVG.ts)

모든 11개 SVG를 SVG `<rect>` 기반 픽셀 아트로 교체.
`viewBox="0 0 12 12"` (LV11 수박만 `0 0 16 16`), `image-rendering: pixelated`.

| LV | 과일 | 주 색상 | 특징 |
|----|------|---------|------|
| 1 | 체리 | `#ff0055` | 두 원 + 갈색 줄기 |
| 2 | 딸기 | `#ff0055` | 역삼각형 + 노란 씨 |
| 3 | 포도 | `#cc00ff` | 원 클러스터 |
| 4 | 데코폰 | `#ff9900` | 원 + 상단 돌기 |
| 5 | 감 | `#ff8800` | 사각 원 + 초록 꼭지 |
| 6 | 사과 | `#ee1111` | 원 + 줄기 + 잎 |
| 7 | 배 | `#ccdd22` | 아래가 넓은 형태 |
| 8 | 복숭아 | `#ffaaaa` | 원 + 세로 중심선 |
| 9 | 파인애플 | `#ffdd00` | 몸통 + 초록 왕관 |
| 10 | 멜론 | `#99cc66` | 원 + 격자선 |
| 11 | 수박 | `#009900` + `#ff1155` | 초록 껍질 + 빨간 속 + 씨 |

---

## 7. 변경 대상 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `index.html` (루트, Vite 엔트리) | Press Start 2P 구글 폰트 `<link>` 추가 |
| `src/styles/index.css` | body 배경 `#0a0a1a`, font-family 교체, canvas 테두리 색상 |
| `src/components/GameCanvas.tsx` | border 색상 → `#00ffff`, box-shadow 네온 글로우 |
| `src/components/GameUI.tsx` | 전체 재작성 — 아케이드 1UP/HI SCORE 레이아웃 |
| `src/components/Game.tsx` | Canvas 렌더링 (배경, 스폰라인, 과일 글로우, 게임오버) |
| `src/engine/FruitSVG.ts` | 11개 SVG 픽셀 아트로 전면 교체 |

---

## 8. 범위 외 (변경 없음)

- 게임 엔진: `CannonPhysics`, `CollisionHandler`, `GameState`, `InputHandler`
- 과일 레벨/크기/점수 계산: `Fruit.ts`
- 입력 처리 로직 (`Game.tsx` 이벤트 핸들러)
