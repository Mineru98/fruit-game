# 과일 게임 개발 일지

> 이 문서는 과일 게임이 만들어진 전 과정을 프롬프트 단위로 기록합니다.

---

## 개요

**장르**: 수이카 게임(Suika Game) 스타일의 물리 기반 캐주얼 게임
**참고 자료**: 엑셀로 수박 게임을 만드는 [유튜브 영상](docs/script.md)에서 영감을 받아 웹 버전으로 구현
**최종 스택**: TypeScript + React + Vite + Cannon.js

---

## 세션 1 — 최초 구현 (Vanilla JS)

**커밋**: `c32e4e8`

### 프롬프트
> 엑셀로 만든 수박 게임을 웹 Canvas + JavaScript로 구현해줘.
> 물리 엔진, 충돌 감지, 과일 합치기 메커니즘 포함.

### 구현 내용

기획서(`docs/superpowers/plans/2026-03-29-fruit-game-web.md`)를 먼저 작성한 뒤 구현:

| 파일 | 역할 |
|------|------|
| `src/Game.js` | 게임 루프 오케스트레이터 |
| `src/Fruit.js` | 과일 데이터 모델 (레벨 1~11) |
| `src/Physics.js` | 중력·마찰·충돌 반발 물리 엔진 |
| `src/CollisionDetector.js` | 유클리드 거리 기반 충돌 감지 및 합치기 |
| `src/GameState.js` | 점수·게임오버 상태 관리 |
| `src/InputHandler.js` | 키보드 입력 처리 |

**물리 엔진 구현 포인트**:
- 중력: 오일러 적분 (`vy += gravity`)
- 마찰: 수평 속도에만 적용 (`vx *= 0.75`)
- 충돌 감지: 두 원의 중심 거리 < 반지름 합
- 충돌 반응: 벡터 반발력 (법선 방향 임펄스)
- 위치 분리: 프레임당 5회 반복으로 겹침 해소

**테스트**: Jest로 51개 단위 테스트 작성 및 통과

---

## 세션 2 — TypeScript + React 마이그레이션 설계

**커밋**: `7c82bb1`

### 프롬프트
> 이 게임을 TypeScript + React + Cannon.js로 마이그레이션 해줘.
> 먼저 설계 문서를 작성해.

### 구현 내용

마이그레이션 설계 문서 작성 (`docs/superpowers/plans/2026-03-29-fruit-game-migration-design.md`):
- Vite 빌드 도구 도입
- Cannon-es 물리 엔진 적용 계획
- 컴포넌트 구조 설계 (`Game.tsx`, `GameCanvas.tsx`, `GameUI.tsx`)
- TypeScript 타입 정의 설계

---

## 세션 3 — TypeScript + React + Cannon.js 구현

**커밋**: `4f33bcd`

### 프롬프트
> 설계대로 마이그레이션을 실행해줘.

### 구현 내용

| 파일 | 역할 |
|------|------|
| `src/engine/Fruit.ts` | 과일 모델 + 레벨별 반지름/색상 정의 |
| `src/engine/CannonPhysics.ts` | Cannon-es 물리 엔진 래퍼 |
| `src/engine/CollisionHandler.ts` | 충돌 감지 + 합치기 로직 |
| `src/engine/GameState.ts` | 게임 상태 + 게임오버 판정 |
| `src/engine/InputHandler.ts` | window 이벤트 기반 키보드 입력 |
| `src/engine/FruitSVG.ts` | 레벨별 SVG 과일 그래픽 |
| `src/components/Game.tsx` | 게임 루프 + Canvas 렌더링 (React) |
| `src/components/GameCanvas.tsx` | Canvas 엘리먼트 컴포넌트 |
| `src/components/GameUI.tsx` | 점수판 + 재시작 버튼 UI |

**주요 아키텍처 결정**:
- `requestAnimationFrame` 기반 게임 루프를 `useEffect` 내부에서 실행
- Cannon.js를 중력 계산에 사용, 충돌은 자체 `CollisionHandler`로 처리
- SVG를 `<canvas>`에 비트맵으로 캐싱하여 렌더링 성능 최적화

---

## 세션 4 — 코드 리뷰 수정

**커밋**: `0150f81`

### 프롬프트
> 코드 리뷰를 해줘.

### 수정 내용
- 코드 리뷰에서 발견된 유효성 검사 문제들 수정
- 타입 안전성 개선

---

## 세션 5 — 테스트 · 버그 수정 · 비주얼 개선

### 5-1. Playwright 테스트 + 스페이스 키 버그 수정

**커밋**: `096b229`

#### 프롬프트
> 게임 실행하고 동작하는 테스트 해봐 /playwright-cli
> 분명 아까는 잘 동작했는데 이제는 스페이스 누르면 동작도 안하네?

#### 원인 분석

`playwright-cli`로 `http://localhost:3000`을 열어 테스트한 결과 두 가지 문제 발견:

1. **스크롤 문제**: 스페이스 키가 페이지를 스크롤 시킴 → `e.preventDefault()` 누락
2. **이벤트 리스너 소실**: React StrictMode가 개발 모드에서 `useEffect`를 **2번 실행**
   - 1차 실행: `InputHandler` 생성 → 이벤트 리스너 등록
   - 1차 cleanup: `inputHandlerRef.current.destroy()` → **이벤트 리스너 제거**
   - 2차 실행: 같은 `inputHandlerRef.current` 재사용 → 리스너 없는 상태로 게임 루프 실행

#### 수정 내용

```ts
// InputHandler.ts - e.preventDefault() 추가
this.handleKeyDown = (e: KeyboardEvent) => {
  if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }
  this.keys[e.key] = true;
};
```

```tsx
// Game.tsx - useEffect 내부에서 InputHandler 새로 생성
const inputHandler = new InputHandler(); // useRef 초기값 대신 useEffect 안에서 생성
inputHandlerRef.current = inputHandler;
```

---

### 5-2. Gemini CLI로 과일 SVG 디자인 생성 및 적용

**커밋**: `b9ed963`

#### 프롬프트
> gemini-3.1-pro-preview로 gemini cli를 제어해서 과일들을 디자인해서 반영해줘.

#### 과정

`omc ask gemini` 명령으로 Gemini CLI에 11개 과일 SVG 디자인을 요청:

```
11개 과일을 수이카 게임 스타일로 디자인해줘.
각 과일은 viewBox="0 0 100 100" SVG, 하이라이트·줄기·잎·표정 포함.
JSON 형태로 반환해줘: {"1": "<svg>...", ..., "11": "<svg>..."}
```

결과물을 `src/engine/FruitSVG.ts`에 적용:

| 레벨 | 과일 | 특징 |
|------|------|------|
| 1 | 🍒 체리 | 두 개 붙은 빨간 체리, 갈색 줄기 |
| 2 | 🍓 딸기 | 빨간 눈물 형태, 노란 씨앗, 초록 꼭지 |
| 3 | 🍇 포도 | 보라색 원형 클러스터 5개, 초록 줄기 |
| 4 | 🍊 감귤(데코폰) | 오렌지 원, 볼록한 머리, 귀여운 표정 |
| 5 | 🫐 감(카키) | 주황 사각 몸통, 초록 별 모양 꽃받침 |
| 6 | 🍎 사과 | 빨간 하트형, 갈색 줄기, 초록 잎 |
| 7 | 🍐 배 | 연두색 서양배 형태, 줄기 |
| 8 | 🍑 복숭아 | 분홍 하트형, 세로 크랙 라인, 잎 |
| 9 | 🍍 파인애플 | 노란 타원 몸통, 초록 왕관 잎 |
| 10 | 🍈 멜론 | 연두색 원, 곡선 무늬 선 |
| 11 | 🍉 수박 | 진녹색 원, 세로줄 3개 |

---

### 5-3. 스폰 미리보기를 과일 SVG로 변경

**커밋**: `7941987`

#### 프롬프트
> 아니 왜 시작할 때 공은 왜 과일로 안되어 있어?

#### 원인

`Game.tsx`의 미리보기 렌더링이 단색 원(`ctx.arc + fillStyle`)으로만 그려짐:
```tsx
// 수정 전: 단색 원
ctx.fillStyle = Fruit.COLORS[gameState.nextFruitLevel];
ctx.arc(spawnX, SPAWN_Y, radius, 0, Math.PI * 2);
ctx.fill();
```

#### 수정 내용

```tsx
// 수정 후: FruitSVG 이미지 사용
const previewCanvas = fruitSVGRef.current.getCanvasForLevel(previewLevel);
ctx.drawImage(previewCanvas, previewX - radius, SPAWN_Y - radius, radius * 2, radius * 2);
```

---

### 5-4. 미리보기 원형 테두리 추가

**커밋**: `9c4ae83`

#### 프롬프트
> 다 좋은데 스폰 과일에 옆에 둥근 원은 왜 없어?

#### 수정 내용

낙하하는 과일에는 있지만 프리뷰에 없던 `ctx.stroke()` 원형 테두리 추가:
```tsx
ctx.strokeStyle = 'rgba(0,0,0,0.2)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
ctx.stroke();
```

---

### 5-5. 쿨다운 중 커서 미리보기 유지

**커밋**: `ef783f2`

#### 프롬프트
> 왜 스페이스 누르고 나면 현재 커서가 안보여?

#### 원인

발사 후 500ms 쿨다운 동안 `nextFruitDelayRef.current === true`가 되어 프리뷰 렌더링 블록 전체가 실행 안 됨:
```tsx
// 수정 전: 쿨다운 중 완전히 숨김
if (!gameState.isGameOver && !nextFruitDelayRef.current) { ... }
```

#### 수정 내용

```tsx
// 수정 후: 쿨다운 여부에 따라 투명도만 다르게
if (!gameState.isGameOver) {
  ctx.globalAlpha = nextFruitDelayRef.current ? 0.3 : 0.7; // 쿨다운 중엔 흐리게
  // ... 프리뷰 렌더링
}
```

---

## 세션 6 — 충돌 버그 수정 + 모바일 최적화

### 6-1. 충돌 시 과일 제거 버그 수정

**커밋**: `80fd1fb`

#### 프롬프트
> 과일들이 합쳐질 때 가끔 하나가 안 사라져.

#### 원인 분석

`CollisionHandler`에서 충돌 감지 후 과일을 제거할 때, `collisionHandler.removeFruit()`를 호출했지만 실제 Cannon.js 물리 월드에서 바디가 제거되지 않는 불일치 발생:

```ts
// 수정 전: collisionHandler만 제거 → 물리 바디 잔존
collisionHandler.removeFruit(fruitA);

// 수정 후: physics에서 직접 제거 → 바디 + 데이터 동시 제거
physics.removeFruit(fruitA);
```

**사용 도구**: `playwright-cli`로 브라우저 테스트 → 재현 확인 → `systematic-debugging` 스킬로 원인 추적

---

### 6-2. 모바일 최적화 및 SVG 파비콘 추가

**커밋**: `b1e2261`

#### 프롬프트
> 모바일에서도 동작하게 해줘. 그리고 파비콘도 넣어.

#### 구현 내용

| 항목 | 변경 내용 |
|------|----------|
| 터치 입력 | `touchstart`/`touchmove`로 가로 위치 반영, `touchend`로 과일 드롭 |
| 좌표 변환 | CSS 스케일 역변환으로 터치 좌표 → 캔버스 좌표 매핑 |
| Canvas 반응형 | `maxWidth:100%`, `height:auto`, `touchAction:none` |
| iOS 바운스 방지 | `overscroll-behavior:none`, `overflow:hidden` |
| 뷰포트 고정 | `user-scalable=no`, `maximum-scale=1.0` |
| 파비콘 | 체리 SVG (`public/favicon.svg`) |
| 안내문구 분리 | 모바일: "터치로 조작", 데스크탑: "키보드/마우스로 조작" |

**서브에이전트**: `executor` (모바일 터치 이벤트 구현), `code-reviewer` (크로스 브라우저 호환성 검증)

---

## 세션 7 — 테스트 환경 정리 + 마우스 클릭 지원

### 7-1. Jest 테스트 환경 제거

**커밋**: `9a93c7d`

#### 프롬프트
> Jest 테스트 환경은 이제 필요 없으니 제거해줘.

#### 삭제 내용

Cannon.js 물리 엔진 도입 후 기존 자체 물리 엔진 단위 테스트가 무의미해져 정리:

- `jest.config.cjs`, `jest.config.js` 삭제
- `tests/engine.test.js` 삭제
- `package.json`에서 `jest`, `babel-jest`, `@babel/preset-env` 의존성 제거
- `tsconfig.json`에서 jest 타입 참조 제거

---

### 7-2. 마우스 클릭으로 과일 떨어뜨리기

**커밋**: `0665fd3`

#### 프롬프트
> 마우스 클릭으로도 과일을 떨어뜨릴 수 있게 해줘.

#### 구현 내용

```ts
// InputHandler.ts에 마우스 이벤트 추가
canvas.addEventListener('mousemove', (e) => {
  this.mouseX = e.offsetX; // 커서 위치 → 스폰 X 좌표
});
canvas.addEventListener('mousedown', () => {
  this.dropRequested = true; // 클릭 → 과일 드롭
});
```

- 키보드 이동 속도 5 → 12로 증가 (마우스 대비 체감 속도 보정)
- 게임오버 재시작 안내에 클릭 방법 추가
- UI 힌트 텍스트에 "클릭" 조작 안내 추가

---

## 세션 8 — 아케이드 리디자인 기획

**커밋**: `b28b38d`, `21d3a66`

### 프롬프트
> 이 게임을 팩맨 같은 오락실 느낌으로 리디자인 하고 싶어.
> 도트 디자인, 네온 글로우, Press Start 2P 폰트 같은 거.

### 과정

#### 1단계: 브레인스토밍 (`superpowers:brainstorming`)

브레인스토밍 스킬로 디자인 방향을 탐색:

- **시각 스타일**: 팩맨/갤러그 아케이드 캐비넷 감성
- **컬러**: 검정 배경 + 네온(시안, 마젠타, 옐로우) 하이라이트
- **폰트**: Press Start 2P (8비트 픽셀 폰트)
- **과일**: SVG `<rect>` 기반 픽셀 아트로 전면 교체
- **UI**: 1UP / HI SCORE / LEVEL 3단 아케이드 점수판

#### 2단계: 설계 문서 작성 (`superpowers:writing-plans`)

`docs/superpowers/specs/2026-03-30-arcade-redesign-design.md` — 디자인 스펙:
- 8색 컬러 팔레트 정의
- 타이포그래피 크기별 용도 지정
- UI 레이아웃 ASCII 다이어그램
- Canvas 렌더링 변경 사항 (배경, 스폰라인, 글로우, 게임오버)
- 11개 과일 픽셀 아트 명세

`docs/superpowers/plans/2026-03-30-arcade-redesign.md` — 실행 계획:
- 6개 파일 변경 계획
- 7개 태스크로 분할
- 각 태스크별 구현 코드 스니펫 포함

**서브에이전트**: `architect` (전체 리디자인 구조 설계), `designer` (컬러 팔레트·레이아웃 제안)

---

## 세션 9 — 아케이드 리디자인 구현

**커밋**: `3120015` → `16ce676` → `c700c7e` → `ac3c192` → `9e8f1f9`

### 프롬프트
> 설계대로 아케이드 리디자인을 실행해줘.

### 구현 과정 (`superpowers:executing-plans` + `superpowers:subagent-driven-development`)

설계 문서의 7개 태스크를 순서대로 실행:

#### Task 1: 폰트 + 배경 기반 설정 (`3120015`)

| 파일 | 변경 |
|------|------|
| `index.html` | Press Start 2P 구글 폰트 링크 + theme-color `#0a0a1a` |
| `src/styles/index.css` | body 배경 `#0a0a1a`, 폰트 교체, blink 애니메이션 추가 |

#### Task 2: 캔버스 네온 테두리 (`16ce676`)

```tsx
// GameCanvas.tsx
style={{
  border: '2px solid #00ffff',
  boxShadow: '0 0 10px rgba(0,255,255,0.3), inset 0 0 10px rgba(0,255,255,0.1)',
}}
```

#### Task 3: 아케이드 UI 재작성 (`c700c7e`)

`GameUI.tsx`를 전면 재작성:
- `★ FRUIT GAME ★` 타이틀 (#FFE000, 글로우)
- 1UP / HI SCORE / LEVEL 3열 점수판
- `PRESS START` 깜박이는 재시작 버튼
- NEXT 과일 미리보기 + 조작 안내

#### Task 4: Canvas 배경 + 스폰라인 (`ac3c192`)

```ts
// 배경: 밝은 회색 → 순수 검정
ctx.fillStyle = '#000000';

// 스폰라인: 네온 붉은 점선
ctx.strokeStyle = 'rgba(255,0,85,0.5)';
ctx.shadowColor = 'rgba(255,0,85,0.3)';
ctx.shadowBlur = 4;
```

#### Task 5: 네온 글로우 과일 + 게임오버 화면 (`9e8f1f9`)

```ts
// 과일 렌더링에 네온 글로우 추가
ctx.shadowColor = NEON_COLORS[fruit.level];
ctx.shadowBlur = 8;

// 아케이드 게임오버 화면
ctx.font = '32px "Press Start 2P"';
ctx.fillStyle = '#FFE000';
ctx.fillText('GAME OVER', ...);
// "PRESS SPACE" 1초 깜박임 효과
```

**서브에이전트**: `executor` (각 태스크별 코드 구현), `code-reviewer` (아케이드 디자인 일관성 리뷰)

---

## 세션 10 — 픽셀 아트 과일 + 렌더링 수정

### 10-1. 11개 과일 SVG 픽셀 아트 전면 교체

**커밋**: `6f2eced`

#### 프롬프트
> 과일들도 도트 느낌의 픽셀 아트로 바꿔줘.

#### 구현 내용

`src/engine/FruitSVG.ts`의 모든 SVG를 `<rect>` 기반 도트 그래픽으로 교체:

| LV | 과일 | viewBox | 주 색상 | 특징 |
|----|------|---------|---------|------|
| 1 | 체리 | 12×12 | `#ff0055` | 두 원 + 갈색 줄기 |
| 2 | 딸기 | 12×12 | `#ff0055` | 역삼각형 + 노란 씨 |
| 3 | 포도 | 12×12 | `#cc00ff` | 원 클러스터 |
| 4 | 데코폰 | 12×12 | `#ff9900` | 원 + 상단 돌기 |
| 5 | 감 | 12×12 | `#ff8800` | 사각 원 + 초록 꼭지 |
| 6 | 사과 | 12×12 | `#ee1111` | 원 + 줄기 + 잎 |
| 7 | 배 | 12×12 | `#ccdd22` | 아래가 넓은 형태 |
| 8 | 복숭아 | 12×12 | `#ffaaaa` | 원 + 세로 중심선 |
| 9 | 파인애플 | 12×12 | `#ffdd00` | 몸통 + 초록 왕관 |
| 10 | 멜론 | 12×12 | `#99cc66` | 원 + 격자선 |
| 11 | 수박 | 16×16 | `#009900`+`#ff1155` | 초록 껍질 + 빨간 속 + 씨 |

Canvas 렌더링에 `imageSmoothingEnabled = false` 설정으로 픽셀 크리스프 보장.

---

### 10-2. SVG 비동기 로딩 레이스 컨디션 수정

**커밋**: `37919d6`

#### 프롬프트
> 처음 시작할 때 과일이 안 보이고 한 프레임 지나야 보여.

#### 원인 분석 (`superpowers:systematic-debugging`)

`FruitSVG`가 `Image` 객체에 data URI를 넣고 `onload` 콜백으로 캔버스에 그리는 비동기 패턴 사용:

```ts
// 수정 전: Image.onload 비동기 → 첫 프레임에 빈 캔버스
const img = new Image();
img.onload = () => { offscreenCtx.drawImage(img, 0, 0); };
img.src = 'data:image/svg+xml;base64,...';
```

HTML5 Canvas에서 `Image.onload`는 data URI라도 **비동기**이므로 첫 게임 프레임에서 아직 로드 안 된 상태.

#### 수정 내용

```ts
// 수정 후: fillRect로 직접 그리기 → 동기, 즉시 사용 가능
offscreenCtx.fillStyle = color;
offscreenCtx.fillRect(x, y, 1, 1); // 픽셀 아트는 rect로 충분
```

비동기 `Image`/`onload` 패턴을 완전히 제거하고, `fillRect`로 직접 픽셀을 그리는 동기 방식으로 전환.
메인 캔버스에도 `imageSmoothingEnabled = false`를 추가하여 픽셀 아트 선명도 보장.

**서브에이전트**: `debugger` (비동기 레이스 컨디션 원인 추적), `executor` (동기 렌더링 코드로 재작성)

---

## 기술 스택 변화 요약

```
세션 1   HTML5 Canvas + Vanilla JS + Jest (51개 테스트)
   ↓
세션 3   TypeScript + React + Vite + Cannon-es + SVG
   ↓
세션 6   모바일 터치 지원 + 반응형 Canvas
   ↓
세션 9   아케이드 리디자인 (Press Start 2P + 네온 글로우)
   ↓
세션 10  픽셀 아트 과일 + 동기 렌더링
```

## 사용한 스킬 & 서브에이전트 요약

### 스킬 (Superpowers)

| 스킬 | 사용 세션 | 용도 |
|------|----------|------|
| `superpowers:writing-plans` | 1, 2, 8 | 기획서·설계 문서 작성 |
| `superpowers:executing-plans` | 3, 9 | 설계 문서 기반 구현 실행 |
| `superpowers:subagent-driven-development` | 3, 9 | 독립 태스크 병렬 구현 |
| `superpowers:brainstorming` | 8 | 아케이드 리디자인 방향 탐색 |
| `superpowers:systematic-debugging` | 5, 6, 10 | 버그 원인 추적 |
| `superpowers:requesting-code-review` | 4 | 코드 리뷰 요청 |
| `playwright-cli` | 5, 6 | 브라우저 기반 동작 테스트 |

### 서브에이전트

| 에이전트 | 사용 세션 | 역할 |
|----------|----------|------|
| `executor` | 3, 6, 7, 9, 10 | 코드 구현 실행 |
| `architect` | 2, 8 | 아키텍처·설계 구조 결정 |
| `designer` | 8 | 컬러 팔레트·UI 레이아웃 제안 |
| `code-reviewer` | 4, 6, 9 | 코드 품질·일관성 검증 |
| `debugger` | 5, 10 | 버그 원인 분석 |
| `document-specialist` | 5 | Gemini CLI 연동으로 SVG 아트 생성 |

### 외부 AI 도구

| 도구 | 사용 세션 | 용도 |
|------|----------|------|
| Gemini CLI (`omc ask gemini`) | 5 | 11개 과일 SVG 디자인 생성 |

## 버그 수정 히스토리 요약

| 버그 | 원인 | 수정 방법 | 세션 |
|------|------|-----------|------|
| 스페이스 키로 페이지 스크롤 | `e.preventDefault()` 누락 | InputHandler에 방지 코드 추가 | 5-1 |
| 스페이스 키 게임 미동작 | React StrictMode double-effect로 이벤트 리스너 소실 | useEffect 내부에서 InputHandler 새로 생성 | 5-1 |
| 미리보기가 단색 원으로 표시 | 프리뷰 코드가 FruitSVG 미사용 | `getCanvasForLevel()` 사용으로 변경 | 5-3 |
| 미리보기에 원형 테두리 없음 | `ctx.stroke()` 누락 | 테두리 코드 추가 | 5-4 |
| 발사 후 커서 사라짐 | 쿨다운 중 프리뷰 블록 전체 스킵 | 투명도 조절로 흐리게만 표시 | 5-5 |
| 충돌 시 과일 미제거 | `collisionHandler` vs `physics` 제거 불일치 | `physics.removeFruit()` 직접 호출 | 6-1 |
| 첫 프레임 과일 미표시 | `Image.onload` 비동기 레이스 컨디션 | `fillRect` 동기 렌더링으로 전환 | 10-2 |
