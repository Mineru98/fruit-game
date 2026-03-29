if (typeof require !== 'undefined') {
  var Fruit = require('./Fruit');
  var Physics = require('./Physics');
  var CollisionDetector = require('./CollisionDetector');
  var GameState = require('./GameState');
  var InputHandler = require('./InputHandler');
}

class Game {
  constructor(canvasId = 'gameCanvas') {
    this.canvas = null;
    this.ctx = null;

    if (typeof document !== 'undefined') {
      this.canvas = document.getElementById(canvasId);
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
      }
    }

    this.canvasWidth = 400;
    this.canvasHeight = 600;

    this.gameState = new GameState();
    this.physics = new Physics();
    this.collisionDetector = new CollisionDetector();
    this.inputHandler = new InputHandler();

    this.spawnX = this.canvasWidth / 2;
    this.spawnY = 50;
    this.moveSpeed = 5;
    this.nextFruitDelay = false;
    this.backgroundColor = '#f5f5f5';
    this.gameOverLineY = this.spawnY;
    this.separationIterations = 5;

    this._animationId = null;
    this._boundGameLoop = this.gameLoop.bind(this);
  }

  start() {
    this.gameState.reset();
    this.spawnX = this.canvasWidth / 2;
    this.nextFruitDelay = false;
    this.gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;
    this.gameState.isRunning = true;

    if (typeof document !== 'undefined') {
      this.inputHandler.reset();
    }

    this.gameLoop();
  }

  stop() {
    this.gameState.isRunning = false;
    if (this._animationId) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this._animationId);
      }
      this._animationId = null;
    }
    if (typeof document !== 'undefined') {
      this.inputHandler.reset();
    }
  }

  gameLoop() {
    if (!this.gameState.isRunning) return;

    this.update();
    this.draw();
    this.gameState.incrementFrame();

    if (typeof requestAnimationFrame !== 'undefined') {
      this._animationId = requestAnimationFrame(this._boundGameLoop);
    }
  }

  update() {
    if (this.gameState.isGameOver) return;

    const activeFruits = this.gameState.getActiveFruits();

    // Apply physics to all active fruits
    for (const fruit of activeFruits) {
      this.physics.applyGravity(fruit);
      this.physics.applyFriction(fruit);
      fruit.updatePosition();
      this.physics.handleBoundaryCollision(fruit, this.canvasWidth, this.canvasHeight);
    }

    // Detect collisions and handle merges
    const collisions = this.collisionDetector.findCollisions(activeFruits);
    for (const [i, j] of collisions) {
      const fruit1 = activeFruits[i];
      const fruit2 = activeFruits[j];

      if (!fruit1.isActive || !fruit2.isActive) continue;

      this.physics.resolveCollision(fruit1, fruit2);

      if (this.collisionDetector.canMerge(fruit1, fruit2)) {
        this.mergeFruits(fruit1, fruit2);
      }
    }

    // Separation iterations - re-detect each iteration to avoid stale pairs
    for (let iter = 0; iter < this.separationIterations; iter++) {
      const currentActive = this.gameState.getActiveFruits();
      const separationPairs = this.collisionDetector.findCollisions(currentActive);
      for (const [i, j] of separationPairs) {
        if (currentActive[i].isActive && currentActive[j].isActive) {
          this.physics.separateFruits(currentActive[i], currentActive[j]);
        }
      }
    }

    // Handle input: move spawn position
    const dir = this.inputHandler.getDirection();
    if (dir === -1) {
      this.spawnX = Math.max(20, this.spawnX - this.moveSpeed);
    } else if (dir === 1) {
      this.spawnX = Math.min(this.canvasWidth - 20, this.spawnX + this.moveSpeed);
    }

    // Handle input: fire/spawn fruit
    if (this.inputHandler.isFiring()) {
      this.handleSpawn();
    }

    // Check game over
    if (this.gameState.checkGameOver(this.canvasHeight, this.gameOverLineY)) {
      this.gameState.setGameOver();
    }

    // Cleanup inactive fruits
    this.gameState.cleanup();

    // Update score display
    this.updateScoreDisplay();
  }

  draw() {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw game-over line
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.gameOverLineY);
    this.ctx.lineTo(this.canvasWidth, this.gameOverLineY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw next-fruit preview at spawn position
    if (!this.gameState.isGameOver && !this.nextFruitDelay) {
      const previewLevel = this.gameState.nextFruitLevel;
      const previewRadius = Fruit.getRadius(previewLevel);
      this.ctx.globalAlpha = 0.5;
      this.ctx.beginPath();
      this.ctx.arc(this.spawnX, this.spawnY, previewRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = Fruit.COLORS[previewLevel];
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.globalAlpha = 1.0;
    }

    // Draw all active fruits
    const activeFruits = this.gameState.getActiveFruits();
    for (const fruit of activeFruits) {
      fruit.draw(this.ctx);
    }

    // Game over overlay
    if (this.gameState.isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 36px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over', this.canvasWidth / 2, this.canvasHeight / 2 - 20);

      this.ctx.font = '24px Arial';
      this.ctx.fillText(
        'Score: ' + this.gameState.score,
        this.canvasWidth / 2,
        this.canvasHeight / 2 + 20
      );
    }
  }

  handleSpawn() {
    if (this.gameState.isGameOver) return;
    if (this.nextFruitDelay) return;

    this.spawnFruit();
    this.nextFruitDelay = true;

    setTimeout(() => {
      this.nextFruitDelay = false;
    }, 500);
  }

  spawnFruit() {
    const level = this.gameState.nextFruitLevel;
    const fruit = new Fruit(this.spawnX, this.spawnY, level);
    this.gameState.addFruit(fruit);

    // Random next level 1-5 (RALPLAN-DR fix: not deterministic escalation)
    this.gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;
  }

  mergeFruits(fruit1, fruit2) {
    const newLevel = fruit1.level + 1;
    if (newLevel > 11) return;

    const pos = this.collisionDetector.getMergePosition(fruit1, fruit2);
    const vel = this.collisionDetector.getMergeVelocity(fruit1, fruit2);

    const newFruit = new Fruit(pos.x, pos.y, newLevel);
    newFruit.vx = vel.vx;
    newFruit.vy = vel.vy;

    this.gameState.addFruit(newFruit);
    this.gameState.addScore(newFruit.getScore());

    fruit1.isActive = false;
    fruit2.isActive = false;
  }

  updateScoreDisplay() {
    if (typeof document === 'undefined') return;
    const scoreEl = document.getElementById('scoreValue');
    if (scoreEl) {
      scoreEl.textContent = this.gameState.score;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}
