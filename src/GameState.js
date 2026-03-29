class GameState {
  constructor() {
    this.fruits = [];
    this.score = 0;
    this.isGameOver = false;
    this.nextFruitLevel = 1;
    this.frameCount = 0;
    this.spawnPosition = null;
  }

  addScore(points) {
    this.score += points;
  }

  addFruit(fruit) {
    this.fruits.push(fruit);
  }

  removeFruit(fruit) {
    const index = this.fruits.indexOf(fruit);
    if (index !== -1) {
      this.fruits.splice(index, 1);
    }
  }

  cleanup() {
    this.fruits = this.fruits.filter(fruit => fruit.isActive);
  }

  getActiveFruits() {
    return this.fruits.filter(fruit => fruit.isActive);
  }

  setGameOver() {
    this.isGameOver = true;
  }

  incrementFrame() {
    this.frameCount++;
  }

  reset() {
    this.fruits = [];
    this.score = 0;
    this.isGameOver = false;
    this.nextFruitLevel = 1;
    this.frameCount = 0;
    this.spawnPosition = null;
  }

  isFruitOutOfBounds(fruit, canvasHeight) {
    return fruit.y - fruit.radius > canvasHeight;
  }

  checkGameOver(canvasHeight, spawnY) {
    const now = Date.now();
    return this.fruits.some(fruit => {
      const isAboveSpawnLine = fruit.y - fruit.radius < spawnY;
      const isStable = Math.abs(fruit.vy) < 1.0;
      const isNotFresh = now - fruit.createdAt > 2000;
      return isAboveSpawnLine && isStable && isNotFresh;
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
}
