# Fruit Game: TypeScript + React + Cannon.js 마이그레이션

**Date**: 2026-03-29
**Status**: Design
**Scope**: 전체 프로젝트 마이그레이션 + 점수 버그 수정 + 물리 엔진 개선

---

## 개요

현재 과일 게임은 Canvas 기반이며, JS/JSX 파일이 혼재되어 있고 점수 표시 버그가 있습니다. 이 작업은:

1. **점수 버그 수정**: React state와 UI 동기화
2. **TypeScript 마이그레이션**: 기존 구조 유지하면서 타입 안정성 추가
3. **Cannon.js 물리 엔진 도입**: 충돌 정밀도 개선
4. **SVG 과일 그래픽**: 레벨별 다양한 과일 디자인
5. **Tailwind CSS 통합**: 스타일 통일
6. **파일 정리**: 미사용 JS/JSX/CSS 제거

---

## 아키텍처

### 계층 구조

```
React Component Layer (Game.tsx)
  ↓
Game Logic Layer (GameController)
  ├─ GameState (상태 관리)
  ├─ CannonPhysics (Cannon.js 래퍼)
  ├─ CollisionHandler (충돌/병합)
  └─ InputHandler (키보드 입력)
  ↓
Rendering Layer (GameCanvas.tsx, GameUI.tsx)
```

### 파일 구조

```
src/
├── components/
│   ├── Game.tsx              (메인 게임 컴포넌트)
│   ├── GameCanvas.tsx        (Canvas 렌더링)
│   └── GameUI.tsx            (점수, 컨트롤 UI)
├── engine/
│   ├── types.ts              (인터페이스, 타입)
│   ├── Fruit.ts              (과일 클래스)
│   ├── GameState.ts          (게임 상태 관리)
│   ├── CannonPhysics.ts      (물리 엔진 래퍼)
│   ├── CollisionHandler.ts   (충돌 감지/병합)
│   ├── InputHandler.ts       (입력 처리)
│   └── FruitSVG.ts           (SVG 생성)
├── styles/
│   └── index.css             (Tailwind + 커스텀)
├── App.tsx                   (루트 컴포넌트)
├── index.tsx                 (엔트리포인트)
└── index.html                (HTML)

삭제 대상:
- src/Game.js, GameState.js, Physics.js, CollisionDetector.js, Fruit.js, InputHandler.js
- src/styles.css, index.css (Tailwind로 통합)
- src/index.jsx
- babel.config.js
```

---

## 핵심 컴포넌트

### 1. Game.tsx (React 컴포넌트)

**책임**:
- 게임 루프 관리 (requestAnimationFrame)
- React state로 점수, 게임 오버 상태 유지
- 자식 컴포넌트에 props 전달

**상태**:
```tsx
const [score, setScore] = useState(0);
const [gameOver, setGameOver] = useState(false);
const [fruits, setFruits] = useState<Fruit[]>([]);
```

**Props 흐름**:
- GameCanvas: canvas ref, fruits, spawnX, nextLevel
- GameUI: score, gameOver, onRestart

### 2. CannonPhysics.ts (물리 엔진)

**책임**:
- Cannon.js World 초기화
- 각 과일마다 Sphere 바디 생성
- 매 프레임 `world.step()` 호출
- 과일 위치/속도 동기화

**파라미터**:
```ts
gravity: 9.8 m/s²
restitution: 0.6 (반발)
friction: 0.3
damping: 0.3
timeStep: 1/60
```

**API**:
```ts
addFruit(fruit: Fruit): void
removeFruit(fruit: Fruit): void
step(deltaTime: number): void
getCollisions(): [Fruit, Fruit][]
```

### 3. CollisionHandler.ts (충돌 처리)

**책임**:
- Cannon의 접촉 콜백에서 과일 쌍 추출
- 동일 레벨 과일 병합 로직
- 점수 계산

**병합 조건**:
- 동일 레벨
- 레벨 < 11
- 충돌 발생

**점수 공식**:
```
score += 2^newLevel * 10
```

### 4. Fruit.ts (과일 객체)

**속성**:
```ts
id: string
level: 1-11
x, y: 위치
vx, vy: 속도
radius: 반지름
isActive: boolean
createdAt: 생성 시간
```

**메서드**:
```ts
static getRadius(level): number
static getScore(level): number
update(physicsBody): void  // Cannon 바디로부터 위치 동기화
```

### 5. FruitSVG.ts (SVG 생성)

**책임**:
- 레벨별 과일 SVG 생성
- Canvas에 이미지로 캐싱

**과일 종류** (예):
- 1-2: 딸기
- 3-4: 포도
- 5-6: 귤
- 7-8: 사과
- 9-10: 수박
- 11: 특별한 과일 (별, 왕관 등)

---

## 점수 버그 수정

### 문제
- App.jsx에서 `gameState.score` 변경이 DOM `#score` 요소와 동기화 안 됨
- Canvas 오버레이에만 점수 표시

### 해결
1. React `useState(score)` 로 상태 관리
2. CollisionHandler에서 병합 시 콜백으로 `setScore` 호출
3. GameUI.tsx에서 점수판에 표시

---

## 스타일 (Tailwind CSS)

### package.json 추가
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 스타일 구조
- **src/index.css**: `@tailwind` 디렉티브 + 커스텀 CSS
- **Game.tsx**: Tailwind 클래스로 레이아웃
- **Canvas**: 그림자, 테두리는 인라인 스타일 또는 CSS 클래스

### UI 요소
- 점수판: `text-2xl font-bold text-red-600`
- 컨트롤 텍스트: `text-sm text-gray-600`
- 게임 오버 오버레이: Canvas 렌더링 (기존 유지)

---

## 테스트 전략

### 기존 테스트
- 51개 테스트 마이그레이션 (JS → TS, Jest 유지)
- Playwright E2E 테스트 유지

### 신규 테스트
- Cannon.js 물리 시뮬레이션 검증
- 충돌 경계 정밀도 테스트
- 점수 계산 검증

### 검증 포인트
1. ✅ 점수가 실시간으로 UI에 표시됨
2. ✅ 과일 충돌 시 정확히 병합됨
3. ✅ 과일 움직임이 부드러움 (물리 엔진)
4. ✅ 게임 오버 조건 정확함

---

## 구현 순서

1. **의존성 설치**: TypeScript, Cannon.js, Tailwind CSS
2. **타입 정의**: types.ts 작성
3. **엔진 구현**: Fruit, GameState, CannonPhysics, CollisionHandler
4. **React 컴포넌트**: Game, GameCanvas, GameUI
5. **SVG 그래픽**: FruitSVG, Canvas 렌더링 통합
6. **스타일**: Tailwind 설정, index.css 작성
7. **테스트**: 기존 테스트 마이그레이션 + 신규 테스트
8. **정리**: 미사용 파일 삭제, 최종 검증

---

## 마이그레이션 체크리스트

- [ ] package.json 업데이트 (TS, Cannon.js, Tailwind)
- [ ] tsconfig.json, vite.config.ts 설정
- [ ] src/engine/ 구현
- [ ] src/components/ 구현
- [ ] SVG 과일 그래픽 생성
- [ ] Tailwind 스타일 완성
- [ ] 테스트 마이그레이션 + 실행 (51개 모두 통과)
- [ ] Playwright E2E 테스트 검증
- [ ] 미사용 파일 삭제
- [ ] git commit

---

## 예상 결과

✅ **점수가 정확하게 표시되고 실시간 업데이트됨**
✅ **TypeScript로 타입 안정성 확보**
✅ **Cannon.js로 물리 충돌 정밀도 향상**
✅ **SVG 과일로 다양한 시각 표현**
✅ **Tailwind CSS로 깔끔한 스타일**
✅ **미사용 파일 제거로 코드 정리**
✅ **기존 테스트 51개 모두 통과**
