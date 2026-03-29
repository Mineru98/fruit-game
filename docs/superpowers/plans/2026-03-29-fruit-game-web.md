# 과일 게임 웹 구현 기획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 엑셀 수박 게임의 물리 엔진, 충돌 감지, 게임 메커니즘을 Canvas와 JavaScript로 웹 애플리케이션으로 구현하기

**Architecture:**
- **렌더링**: Canvas 2D를 사용한 프레임 기반 렌더링
- **물리**: 중력, 마찰력, 벡터 반발력을 구현한 간단한 물리 엔진
- **충돌**: 유클리드 거리 공식 기반의 원형 충돌 감지 및 반응
- **게임 로직**: 과일 합치기(레벨 진화), 점수 시스템, 게임 오버 판정
- **입력**: 키보드(좌우 방향키) 및 스페이스바 입력 처리

**Tech Stack:**
- HTML5 Canvas (렌더링)
- JavaScript ES6+ (게임 로직)
- CSS3 (UI)
- Jest (단위 테스트)

---

## 파일 구조

```
fruit-game/
├── src/
│   ├── index.html              # 게임 메인 페이지
│   ├── styles.css              # 게임 UI 스타일
│   ├── Game.js                 # 게임 메인 클래스
│   ├── Fruit.js                # 과일 객체 클래스
│   ├── Physics.js              # 물리 엔진
│   ├── CollisionDetector.js     # 충돌 감지 및 처리
│   ├── GameState.js            # 게임 상태 관리
│   └── InputHandler.js         # 입력 처리
├── tests/
│   ├── Fruit.test.js
│   ├── Physics.test.js
│   ├── CollisionDetector.test.js
│   └── GameState.test.js
├── package.json
└── README.md
```

---

## Task 1: 프로젝트 초기화 및 개발 환경 구성

**Files:**
- Create: `package.json`
- Create: `src/index.html`
- Create: `.gitignore`

- [ ] **Step 1: package.json 생성**

```bash
cd /Users/imgeunseog/Documents/Github/fruit-game
npm init -y
```

- [ ] **Step 2: 필요한 의존성 설치**

```bash
npm install --save-dev jest @babel/preset-env babel-jest
```

- [ ] **Step 3: package.json 수정하여 jest 설정 추가**

`package.json`의 `scripts` 섹션을 다음과 같이 수정:

```json
{
  "name": "fruit-game",
  "version": "1.0.0",
  "description": "Fruit Game - Physics-based casual game",
  "main": "src/Game.js",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "start": "python3 -m http.server 8000"
  },
  "keywords": ["game", "physics", "canvas"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@babel/preset-env": "^7.23.0",
    "babel-jest": "^29.0.0",
    "jest": "^29.0.0"
  }
}
```

- [ ] **Step 4: src/index.html 생성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>과일 게임</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="game-header">
            <h1>과일 게임</h1>
            <div class="score-board">
                <div class="score">점수: <span id="score">0</span></div>
            </div>
        </div>
        <canvas id="gameCanvas" width="400" height="600"></canvas>
        <div class="game-controls">
            <p>좌/우 방향키로 과일을 조준</p>
            <p>스페이스바를 누르면 과일이 떨어짐</p>
        </div>
    </div>

    <script src="Fruit.js"></script>
    <script src="Physics.js"></script>
    <script src="CollisionDetector.js"></script>
    <script src="GameState.js"></script>
    <script src="InputHandler.js"></script>
    <script src="Game.js"></script>
</body>
</html>
```

- [ ] **Step 5: .gitignore 생성**

```
node_modules/
.DS_Store
dist/
*.log
npm-debug.log*
```

- [ ] **Step 6: Commit**

```bash
git add package.json src/index.html .gitignore
git commit -m "chore: initialize project structure and setup npm"
```

---

## Task 2: 과일 객체 클래스 구현

**Files:**
- Create: `src/Fruit.js`
- Create: `tests/Fruit.test.js`

- [ ] **Step 1: Fruit 테스트 파일 작성**

```javascript
// tests/Fruit.test.js
import Fruit from '../src/Fruit.js';

describe('Fruit', () => {
  let fruit;

  beforeEach(() => {
    fruit = new Fruit(100, 50, 1);
  });

  test('should create fruit with initial properties', () => {
    expect(fruit.x).toBe(100);
    expect(fruit.y).toBe(50);
    expect(fruit.level).toBe(1);
    expect(fruit.vx).toBe(0);
    expect(fruit.vy).toBe(0);
  });

  test('should calculate radius based on level', () => {
    const fruit1 = new Fruit(0, 0, 1);
    const fruit2 = new Fruit(0, 0, 2);
    expect(fruit2.radius).toBeGreaterThan(fruit1.radius);
  });

  test('should have correct color based on level', () => {
    const fruit1 = new Fruit(0, 0, 1);
    const fruit2 = new Fruit(0, 0, 2);
    expect(fruit1.color).toBeDefined();
    expect(fruit2.color).toBeDefined();
    expect(fruit1.color).not.toBe(fruit2.color);
  });

  test('should update position based on velocity', () => {
    fruit.vx = 5;
    fruit.vy = 10;
    fruit.updatePosition();
    expect(fruit.x).toBe(105);
    expect(fruit.y).toBe(60);
  });

  test('should not move if velocity is zero', () => {
    const initialX = fruit.x;
    const initialY = fruit.y;
    fruit.updatePosition();
    expect(fruit.x).toBe(initialX);
    expect(fruit.y).toBe(initialY);
  });

  test('should track if fruit is active', () => {
    expect(fruit.isActive).toBe(true);
    fruit.isActive = false;
    expect(fruit.isActive).toBe(false);
  });

  test('should get next level fruit properties when merged', () => {
    expect(Fruit.getNextLevel(1)).toBe(2);
    expect(Fruit.getNextLevel(10)).toBe(11);
  });

  test('should get score based on level', () => {
    const fruit1 = new Fruit(0, 0, 1);
    const fruit2 = new Fruit(0, 0, 2);
    expect(fruit2.getScore()).toBeGreaterThan(fruit1.getScore());
  });
});
```

- [ ] **Step 2: Fruit 클래스 구현**

```javascript
// src/Fruit.js
class Fruit {
  // 과일 레벨별 색상 정의
  static COLORS = {
    1: '#FF6B6B',  // 빨강
    2: '#4ECDC4',  // 청록
    3: '#45B7D1',  // 파랑
    4: '#FFA07A',  // 연한 주황
    5: '#FFD700',  // 금색
    6: '#FF69B4',  // 분홍
    7: '#9370DB',  // 보라
    8: '#FF4500',  // 주황빨강
    9: '#20B2AA',  // 연한 바다색
    10: '#FFB6C1', // 밝은 분홍
  };

  // 레벨별 반지름 계산 (기본: 레벨 1 = 15px)
  static getRadius(level) {
    return 15 + (level - 1) * 5;
  }

  // 레벨별 점수 계산
  static getScoreForLevel(level) {
    return Math.pow(2, level) * 10;
  }

  constructor(x, y, level = 1) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.vx = 0;  // X축 속도
    this.vy = 0;  // Y축 속도
    this.radius = Fruit.getRadius(level);
    this.color = Fruit.COLORS[level] || '#999999';
    this.isActive = true;
    this.createdAt = Date.now();
  }

  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }

  getScore() {
    return Fruit.getScoreForLevel(this.level);
  }

  // 두 과일의 충돌 여부 판단
  isCollidingWith(otherFruit) {
    const dx = this.x - otherFruit.x;
    const dy = this.y - otherFruit.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + otherFruit.radius;
  }

  // 과일을 그리기 위한 정보 반환
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// CommonJS export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fruit;
}
```

- [ ] **Step 3: 테스트 실행**

```bash
npm test -- tests/Fruit.test.js
```

Expected: 모든 테스트 PASS

- [ ] **Step 4: Commit**

```bash
git add src/Fruit.js tests/Fruit.test.js
git commit -m "feat: implement Fruit class with level and collision detection"
```

---

## Task 3: 물리 엔진 구현

**Files:**
- Create: `src/Physics.js`
- Create: `tests/Physics.test.js`

- [ ] **Step 1: Physics 테스트 작성**

```javascript
// tests/Physics.test.js
import Physics from '../src/Physics.js';

describe('Physics', () => {
  test('should apply gravity to fruit', () => {
    const physics = new Physics();
    const fruit = { vy: 0 };
    physics.applyGravity(fruit);
    expect(fruit.vy).toBeGreaterThan(0);
  });

  test('should apply consistent gravity', () => {
    const physics = new Physics();
    const fruit = { vy: 0 };
    physics.applyGravity(fruit);
    const firstVy = fruit.vy;
    physics.applyGravity(fruit);
    expect(fruit.vy).toBe(firstVy * 2);
  });

  test('should apply friction to velocity', () => {
    const physics = new Physics();
    const fruit = { vx: 10, vy: 0 };
    physics.applyFriction(fruit);
    expect(fruit.vx).toBeLessThan(10);
    expect(fruit.vx).toBeGreaterThan(0);
  });

  test('should stop velocity below threshold', () => {
    const physics = new Physics();
    const fruit = { vx: 0.01 };
    physics.applyFriction(fruit);
    expect(fruit.vx).toBe(0);
  });

  test('should handle collision between two fruits', () => {
    const physics = new Physics();
    const fruit1 = {
      x: 100,
      y: 100,
      vx: 5,
      vy: 0,
      radius: 15,
    };
    const fruit2 = {
      x: 130,
      y: 100,
      vx: -5,
      vy: 0,
      radius: 15,
    };

    physics.resolveCollision(fruit1, fruit2);

    // 충돌 후 속도가 변해야 함
    expect(fruit1.vx).not.toBe(5);
    expect(fruit2.vx).not.toBe(-5);
  });

  test('should prevent fruits from overlapping too much', () => {
    const physics = new Physics();
    const fruit1 = { x: 100, y: 100, radius: 15 };
    const fruit2 = { x: 105, y: 100, radius: 15 }; // 겹침

    physics.separateFruits(fruit1, fruit2);

    const distance = Math.sqrt(
      (fruit1.x - fruit2.x) ** 2 + (fruit1.y - fruit2.y) ** 2
    );
    expect(distance).toBeGreaterThanOrEqual(fruit1.radius + fruit2.radius);
  });
});
```

- [ ] **Step 2: Physics 클래스 구현**

```javascript
// src/Physics.js
class Physics {
  constructor(
    gravity = 0.5,
    friction = 0.98,
    velocityThreshold = 0.1,
    damping = 0.8
  ) {
    this.gravity = gravity;
    this.friction = friction;
    this.velocityThreshold = velocityThreshold;
    this.damping = damping; // 충돌 시 에너지 손실
  }

  // 과일에 중력 적용
  applyGravity(fruit) {
    fruit.vy += this.gravity;
  }

  // 마찰력 적용
  applyFriction(fruit) {
    fruit.vx *= this.friction;
    fruit.vy *= this.friction;

    // 임계값 이하의 속도는 0으로 설정
    if (Math.abs(fruit.vx) < this.velocityThreshold) {
      fruit.vx = 0;
    }
    if (Math.abs(fruit.vy) < this.velocityThreshold) {
      fruit.vy = 0;
    }
  }

  // 두 과일의 충돌 처리 (벡터 반발력)
  resolveCollision(fruit1, fruit2) {
    // 충돌 벡터 계산
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    // 정규화된 충돌 벡터
    const nx = dx / distance;
    const ny = dy / distance;

    // 상대 속도
    const dvx = fruit2.vx - fruit1.vx;
    const dvy = fruit2.vy - fruit1.vy;

    // 충돌 방향에 따른 상대 속도
    const dvn = dvx * nx + dvy * ny;

    // 이미 떨어지고 있으면 반응 안 함
    if (dvn >= 0) return;

    // 반발력 적용
    const impulse = dvn * this.damping;
    fruit1.vx += impulse * nx;
    fruit1.vy += impulse * ny;
    fruit2.vx -= impulse * nx;
    fruit2.vy -= impulse * ny;
  }

  // 겹친 과일들을 분리
  separateFruits(fruit1, fruit2) {
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = fruit1.radius + fruit2.radius;

    if (distance < minDistance) {
      const overlap = minDistance - distance;
      const nx = dx / (distance || 1);
      const ny = dy / (distance || 1);

      // 각각 겹침의 절반씩 이동
      fruit1.x -= (overlap / 2) * nx;
      fruit1.y -= (overlap / 2) * ny;
      fruit2.x += (overlap / 2) * nx;
      fruit2.y += (overlap / 2) * ny;
    }
  }

  // 벽에 충돌 시 반사
  handleBoundaryCollision(fruit, canvasWidth, canvasHeight) {
    // 좌우 벽
    if (fruit.x - fruit.radius < 0) {
      fruit.x = fruit.radius;
      fruit.vx *= -this.damping;
    } else if (fruit.x + fruit.radius > canvasWidth) {
      fruit.x = canvasWidth - fruit.radius;
      fruit.vx *= -this.damping;
    }

    // 바닥
    if (fruit.y + fruit.radius > canvasHeight) {
      fruit.y = canvasHeight - fruit.radius;
      fruit.vy *= -this.damping;
    }

    // 천장
    if (fruit.y - fruit.radius < 0) {
      fruit.y = fruit.radius;
      fruit.vy *= -this.damping;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Physics;
}
```

- [ ] **Step 3: 테스트 실행**

```bash
npm test -- tests/Physics.test.js
```

Expected: 모든 테스트 PASS

- [ ] **Step 4: Commit**

```bash
git add src/Physics.js tests/Physics.test.js
git commit -m "feat: implement physics engine with gravity, friction, and collision"
```

---

## Task 4: 충돌 감지 시스템 구현

**Files:**
- Create: `src/CollisionDetector.js`
- Create: `tests/CollisionDetector.test.js`

- [ ] **Step 1: CollisionDetector 테스트 작성**

```javascript
// tests/CollisionDetector.test.js
import CollisionDetector from '../src/CollisionDetector.js';
import Fruit from '../src/Fruit.js';

describe('CollisionDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new CollisionDetector();
  });

  test('should detect collision between overlapping fruits', () => {
    const fruit1 = new Fruit(100, 100, 1);
    const fruit2 = new Fruit(110, 100, 1);
    expect(detector.detectCollision(fruit1, fruit2)).toBe(true);
  });

  test('should not detect collision between distant fruits', () => {
    const fruit1 = new Fruit(100, 100, 1);
    const fruit2 = new Fruit(200, 200, 1);
    expect(detector.detectCollision(fruit1, fruit2)).toBe(false);
  });

  test('should find all collision pairs in array', () => {
    const fruits = [
      new Fruit(100, 100, 1),
      new Fruit(110, 100, 1),
      new Fruit(200, 200, 1),
    ];
    const collisions = detector.findCollisions(fruits);
    expect(collisions.length).toBe(1);
    expect(collisions[0]).toEqual([0, 1]);
  });

  test('should return empty array when no collisions', () => {
    const fruits = [
      new Fruit(100, 100, 1),
      new Fruit(200, 200, 1),
      new Fruit(300, 300, 1),
    ];
    const collisions = detector.findCollisions(fruits);
    expect(collisions.length).toBe(0);
  });

  test('should identify mergeable fruits (same level)', () => {
    const fruit1 = new Fruit(100, 100, 2);
    const fruit2 = new Fruit(110, 100, 2);
    expect(detector.canMerge(fruit1, fruit2)).toBe(true);
  });

  test('should not merge fruits of different levels', () => {
    const fruit1 = new Fruit(100, 100, 1);
    const fruit2 = new Fruit(110, 100, 2);
    expect(detector.canMerge(fruit1, fruit2)).toBe(false);
  });
});
```

- [ ] **Step 2: CollisionDetector 클래스 구현**

```javascript
// src/CollisionDetector.js
class CollisionDetector {
  constructor() {
    this.collisionPairs = [];
  }

  // 두 과일 간의 충돌 감지
  detectCollision(fruit1, fruit2) {
    if (!fruit1.isActive || !fruit2.isActive) return false;

    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < fruit1.radius + fruit2.radius;
  }

  // 배열의 모든 과일에 대해 충돌 쌍 찾기
  findCollisions(fruits) {
    this.collisionPairs = [];

    for (let i = 0; i < fruits.length; i++) {
      for (let j = i + 1; j < fruits.length; j++) {
        if (this.detectCollision(fruits[i], fruits[j])) {
          this.collisionPairs.push([i, j]);
        }
      }
    }

    return this.collisionPairs;
  }

  // 두 과일이 병합 가능한지 확인 (같은 레벨)
  canMerge(fruit1, fruit2) {
    return (
      fruit1.isActive &&
      fruit2.isActive &&
      fruit1.level === fruit2.level &&
      this.detectCollision(fruit1, fruit2)
    );
  }

  // 병합된 과일의 중심점 계산
  getMergePosition(fruit1, fruit2) {
    return {
      x: (fruit1.x + fruit2.x) / 2,
      y: (fruit1.y + fruit2.y) / 2,
    };
  }

  // 병합된 과일의 속도 계산 (가중 평균)
  getMergeVelocity(fruit1, fruit2) {
    return {
      vx: (fruit1.vx + fruit2.vx) / 2,
      vy: (fruit1.vy + fruit2.vy) / 2,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollisionDetector;
}
```

- [ ] **Step 3: 테스트 실행**

```bash
npm test -- tests/CollisionDetector.test.js
```

Expected: 모든 테스트 PASS

- [ ] **Step 4: Commit**

```bash
git add src/CollisionDetector.js tests/CollisionDetector.test.js
git commit -m "feat: implement collision detection and merge logic"
```

---

## Task 5: 게임 상태 관리 구현

**Files:**
- Create: `src/GameState.js`
- Create: `tests/GameState.test.js`

- [ ] **Step 1: GameState 테스트 작성**

```javascript
// tests/GameState.test.js
import GameState from '../src/GameState.js';
import Fruit from '../src/Fruit.js';

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  test('should initialize with zero score', () => {
    expect(gameState.score).toBe(0);
  });

  test('should add score correctly', () => {
    gameState.addScore(100);
    expect(gameState.score).toBe(100);
    gameState.addScore(50);
    expect(gameState.score).toBe(150);
  });

  test('should add fruit to the game', () => {
    const fruit = new Fruit(100, 100, 1);
    gameState.addFruit(fruit);
    expect(gameState.fruits.length).toBe(1);
  });

  test('should remove inactive fruits', () => {
    const fruit1 = new Fruit(100, 100, 1);
    const fruit2 = new Fruit(200, 200, 1);
    gameState.addFruit(fruit1);
    gameState.addFruit(fruit2);
    fruit1.isActive = false;
    gameState.cleanup();
    expect(gameState.fruits.length).toBe(1);
    expect(gameState.fruits[0]).toBe(fruit2);
  });

  test('should track next fruit to spawn', () => {
    expect(gameState.nextFruitLevel).toBe(1);
    gameState.nextFruitLevel = 2;
    expect(gameState.nextFruitLevel).toBe(2);
  });

  test('should check if game is over', () => {
    expect(gameState.isGameOver).toBe(false);
    gameState.setGameOver();
    expect(gameState.isGameOver).toBe(true);
  });

  test('should track frame count', () => {
    expect(gameState.frameCount).toBe(0);
    gameState.incrementFrame();
    expect(gameState.frameCount).toBe(1);
  });

  test('should get all active fruits', () => {
    const fruit1 = new Fruit(100, 100, 1);
    const fruit2 = new Fruit(200, 200, 1);
    gameState.addFruit(fruit1);
    gameState.addFruit(fruit2);
    fruit1.isActive = false;

    const activeFruits = gameState.getActiveFruits();
    expect(activeFruits.length).toBe(1);
    expect(activeFruits[0]).toBe(fruit2);
  });
});
```

- [ ] **Step 2: GameState 클래스 구현**

```javascript
// src/GameState.js
class GameState {
  constructor() {
    this.fruits = [];
    this.score = 0;
    this.isGameOver = false;
    this.nextFruitLevel = 1;
    this.frameCount = 0;
    this.spawnPosition = null; // 다음 과일이 스폰될 위치
  }

  // 점수 추가
  addScore(points) {
    this.score += points;
  }

  // 과일 추가
  addFruit(fruit) {
    this.fruits.push(fruit);
  }

  // 과일 제거
  removeFruit(fruit) {
    const index = this.fruits.indexOf(fruit);
    if (index > -1) {
      this.fruits.splice(index, 1);
    }
  }

  // 비활성 과일 제거
  cleanup() {
    this.fruits = this.fruits.filter((fruit) => fruit.isActive);
  }

  // 활성 과일만 반환
  getActiveFruits() {
    return this.fruits.filter((fruit) => fruit.isActive);
  }

  // 게임 오버 설정
  setGameOver() {
    this.isGameOver = true;
  }

  // 프레임 카운트 증가
  incrementFrame() {
    this.frameCount++;
  }

  // 게임 상태 리셋
  reset() {
    this.fruits = [];
    this.score = 0;
    this.isGameOver = false;
    this.nextFruitLevel = 1;
    this.frameCount = 0;
  }

  // 과일이 캔버스를 벗어났는지 확인
  isFruitOutOfBounds(fruit, canvasHeight) {
    return fruit.y - fruit.radius > canvasHeight;
  }

  // 게임 오버 조건 확인 (과일이 캔버스 상단을 벗어남)
  checkGameOver(canvasHeight, spawnY) {
    return this.fruits.some(
      (fruit) => fruit.y - fruit.radius < spawnY && fruit.vy < 0
    );
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
}
```

- [ ] **Step 3: 테스트 실행**

```bash
npm test -- tests/GameState.test.js
```

Expected: 모든 테스트 PASS

- [ ] **Step 4: Commit**

```bash
git add src/GameState.js tests/GameState.test.js
git commit -m "feat: implement game state management"
```

---

## Task 6: 입력 처리 시스템 구현

**Files:**
- Create: `src/InputHandler.js`

- [ ] **Step 1: InputHandler 클래스 구현**

```javascript
// src/InputHandler.js
class InputHandler {
  constructor() {
    this.keys = {};
    this.direction = 0; // -1: left, 0: none, 1: right
    this.firePressed = false;

    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    this.keys[e.key] = true;

    // 방향키 처리
    if (e.key === 'ArrowLeft') {
      this.direction = -1;
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      this.direction = 1;
      e.preventDefault();
    } else if (e.key === ' ') {
      this.firePressed = true;
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    this.keys[e.key] = false;

    // 방향키 해제
    if (e.key === 'ArrowLeft' && this.direction === -1) {
      this.direction = 0;
    } else if (e.key === 'ArrowRight' && this.direction === 1) {
      this.direction = 0;
    } else if (e.key === ' ') {
      this.firePressed = false;
    }
  }

  getDirection() {
    return this.direction;
  }

  isFiring() {
    const wasFiring = this.firePressed;
    this.firePressed = false;
    return wasFiring;
  }

  reset() {
    this.keys = {};
    this.direction = 0;
    this.firePressed = false;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/InputHandler.js
git commit -m "feat: implement keyboard input handler"
```

---

## Task 7: 메인 게임 클래스 구현

**Files:**
- Create: `src/Game.js`
- Create: `src/styles.css`

- [ ] **Step 1: Game 클래스 구현**

```javascript
// src/Game.js
class Game {
  constructor(canvasId = 'gameCanvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // 게임 시스템 초기화
    this.gameState = new GameState();
    this.physics = new Physics();
    this.collisionDetector = new CollisionDetector();
    this.inputHandler = new InputHandler();

    // 게임 설정
    this.spawnX = this.width / 2;
    this.spawnY = 30;
    this.nextFruitTimer = 0;
    this.nextFruitDelay = 60; // 60 프레임 = 1초 (60fps 기준)
    this.isRunning = false;
    this.animationFrameId = null;

    // 색상 정의
    this.backgroundColor = '#f5f5f5';
    this.nextFruitPreviewColor = 'rgba(0, 0, 0, 0.1)';
  }

  start() {
    this.isRunning = true;
    this.gameState.reset();
    this.gameState.spawnPosition = { x: this.spawnX, y: this.spawnY };
    this.spawn(); // 첫 과일 생성
    this.gameLoop();
  }

  gameLoop = () => {
    this.update();
    this.draw();
    this.gameState.incrementFrame();

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
  };

  update() {
    if (this.gameState.isGameOver) return;

    const activeFruits = this.gameState.getActiveFruits();

    // 물리 업데이트
    activeFruits.forEach((fruit) => {
      this.physics.applyGravity(fruit);
      this.physics.applyFriction(fruit);
      fruit.updatePosition();
      this.physics.handleBoundaryCollision(
        fruit,
        this.width,
        this.height
      );
    });

    // 충돌 감지
    const collisions = this.collisionDetector.findCollisions(activeFruits);

    // 충돌 처리
    for (const [i, j] of collisions) {
      const fruit1 = activeFruits[i];
      const fruit2 = activeFruits[j];

      // 물리 엔진 적용
      this.physics.resolveCollision(fruit1, fruit2);

      // 병합 가능 여부 확인
      if (this.collisionDetector.canMerge(fruit1, fruit2)) {
        this.mergeFruits(fruit1, fruit2);
      }
    }

    // 겹친 과일 분리 (여러 번 실행)
    for (let iter = 0; iter < 5; iter++) {
      for (const [i, j] of collisions) {
        const fruit1 = activeFruits[i];
        const fruit2 = activeFruits[j];
        if (fruit1.isActive && fruit2.isActive) {
          this.physics.separateFruits(fruit1, fruit2);
        }
      }
    }

    // 게임 오버 확인
    if (this.gameState.checkGameOver(this.height, this.spawnY)) {
      this.gameState.setGameOver();
    }

    // 스폰 타이머 업데이트
    this.nextFruitTimer++;
    if (
      this.nextFruitTimer >= this.nextFruitDelay &&
      activeFruits.length < 15
    ) {
      this.spawn();
      this.nextFruitTimer = 0;
    }

    // 입력 처리
    const direction = this.inputHandler.getDirection();
    if (direction !== 0) {
      const moveSpeed = 5;
      this.spawnX += direction * moveSpeed;
      this.spawnX = Math.max(
        15 + this.gameState.nextFruitLevel * 2.5,
        Math.min(this.width - (15 + this.gameState.nextFruitLevel * 2.5), this.spawnX)
      );
    }

    if (this.inputHandler.isFiring()) {
      this.spawnFruit();
    }

    // 정리
    this.gameState.cleanup();

    // UI 업데이트
    this.updateUI();
  }

  draw() {
    // 배경
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 다음 과일 미리보기
    this.drawNextFruitPreview();

    // 과일들 그리기
    this.gameState.fruits.forEach((fruit) => {
      fruit.draw(this.ctx);
    });

    // 게임 오버 표시
    if (this.gameState.isGameOver) {
      this.drawGameOver();
    }
  }

  drawNextFruitPreview() {
    const radius = 15 + (this.gameState.nextFruitLevel - 1) * 5;
    this.ctx.fillStyle = this.nextFruitPreviewColor;
    this.ctx.beginPath();
    this.ctx.arc(this.spawnX, this.spawnY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // 다음 과일 색상 표시
    const nextLevel = this.gameState.nextFruitLevel;
    const fruitClass = Fruit;
    const color = fruitClass.COLORS[nextLevel] || '#999999';
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = 0.5;
    this.ctx.beginPath();
    this.ctx.arc(this.spawnX, this.spawnY, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('게임 오버', this.width / 2, this.height / 2 - 30);

    this.ctx.font = '20px Arial';
    this.ctx.fillText(`점수: ${this.gameState.score}`, this.width / 2, this.height / 2 + 20);
  }

  spawn() {
    const level = this.gameState.nextFruitLevel;
    const nextLevel = Math.min(level + 1, 11); // 최대 레벨 11로 제한
    this.gameState.nextFruitLevel = nextLevel;
  }

  spawnFruit() {
    const level = this.gameState.nextFruitLevel - 1;
    const fruit = new Fruit(this.spawnX, this.spawnY, level);
    this.gameState.addFruit(fruit);
    this.spawn();
  }

  mergeFruits(fruit1, fruit2) {
    const newLevel = fruit1.level + 1;
    const position = this.collisionDetector.getMergePosition(fruit1, fruit2);
    const velocity = this.collisionDetector.getMergeVelocity(fruit1, fruit2);

    const newFruit = new Fruit(position.x, position.y, newLevel);
    newFruit.vx = velocity.vx;
    newFruit.vy = velocity.vy;

    this.gameState.addScore(newFruit.getScore());
    this.gameState.addFruit(newFruit);

    fruit1.isActive = false;
    fruit2.isActive = false;
  }

  updateUI() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      scoreElement.textContent = this.gameState.score;
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  restart() {
    this.stop();
    this.start();
  }
}

// 페이지 로드 시 게임 시작
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game('gameCanvas');
  game.start();

  // 게임 오버 후 재시작 가능하도록 스페이스바 처리
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && game.gameState.isGameOver) {
      game.restart();
      e.preventDefault();
    }
  });
});
```

- [ ] **Step 2: styles.css 작성**

```css
/* src/styles.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.game-header h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 15px;
}

.score-board {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
}

.score {
  display: inline-block;
}

#gameCanvas {
  display: block;
  background: #f5f5f5;
  border: 3px solid #333;
  border-radius: 10px;
  margin: 20px auto;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
  cursor: none;
}

.game-controls {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
  line-height: 1.8;
}

.game-controls p {
  margin: 5px 0;
}

/* 반응형 디자인 */
@media (max-width: 600px) {
  .container {
    padding: 20px;
    border-radius: 15px;
  }

  .game-header h1 {
    font-size: 24px;
  }

  #gameCanvas {
    margin: 15px auto;
    border-width: 2px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/Game.js src/styles.css
git commit -m "feat: implement main game loop and UI styling"
```

---

## Task 8: 게임 실행 및 통합 테스트

**Files:**
- Modify: `src/index.html`

- [ ] **Step 1: 모든 테스트 실행**

```bash
npm test
```

Expected: 모든 테스트 PASS (4개 파일, 30개 이상의 테스트)

- [ ] **Step 2: 게임 서버 시작**

```bash
npm start
```

Output: Serving HTTP on port 8000

- [ ] **Step 3: 브라우저에서 게임 실행**

```
http://localhost:8000/src/index.html
```

Expected:
- 캔버스에 게임판이 보여야 함
- 좌/우 방향키로 과일 위치 조정 가능
- 스페이스바로 과일 떨어짐
- 떨어진 과일에 중력 적용되어 아래로 이동
- 과일끼리 부딪히면 밀려남
- 같은 과일끼리 부딪히면 합쳐짐
- 점수 증가
- 과일이 상단에 도달하면 게임 오버

- [ ] **Step 4: Commit**

```bash
git add src/index.html
git commit -m "chore: update html and verify game is playable"
```

---

## Task 9: 게임 밸런싱 및 최적화

**Files:**
- Modify: `src/Physics.js`
- Modify: `src/Game.js`

- [ ] **Step 1: Physics 파라미터 조정**

게임의 느낌을 조정하기 위해 `src/Physics.js`의 Physics 생성자 호출 부분에서:

```javascript
// src/Game.js의 constructor에서
this.physics = new Physics(
  0.5,    // gravity (중력)
  0.96,   // friction (마찰력, 낮을수록 더 빨리 멈춤)
  0.1,    // velocityThreshold
  0.75    // damping (충돌 반발력, 낮을수록 더 많은 에너지 손실)
);
```

- [ ] **Step 2: 게임 난이도 파라미터 조정**

```javascript
// src/Game.js의 constructor에서
this.nextFruitDelay = 45; // 프레임 (낮을수록 자주 생성)
```

- [ ] **Step 3: Commit**

```bash
git add src/Physics.js src/Game.js
git commit -m "chore: tune physics parameters for better game feel"
```

---

## Task 10: README 및 문서 작성

**Files:**
- Create: `README.md`
- Create: `docs/ARCHITECTURE.md`

- [ ] **Step 1: README.md 작성**

```markdown
# 과일 게임 (Fruit Game)

웹 기술로 구현한 물리 엔진 기반 캐주얼 게임입니다.

## 게임 플레이

- **조작**: 좌/우 방향키로 과일 위치 조정, 스페이스바로 드롭
- **규칙**: 같은 과일 두 개가 만나면 더 큰 과일로 진화
- **목표**: 높은 점수를 획득하세요

## 기술 스택

- **렌더링**: HTML5 Canvas
- **물리**: 커스텀 2D 물리 엔진
- **언어**: JavaScript ES6+
- **테스트**: Jest

## 설치 및 실행

```bash
# 프로젝트 설정
npm install

# 모든 테스트 실행
npm test

# 게임 서버 시작 (포트 8000)
npm start

# 브라우저에서 접속
http://localhost:8000/src/index.html
```

## 프로젝트 구조

```
src/
├── index.html           # 게임 메인 페이지
├── styles.css           # 스타일시트
├── Game.js              # 게임 메인 루프 및 제어
├── Fruit.js             # 과일 객체
├── Physics.js           # 물리 엔진
├── CollisionDetector.js # 충돌 감지
├── GameState.js         # 게임 상태 관리
└── InputHandler.js      # 입력 처리
```

## 핵심 기능

### 1. 물리 엔진
- 중력: 과일이 일정한 가속도로 아래로 떨어짐
- 마찰력: 과일의 움직임이 점진적으로 감소
- 반발력: 과일이 부딪힐 때 벡터 기반 반사

### 2. 충돌 감지
- 유클리드 거리 공식을 사용한 원형 충돌 감지
- 겹침 방지를 위한 분리 알고리즘
- 같은 레벨의 과일만 병합 가능

### 3. 게임 상태 관리
- 활성 과일 추적
- 점수 계산
- 게임 오버 판정

## 게임 파라미터

`src/Game.js`와 `src/Physics.js`에서 다음 파라미터를 조정하여 게임의 느낌을 변경할 수 있습니다:

- `gravity`: 중력 크기 (기본: 0.5)
- `friction`: 마찰력 계수 (기본: 0.96)
- `damping`: 충돌 반발력 (기본: 0.75)
- `nextFruitDelay`: 과일 생성 간격 (기본: 45 프레임)

## 라이선스

MIT
```

- [ ] **Step 2: ARCHITECTURE.md 작성**

```markdown
# 아키텍처 설계

## 개요

과일 게임은 다음과 같은 모듈로 구성되어 있습니다:

```
InputHandler → GameState → Game (Main Loop)
                          ↓
                        Physics
                        ↓
                  CollisionDetector
                        ↓
                       Fruit
```

## 핵심 컴포넌트

### Game.js
- **책임**: 게임 루프 관리, 게임 상태 업데이트, 렌더링
- **주요 메서드**:
  - `gameLoop()`: requestAnimationFrame으로 실행되는 메인 루프
  - `update()`: 게임 상태 업데이트 (물리, 충돌, 입력)
  - `draw()`: 캔버스에 게임 상태 렌더링
  - `mergeFruits()`: 과일 병합 처리

### Fruit.js
- **책임**: 개별 과일의 상태와 동작
- **주요 메서드**:
  - `updatePosition()`: 속도에 따라 위치 업데이트
  - `draw()`: 캔버스에 과일 렌더링
  - `isCollidingWith()`: 다른 과일과의 충돌 판단

### Physics.js
- **책임**: 물리 시뮬레이션
- **주요 메서드**:
  - `applyGravity()`: 중력 적용
  - `applyFriction()`: 마찰력 적용
  - `resolveCollision()`: 충돌 반발력 계산
  - `separateFruits()`: 겹친 과일 분리
  - `handleBoundaryCollision()`: 벽 충돌 처리

### CollisionDetector.js
- **책임**: 충돌 감지 및 병합 판정
- **주요 메서드**:
  - `detectCollision()`: 두 과일 간 충돌 판단
  - `findCollisions()`: 모든 충돌 쌍 찾기
  - `canMerge()`: 병합 가능 여부 판단
  - `getMergePosition()`: 병합 후 위치 계산

### GameState.js
- **책임**: 게임 상태 추적
- **주요 메서드**:
  - `addScore()`: 점수 추가
  - `addFruit()`: 과일 추가
  - `cleanup()`: 비활성 과일 제거
  - `checkGameOver()`: 게임 오버 조건 확인

### InputHandler.js
- **책임**: 키보드 입력 처리
- **주요 메서드**:
  - `getDirection()`: 현재 방향 반환 (-1, 0, 1)
  - `isFiring()`: 스페이스바 눌림 여부 (한 번만 true)

## 데이터 흐름

### 게임 루프
```
update()
  ├─ 활성 과일에 물리 적용 (중력, 마찰)
  ├─ 과일 위치 업데이트
  ├─ 충돌 감지
  ├─ 충돌 처리 (반발력, 분리)
  ├─ 병합 처리
  ├─ 게임 오버 확인
  └─ 입력 처리

draw()
  ├─ 배경 렌더링
  ├─ 다음 과일 미리보기
  ├─ 모든 과일 렌더링
  └─ 게임 오버 텍스트
```

## 충돌 처리 파이프라인

```
충돌 감지 (중심점 거리 < 반지름 합)
    ↓
물리 엔진 적용 (벡터 반발력)
    ↓
같은 레벨 확인
    ├─ YES: 과일 병합 (새 과일 생성, 기존 과일 제거)
    └─ NO: 그대로 계속
    ↓
겹침 분리 (5회 반복)
```

## 성능 최적화 고려사항

1. **객체 풀링**: 현재 Fruit 객체를 직접 생성/삭제하지만, 향후 풀링으로 최적화 가능
2. **공간 분할**: 충돌 감지 성능 향상을 위해 사각형 분할(Quadtree) 적용 가능
3. **배치 렌더링**: 현재는 과일별로 개별 렌더링하지만, 텍스처 아틀라스 사용 가능
4. **프레임 최적화**: 렉이 발생하면 `Application.screenUpdateEnabled` 비활성화 (Canvas는 자동)

## 테스트 전략

- **단위 테스트**: 각 클래스의 메서드 동작 검증 (Jest)
- **통합 테스트**: 게임 루프와 컴포넌트 간 상호작용 검증
- **수동 테스트**: 게임 플레이를 통한 기능성 검증
```

- [ ] **Step 3: Commit**

```bash
git add README.md docs/ARCHITECTURE.md
git commit -m "docs: add comprehensive readme and architecture documentation"
```

---

## 스펙 커버리지 확인

이 계획이 script.md의 모든 요구사항을 다루는지 확인:

✅ **물리 엔진**: Task 3에서 중력, 마찰력, 벡터 반발력 구현
✅ **충돌 감지**: Task 4에서 유클리드 거리 기반 충돌 감지 구현
✅ **과일 병합**: Task 2, 4에서 같은 레벨의 과일 병합 구현
✅ **점수 시스템**: Task 5에서 점수 관리 구현
✅ **게임 오버**: Task 5에서 게임 오버 판정 구현
✅ **UI/UX**: Task 1, 7에서 HTML/CSS 및 점수판 구현
✅ **입력 처리**: Task 6에서 키보드 입력 처리 구현
✅ **최적화**: Task 9에서 성능 파라미터 튜닝
✅ **테스트**: 각 태스크마다 Jest 기반 단위 테스트 작성

---

## 실행 방법

**Option 1: Subagent-Driven (권장)**
- 각 태스크마다 독립적인 subagent 실행
- 태스크 간 리뷰를 통한 품질 보증
- 더 빠른 반복 주기

**Option 2: Inline Execution**
- 현재 세션에서 순차적 실행
- `superpowers:executing-plans` 스킬 사용
- 실시간 피드백 가능

어느 방식으로 진행하시겠습니까?
