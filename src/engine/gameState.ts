import { Fruit } from './fruit';
import { GameStateData } from './types';

export class GameState {
  fruits: Fruit[] = [];
  score: number = 0;
  isGameOver: boolean = false;
  nextFruitLevel: number = 1;
  frameCount: number = 0;

  addScore(points: number): void {
    this.score += points;
  }

  addFruit(fruit: Fruit): void {
    this.fruits.push(fruit);
  }

  removeFruit(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);
    if (index !== -1) {
      this.fruits.splice(index, 1);
    }
  }

  getActiveFruits(): Fruit[] {
    return this.fruits.filter((f) => f.isActive);
  }

  cleanup(): void {
    this.fruits = this.fruits.filter((f) => f.isActive);
  }

  setGameOver(): void {
    this.isGameOver = true;
  }

  incrementFrame(): void {
    this.frameCount++;
  }

  checkGameOver(canvasHeight: number, spawnY: number): boolean {
    const now = Date.now();
    return this.fruits.some((fruit) => {
      const isAboveSpawnLine = fruit.y - fruit.radius < spawnY;
      const isStable = Math.abs(fruit.vy) < 1.0;
      const isNotFresh = now - fruit.createdAt > 2000;
      return isAboveSpawnLine && isStable && isNotFresh;
    });
  }

  reset(): void {
    this.fruits = [];
    this.score = 0;
    this.isGameOver = false;
    this.nextFruitLevel = 1;
    this.frameCount = 0;
  }

  toData(): GameStateData {
    return {
      fruits: this.fruits.map((f) => f.toData()),
      score: this.score,
      isGameOver: this.isGameOver,
      nextFruitLevel: this.nextFruitLevel,
      frameCount: this.frameCount,
    };
  }
}
