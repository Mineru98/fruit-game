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

## 기술 스택 변화 요약

```
세션 1  HTML5 Canvas + Vanilla JS + Jest
   ↓
세션 3  TypeScript + React + Vite + Cannon-es + SVG
```

## 버그 수정 히스토리 요약

| 버그 | 원인 | 수정 방법 |
|------|------|-----------|
| 스페이스 키로 페이지 스크롤 | `e.preventDefault()` 누락 | InputHandler에 방지 코드 추가 |
| 스페이스 키 게임 미동작 | React StrictMode double-effect로 이벤트 리스너 소실 | useEffect 내부에서 InputHandler 새로 생성 |
| 미리보기가 단색 원으로 표시 | 프리뷰 코드가 FruitSVG 미사용 | `getCanvasForLevel()` 사용으로 변경 |
| 미리보기에 원형 테두리 없음 | `ctx.stroke()` 누락 | 테두리 코드 추가 |
| 발사 후 커서 사라짐 | 쿨다운 중 프리뷰 블록 전체 스킵 | 투명도 조절로 흐리게만 표시 |
