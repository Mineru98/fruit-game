# Arcade Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 과일 게임 전체 UI를 팩맨 스타일 도트 디자인 오락실 느낌으로 리디자인한다.

**Architecture:** HTML+CSS 레이어 → React UI 컴포넌트 → Canvas 렌더링 → SVG 픽셀 아트 순으로 교체한다. 게임 엔진 로직(물리, 충돌, 합치기, 입력)은 일절 건드리지 않는다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, HTML5 Canvas, SVG pixel art, Google Fonts (Press Start 2P)

---

## File Map

| 파일 | 변경 유형 | 역할 |
|------|----------|------|
| `index.html` | Modify | Press Start 2P 폰트 `<link>` + theme-color 추가 |
| `src/styles/index.css` | Modify | body 배경 `#0a0a1a`, 폰트, blink 애니메이션 |
| `src/components/GameCanvas.tsx` | Modify | 네온 시안 테두리 + box-shadow 글로우 |
| `src/components/GameUI.tsx` | Rewrite | 1UP / HI SCORE / LEVEL 아케이드 레이아웃 |
| `src/components/Game.tsx` | Modify | Canvas 배경, 스폰라인, 과일 글로우, 게임오버 화면 |
| `src/engine/FruitSVG.ts` | Rewrite | 11개 SVG 픽셀 아트로 전면 교체 |

---

## Task 1: 폰트 + 배경 기반 설정

**Files:**
- Modify: `index.html`
- Modify: `src/styles/index.css`

- [ ] **Step 1: index.html에 Press Start 2P 폰트 링크 + theme-color 추가**

`index.html`의 `<head>` 안, `<meta name="theme-color" ...>` 줄을 찾아 아래처럼 교체한다:

```html
    <meta name="theme-color" content="#0a0a1a" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>FRUIT GAME</title>
```

전체 `index.html` 결과:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="theme-color" content="#0a0a1a" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>FRUIT GAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: src/styles/index.css 배경색 + 폰트 + blink 애니메이션 교체**

`src/styles/index.css` 전체를 아래로 교체한다:

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: 'Press Start 2P', monospace;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: none;
  overflow: hidden;
  overscroll-behavior: none;
}

body {
  background: #0a0a1a;
  -webkit-overflow-scrolling: touch;
}

#root {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 3: 개발 서버 실행 후 배경이 어두운 남색(#0a0a1a)으로 바뀌었는지 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 열기. 배경이 검정에 가까운 남색으로 바뀌어야 한다. 폰트는 아직 눈에 띄는 변화가 없을 수 있다 (GameUI에서 폰트 클래스를 쓰지 않아서).

- [ ] **Step 4: 커밋**

```bash
git add index.html src/styles/index.css
git commit -m "feat(design): 아케이드 배경 + Press Start 2P 폰트 기반 설정"
```

---

## Task 2: GameCanvas 네온 테두리

**Files:**
- Modify: `src/components/GameCanvas.tsx`

- [ ] **Step 1: GameCanvas.tsx 테두리 + 글로우 스타일 교체**

`src/components/GameCanvas.tsx` 전체를 아래로 교체한다:

```tsx
import { forwardRef } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
  className?: string;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width, height, className }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className={`block mx-auto ${className || ''}`}
        style={{
          display: 'block',
          margin: '6px auto',
          background: '#000000',
          border: '2px solid #00ffff',
          boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 30px rgba(0,255,255,0.04)',
          cursor: 'pointer',
          maxWidth: '100%',
          height: 'auto',
          touchAction: 'none',
        }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
```

- [ ] **Step 2: Game.tsx에서 GameCanvas에 전달하는 className 업데이트**

`src/components/Game.tsx`에서 다음을 찾는다:

```tsx
        <GameCanvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-800 rounded shadow-lg"
        />
```

아래로 교체한다 (Tailwind border 클래스가 인라인 스타일을 덮어쓰지 않도록 제거):

```tsx
        <GameCanvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
```

- [ ] **Step 3: 브라우저에서 캔버스 테두리가 시안 네온으로 바뀌었는지 확인**

캔버스 주변에 `#00ffff` 색상의 빛나는 테두리가 보여야 한다.

- [ ] **Step 4: 커밋**

```bash
git add src/components/GameCanvas.tsx src/components/Game.tsx
git commit -m "feat(design): 캔버스 네온 시안 테두리 + 글로우 적용"
```

---

## Task 3: GameUI 아케이드 스타일 재작성

**Files:**
- Rewrite: `src/components/GameUI.tsx`
- Modify: `src/components/Game.tsx` (h1 타이틀 제거)

- [ ] **Step 1: GameUI.tsx 전체 재작성**

`src/components/GameUI.tsx` 전체를 아래로 교체한다:

```tsx
interface GameUIProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
}

const FONT = "'Press Start 2P', monospace";

export default function GameUI({ score, gameOver, onRestart }: GameUIProps) {
  const scoreStr = String(score).padStart(5, '0');

  return (
    <div style={{ fontFamily: FONT, width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      {/* 타이틀 */}
      <div style={{
        textAlign: 'center',
        color: '#FFE000',
        fontSize: '11px',
        letterSpacing: '3px',
        textShadow: '0 0 12px #FFE000, 0 0 24px #FFE00066',
        marginBottom: '8px',
        paddingTop: '4px',
      }}>
        ★ FRUIT GAME ★
      </div>

      {/* 점수판 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 8px',
        marginBottom: '4px',
      }}>
        <div>
          <div style={{ color: '#00ffff', fontSize: '7px', letterSpacing: '2px' }}>1UP</div>
          <div style={{ color: '#ffffff', fontSize: '11px', marginTop: '3px' }}>{scoreStr}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff00ff', fontSize: '7px', letterSpacing: '2px' }}>HI SCORE</div>
          <div style={{ color: '#ffffff', fontSize: '11px', marginTop: '3px' }}>99999</div>
        </div>
      </div>

      {/* 조작 안내 */}
      <div style={{ color: '#444', fontSize: '6px', textAlign: 'center', marginTop: '6px', letterSpacing: '1px' }}>
        <span className="hidden md:inline">LEFT RIGHT MOVE  |  SPACE DROP</span>
        <span className="md:hidden">TOUCH TO AIM &amp; DROP</span>
      </div>

      {/* 재시작 버튼 */}
      {gameOver && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={onRestart}
            style={{
              fontFamily: FONT,
              color: '#ff00ff',
              border: '2px solid #ff00ff',
              background: 'transparent',
              padding: '8px 20px',
              fontSize: '8px',
              letterSpacing: '2px',
              cursor: 'pointer',
              animation: 'blink 1s step-end infinite',
              boxShadow: '0 0 10px rgba(255,0,255,0.4)',
            }}
          >
            PRESS START
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Game.tsx에서 h1 타이틀 제거**

`src/components/Game.tsx`의 return 문에서 `<h1>` 태그를 찾아 제거한다.

변경 전:
```tsx
      <div className="text-center w-full px-2">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-6 text-gray-800">🍎 과일 게임</h1>
        <GameCanvas
```

변경 후:
```tsx
      <div className="text-center w-full px-2">
        <GameCanvas
```

그리고 바깥 wrapper div의 배경 클래스도 업데이트한다.

변경 전:
```tsx
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
```

변경 후:
```tsx
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden" style={{ background: '#0a0a1a' }}>
```

- [ ] **Step 3: 브라우저에서 아케이드 점수판이 보이는지 확인**

- `★ FRUIT GAME ★` 황금 타이틀이 캔버스 위에 표시되어야 한다
- `1UP` / `HI SCORE` 레이블과 숫자가 보여야 한다
- 게임 오버 시 `PRESS START` 버튼이 깜박여야 한다

- [ ] **Step 4: 커밋**

```bash
git add src/components/GameUI.tsx src/components/Game.tsx
git commit -m "feat(design): 아케이드 1UP/HI SCORE GameUI 재작성"
```

---

## Task 4: Canvas 배경 + 스폰라인

**Files:**
- Modify: `src/components/Game.tsx` (gameLoop 내부)

- [ ] **Step 1: Canvas 배경색을 검정으로 변경**

`Game.tsx`의 gameLoop 안에서 다음 줄을 찾는다:

```ts
      // Render background
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
```

아래로 교체한다:

```ts
      // Render background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
```

- [ ] **Step 2: 스폰라인을 네온 붉은 점선으로 변경**

gameLoop 안에서 스폰 라인 코드를 찾는다:

```ts
      // Spawn line
      ctx.strokeStyle = 'rgba(255,0,0,0.3)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, SPAWN_Y);
      ctx.lineTo(CANVAS_WIDTH, SPAWN_Y);
      ctx.stroke();
      ctx.setLineDash([]);
```

아래로 교체한다:

```ts
      // Spawn line
      ctx.strokeStyle = 'rgba(255,0,85,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, SPAWN_Y);
      ctx.lineTo(CANVAS_WIDTH, SPAWN_Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
```

- [ ] **Step 3: 브라우저에서 캔버스 내부가 검정 배경 + 붉은 점선으로 바뀌었는지 확인**

- [ ] **Step 4: 커밋**

```bash
git add src/components/Game.tsx
git commit -m "feat(design): Canvas 배경 검정 + 네온 스폰라인 적용"
```

---

## Task 5: Canvas 과일 글로우 + 게임오버 화면

**Files:**
- Modify: `src/components/Game.tsx`

- [ ] **Step 1: NEON_COLORS 상수를 Game.tsx 파일 상단(import 아래)에 추가**

`Game.tsx`의 `const CANVAS_WIDTH = 400;` 줄 바로 위에 추가한다:

```ts
const NEON_COLORS: Record<number, string> = {
  1: '#ff0055',
  2: '#ff3366',
  3: '#cc00ff',
  4: '#ff9900',
  5: '#ff8800',
  6: '#ff2222',
  7: '#ccdd22',
  8: '#ff88aa',
  9: '#ffdd00',
  10: '#99cc66',
  11: '#ff1155',
};
```

- [ ] **Step 2: 과일 그리기 코드에 네온 글로우 + 외곽선 색상 적용**

gameLoop 안에서 `// Draw fruits` 섹션을 찾는다:

```ts
      // Draw fruits
      for (const fruit of gameState.fruits) {
        try {
          const fruitCanvas = fruitSVGRef.current.getCanvasForLevel(fruit.level);
          if (fruitCanvas.width > 0) {
            ctx.drawImage(fruitCanvas, fruit.x - fruit.radius, fruit.y - fruit.radius, fruit.radius * 2, fruit.radius * 2);
          } else {
            ctx.fillStyle = Fruit.COLORS[fruit.level];
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch {
          ctx.fillStyle = Fruit.COLORS[fruit.level];
          ctx.beginPath();
          ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
```

아래로 교체한다:

```ts
      // Draw fruits
      for (const fruit of gameState.fruits) {
        const neonColor = NEON_COLORS[fruit.level] || '#00ffff';
        ctx.shadowColor = neonColor;
        ctx.shadowBlur = 8;
        try {
          const fruitCanvas = fruitSVGRef.current.getCanvasForLevel(fruit.level);
          if (fruitCanvas.width > 0) {
            ctx.drawImage(fruitCanvas, fruit.x - fruit.radius, fruit.y - fruit.radius, fruit.radius * 2, fruit.radius * 2);
          } else {
            ctx.fillStyle = neonColor;
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch {
          ctx.fillStyle = neonColor;
          ctx.beginPath();
          ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = neonColor;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
```

- [ ] **Step 3: 프리뷰 과일 draw 블록 전체를 네온 색상으로 교체 (fill 폴백 + stroke 모두)**

gameLoop 안에서 `// Draw next fruit preview` 섹션 전체를 찾는다:

```ts
      // Draw next fruit preview
      if (!gameState.isGameOver) {
        const previewLevel = gameState.nextFruitLevel;
        const previewRadius = Fruit.getRadius(previewLevel);
        const previewX = spawnXRef.current;
        ctx.globalAlpha = nextFruitDelayRef.current ? 0.3 : 0.7;
        try {
          const previewCanvas = fruitSVGRef.current.getCanvasForLevel(previewLevel);
          if (previewCanvas.width > 0) {
            ctx.drawImage(previewCanvas, previewX - previewRadius, SPAWN_Y - previewRadius, previewRadius * 2, previewRadius * 2);
          } else {
            ctx.fillStyle = Fruit.COLORS[previewLevel];
            ctx.beginPath();
            ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch {
          ctx.fillStyle = Fruit.COLORS[previewLevel];
          ctx.beginPath();
          ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = nextFruitDelayRef.current ? 0.3 : 0.7;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
```

아래로 교체한다 (fill 폴백 2곳과 stroke 모두 NEON_COLORS 적용):

```ts
      // Draw next fruit preview
      if (!gameState.isGameOver) {
        const previewLevel = gameState.nextFruitLevel;
        const previewRadius = Fruit.getRadius(previewLevel);
        const previewX = spawnXRef.current;
        const previewNeon = NEON_COLORS[previewLevel] || '#00ffff';
        ctx.globalAlpha = nextFruitDelayRef.current ? 0.3 : 0.7;
        try {
          const previewCanvas = fruitSVGRef.current.getCanvasForLevel(previewLevel);
          if (previewCanvas.width > 0) {
            ctx.drawImage(previewCanvas, previewX - previewRadius, SPAWN_Y - previewRadius, previewRadius * 2, previewRadius * 2);
          } else {
            ctx.fillStyle = previewNeon;
            ctx.beginPath();
            ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch {
          ctx.fillStyle = previewNeon;
          ctx.beginPath();
          ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = nextFruitDelayRef.current ? 0.3 : 0.7;
        ctx.strokeStyle = previewNeon;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
```

- [ ] **Step 4: 게임오버 오버레이를 아케이드 스타일로 교체**

gameLoop 안에서 `// Game over overlay` 섹션을 찾는다:

```ts
      // Game over overlay
      if (gameState.isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('게임 오버', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

        ctx.font = '24px Arial';
        ctx.fillText(`점수: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

        ctx.font = '16px Arial';
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        ctx.fillText(
          isTouchDevice ? '탭하여 재시작' : '클릭 또는 Space 키로 재시작',
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 60
        );
      }
```

아래로 교체한다:

```ts
      // Game over overlay
      if (gameState.isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.88)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // GAME OVER 텍스트
        ctx.shadowColor = '#FFE000';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#FFE000';
        ctx.font = "bold 28px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

        // 점수
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#ffffff';
        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.fillText(
          `SCORE  ${String(gameState.score).padStart(5, '0')}`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 10
        );

        // PRESS SPACE (500ms 토글 깜박임)
        const showBlink = Math.floor(Date.now() / 500) % 2 === 0;
        if (showBlink) {
          ctx.fillStyle = '#ff00ff';
          ctx.shadowColor = '#ff00ff';
          ctx.shadowBlur = 10;
          ctx.font = "8px 'Press Start 2P', monospace";
          const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          ctx.fillText(
            isTouchDevice ? 'TAP TO START' : 'PRESS SPACE',
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 + 50
          );
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }
      }
```

- [ ] **Step 5: 브라우저에서 과일이 네온 글로우를 가지고, 게임오버 시 아케이드 화면이 나타나는지 확인**

- 과일 주변에 해당 레벨의 네온 색상 글로우가 보여야 한다
- 게임 오버 시 `GAME OVER` 황금 텍스트 + `PRESS SPACE` 핑크 깜박임이 나와야 한다
- 게임 오버 화면에서 Space 또는 탭으로 재시작이 되어야 한다

- [ ] **Step 6: 커밋**

```bash
git add src/components/Game.tsx
git commit -m "feat(design): Canvas 네온 글로우 과일 + 아케이드 게임오버 화면"
```

---

## Task 6: FruitSVG 픽셀 아트 전면 교체

**Files:**
- Rewrite: `src/engine/FruitSVG.ts`

- [ ] **Step 1: FruitSVG.ts 전체를 픽셀 아트 SVG로 교체**

`src/engine/FruitSVG.ts` 전체를 아래로 교체한다:

```ts
export class FruitSVG {
  private cache: Map<number, HTMLCanvasElement> = new Map();
  private readonly size = 80;

  getSVGForLevel(level: number): string {
    const fruits: Record<number, string> = {
      1: this.cherrySVG(),
      2: this.strawberrySVG(),
      3: this.grapeSVG(),
      4: this.dekoponfSVG(),
      5: this.kakiSVG(),
      6: this.appleSVG(),
      7: this.pearSVG(),
      8: this.peachSVG(),
      9: this.pineappleSVG(),
      10: this.melonSVG(),
      11: this.watermelonSVG(),
    };
    return fruits[level] || fruits[1];
  }

  private cherrySVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="1" height="3" fill="#3d2000"/>
      <rect x="7" y="0" width="1" height="3" fill="#3d2000"/>
      <rect x="3" y="1" width="4" height="1" fill="#3d2000"/>
      <rect x="2" y="4" width="1" height="4" fill="#ff0055"/>
      <rect x="3" y="3" width="2" height="6" fill="#ff0055"/>
      <rect x="5" y="4" width="1" height="4" fill="#ff0055"/>
      <rect x="6" y="4" width="1" height="4" fill="#cc0044"/>
      <rect x="7" y="3" width="2" height="6" fill="#cc0044"/>
      <rect x="9" y="4" width="1" height="4" fill="#cc0044"/>
      <rect x="3" y="4" width="1" height="1" fill="#ff6688"/>
      <rect x="7" y="4" width="1" height="1" fill="#ff6688"/>
    </svg>`;
  }

  private strawberrySVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="1" height="2" fill="#00aa33"/>
      <rect x="3" y="1" width="3" height="2" fill="#00aa33"/>
      <rect x="2" y="1" width="2" height="1" fill="#00cc44"/>
      <rect x="7" y="1" width="2" height="1" fill="#00cc44"/>
      <rect x="2" y="2" width="8" height="1" fill="#ff0055"/>
      <rect x="1" y="3" width="10" height="4" fill="#ff0055"/>
      <rect x="2" y="7" width="8" height="1" fill="#ff0055"/>
      <rect x="3" y="8" width="6" height="1" fill="#ff0055"/>
      <rect x="4" y="9" width="4" height="1" fill="#ff0055"/>
      <rect x="5" y="10" width="2" height="1" fill="#ff0055"/>
      <rect x="3" y="4" width="1" height="1" fill="#ffdd00"/>
      <rect x="6" y="3" width="1" height="1" fill="#ffdd00"/>
      <rect x="9" y="5" width="1" height="1" fill="#ffdd00"/>
      <rect x="4" y="6" width="1" height="1" fill="#ffdd00"/>
      <rect x="7" y="6" width="1" height="1" fill="#ffdd00"/>
      <rect x="2" y="3" width="1" height="1" fill="#ff4477"/>
    </svg>`;
  }

  private grapeSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="2" fill="#00aa33"/>
      <rect x="2" y="2" width="3" height="3" fill="#cc00ff"/>
      <rect x="7" y="2" width="3" height="3" fill="#aa00dd"/>
      <rect x="1" y="5" width="3" height="3" fill="#aa00dd"/>
      <rect x="4" y="5" width="4" height="3" fill="#cc00ff"/>
      <rect x="8" y="5" width="3" height="3" fill="#9900bb"/>
      <rect x="3" y="8" width="3" height="3" fill="#9900bb"/>
      <rect x="6" y="8" width="3" height="3" fill="#cc00ff"/>
      <rect x="2" y="2" width="1" height="1" fill="#ee44ff"/>
      <rect x="7" y="2" width="1" height="1" fill="#ee44ff"/>
      <rect x="4" y="5" width="1" height="1" fill="#ee44ff"/>
    </svg>`;
  }

  private dekoponfSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="4" height="2" fill="#ff9900"/>
      <rect x="5" y="0" width="1" height="1" fill="#00aa33"/>
      <rect x="1" y="2" width="10" height="1" fill="#ff9900"/>
      <rect x="0" y="3" width="12" height="6" fill="#ff9900"/>
      <rect x="1" y="9" width="10" height="1" fill="#ff9900"/>
      <rect x="2" y="10" width="8" height="1" fill="#ff9900"/>
      <rect x="4" y="11" width="4" height="1" fill="#ff9900"/>
      <rect x="1" y="3" width="2" height="2" fill="#ffbb33"/>
      <rect x="2" y="5" width="4" height="1" fill="#ffaa00"/>
      <rect x="7" y="4" width="2" height="2" fill="#ffbb33"/>
    </svg>`;
  }

  private kakiSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="4" height="1" fill="#006600"/>
      <rect x="3" y="1" width="2" height="2" fill="#008800"/>
      <rect x="7" y="1" width="2" height="2" fill="#006600"/>
      <rect x="5" y="1" width="2" height="1" fill="#00aa00"/>
      <rect x="1" y="2" width="10" height="1" fill="#ff8800"/>
      <rect x="0" y="3" width="12" height="6" fill="#ff8800"/>
      <rect x="1" y="9" width="10" height="1" fill="#ff8800"/>
      <rect x="2" y="10" width="8" height="1" fill="#ff8800"/>
      <rect x="4" y="11" width="4" height="1" fill="#ff8800"/>
      <rect x="0" y="6" width="12" height="1" fill="#ee7700"/>
      <rect x="1" y="3" width="2" height="2" fill="#ffaa44"/>
    </svg>`;
  }

  private appleSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="2" fill="#3d2000"/>
      <rect x="7" y="1" width="3" height="2" fill="#00aa33"/>
      <rect x="1" y="2" width="10" height="1" fill="#ee1111"/>
      <rect x="0" y="3" width="5" height="7" fill="#ee1111"/>
      <rect x="7" y="3" width="5" height="7" fill="#ee1111"/>
      <rect x="5" y="3" width="2" height="9" fill="#cc1100"/>
      <rect x="1" y="10" width="4" height="1" fill="#ee1111"/>
      <rect x="7" y="10" width="4" height="1" fill="#ee1111"/>
      <rect x="2" y="11" width="8" height="1" fill="#ee1111"/>
      <rect x="1" y="3" width="2" height="3" fill="#ff4444"/>
    </svg>`;
  }

  private pearSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="2" fill="#3d2000"/>
      <rect x="3" y="2" width="6" height="2" fill="#aacc00"/>
      <rect x="2" y="4" width="8" height="4" fill="#ccdd22"/>
      <rect x="1" y="5" width="10" height="4" fill="#ccdd22"/>
      <rect x="2" y="9" width="8" height="1" fill="#ccdd22"/>
      <rect x="3" y="10" width="6" height="1" fill="#aacc00"/>
      <rect x="4" y="11" width="4" height="1" fill="#88aa00"/>
      <rect x="2" y="3" width="2" height="2" fill="#ddee44"/>
      <rect x="5" y="5" width="1" height="1" fill="#bbcc11"/>
    </svg>`;
  }

  private peachSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="1" height="2" fill="#00aa33"/>
      <rect x="1" y="2" width="10" height="1" fill="#ffaaaa"/>
      <rect x="0" y="3" width="12" height="6" fill="#ffaaaa"/>
      <rect x="1" y="9" width="10" height="1" fill="#ffaaaa"/>
      <rect x="2" y="10" width="8" height="1" fill="#ff8888"/>
      <rect x="4" y="11" width="4" height="1" fill="#ff6666"/>
      <rect x="5" y="1" width="2" height="11" fill="#ff8899"/>
      <rect x="1" y="3" width="2" height="3" fill="#ffcccc"/>
    </svg>`;
  }

  private pineappleSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="0" width="2" height="3" fill="#00aa33"/>
      <rect x="5" y="0" width="2" height="4" fill="#00cc44"/>
      <rect x="8" y="0" width="2" height="3" fill="#00aa33"/>
      <rect x="1" y="3" width="10" height="7" fill="#ffdd00"/>
      <rect x="2" y="10" width="8" height="1" fill="#ffdd00"/>
      <rect x="3" y="11" width="6" height="1" fill="#eebb00"/>
      <rect x="1" y="5" width="10" height="1" fill="#ccaa00"/>
      <rect x="1" y="7" width="10" height="1" fill="#ccaa00"/>
      <rect x="3" y="3" width="1" height="8" fill="#ccaa00"/>
      <rect x="6" y="3" width="1" height="8" fill="#ccaa00"/>
      <rect x="9" y="3" width="1" height="8" fill="#ccaa00"/>
    </svg>`;
  }

  private melonSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="1" fill="#3d2000"/>
      <rect x="1" y="1" width="10" height="2" fill="#99cc66"/>
      <rect x="0" y="3" width="12" height="6" fill="#99cc66"/>
      <rect x="1" y="9" width="10" height="2" fill="#99cc66"/>
      <rect x="3" y="11" width="6" height="1" fill="#77aa44"/>
      <rect x="0" y="4" width="12" height="1" fill="#bbee88"/>
      <rect x="0" y="7" width="12" height="1" fill="#bbee88"/>
      <rect x="2" y="1" width="1" height="10" fill="#bbee88"/>
      <rect x="5" y="1" width="1" height="10" fill="#aabb77"/>
      <rect x="9" y="1" width="1" height="10" fill="#bbee88"/>
      <rect x="1" y="2" width="2" height="2" fill="#ccee99"/>
    </svg>`;
  }

  private watermelonSVG(): string {
    return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="8" height="1" fill="#005500"/>
      <rect x="2" y="1" width="12" height="2" fill="#007700"/>
      <rect x="1" y="3" width="14" height="10" fill="#009900"/>
      <rect x="2" y="13" width="12" height="2" fill="#007700"/>
      <rect x="4" y="15" width="8" height="1" fill="#005500"/>
      <rect x="2" y="4" width="12" height="8" fill="#ff1155"/>
      <rect x="1" y="5" width="1" height="6" fill="#ff1155"/>
      <rect x="14" y="5" width="1" height="6" fill="#ff1155"/>
      <rect x="3" y="1" width="2" height="3" fill="#00bb00"/>
      <rect x="7" y="1" width="2" height="3" fill="#00aa00"/>
      <rect x="11" y="1" width="2" height="3" fill="#00bb00"/>
      <rect x="4" y="7" width="2" height="2" fill="#111111"/>
      <rect x="8" y="6" width="2" height="2" fill="#111111"/>
      <rect x="11" y="9" width="2" height="2" fill="#111111"/>
      <rect x="2" y="4" width="2" height="2" fill="#ff4477"/>
    </svg>`;
  }

  getCanvasForLevel(level: number): HTMLCanvasElement {
    if (this.cache.has(level)) {
      return this.cache.get(level)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.size;
    canvas.height = this.size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const svg = this.getSVGForLevel(level);
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, this.size, this.size);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);

    this.cache.set(level, canvas);
    return canvas;
  }
}
```

- [ ] **Step 2: 브라우저에서 과일이 픽셀 아트로 바뀌었는지 확인**

게임을 실행해서:
- 체리(LV1)부터 수박(LV11)까지 모두 도트 픽셀 스타일로 표시되어야 한다
- 합치기 시 픽셀 아트 과일이 올바르게 표시되어야 한다
- 과일이 캔버스 밖으로 나가지 않고 물리 동작이 정상인지 확인 (로직은 변경 없음)

- [ ] **Step 3: 커밋**

```bash
git add src/engine/FruitSVG.ts
git commit -m "feat(design): 11개 과일 SVG 픽셀 아트로 전면 교체"
```

---

## 완료 확인 체크리스트

- [ ] 전체 배경이 `#0a0a1a` 어두운 남색이다
- [ ] 캔버스 테두리가 시안 네온(`#00ffff`) + 글로우다
- [ ] `★ FRUIT GAME ★` 황금 타이틀이 표시된다
- [ ] `1UP` / `HI SCORE` 점수판이 표시된다
- [ ] 캔버스 내부가 순수 검정(`#000000`)이다
- [ ] 스폰라인이 붉은 네온 점선이다
- [ ] 과일 주변에 레벨별 네온 글로우가 있다
- [ ] 과일 아이콘이 픽셀 아트 스타일이다
- [ ] 게임오버 시 황금 `GAME OVER` + 깜박이는 핑크 `PRESS SPACE`가 표시된다
- [ ] Space/탭으로 재시작이 정상 작동한다
- [ ] 모바일 터치 조작이 정상이다
