import { Fruit } from './Fruit';
import { GameState } from './GameState';

export interface MergeCallback {
  (fruit1: Fruit, fruit2: Fruit, newFruit: Fruit): void;
}

export class CollisionHandler {
  private mergeCallback?: MergeCallback;

  constructor(mergeCallback?: MergeCallback) {
    this.mergeCallback = mergeCallback;
  }

  setMergeCallback(callback: MergeCallback): void {
    this.mergeCallback = callback;
  }

  findCollisions(fruits: Fruit[]): [Fruit, Fruit][] {
    const collisions: [Fruit, Fruit][] = [];

    for (let i = 0; i < fruits.length; i++) {
      for (let j = i + 1; j < fruits.length; j++) {
        const f1 = fruits[i];
        const f2 = fruits[j];

        if (!f1.isActive || !f2.isActive) continue;

        const dx = f2.x - f1.x;
        const dy = f2.y - f1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < f1.radius + f2.radius) {
          collisions.push([f1, f2]);
        }
      }
    }

    return collisions;
  }

  canMerge(fruit1: Fruit, fruit2: Fruit): boolean {
    return fruit1.level === fruit2.level && fruit1.level < 11;
  }

  mergeFruits(fruit1: Fruit, fruit2: Fruit, gameState: GameState): Fruit | null {
    const newLevel = fruit1.level + 1;
    if (newLevel > 11) return null;

    const newFruit = new Fruit(
      `fruit-${Date.now()}-${Math.random()}`,
      newLevel,
      (fruit1.x + fruit2.x) / 2,
      (fruit1.y + fruit2.y) / 2
    );

    newFruit.vx = (fruit1.vx + fruit2.vx) / 2;
    newFruit.vy = (fruit1.vy + fruit2.vy) / 2;

    gameState.addFruit(newFruit);
    gameState.addScore(Fruit.getScore(newLevel));

    fruit1.isActive = false;
    fruit2.isActive = false;

    if (this.mergeCallback) {
      this.mergeCallback(fruit1, fruit2, newFruit);
    }

    return newFruit;
  }

  handleCollision(fruit1: Fruit, fruit2: Fruit): void {
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const angle = Math.atan2(dy, dx);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Simple collision response
    const relVx = fruit2.vx - fruit1.vx;
    const relVy = fruit2.vy - fruit1.vy;
    const relVel = relVx * cos + relVy * sin;

    if (relVel < 0) {
      fruit1.vx -= 2 * cos * 0.5;
      fruit2.vx += 2 * cos * 0.5;
      fruit1.vy -= 2 * sin * 0.5;
      fruit2.vy += 2 * sin * 0.5;
    }
  }

  getMergePosition(fruit1: Fruit, fruit2: Fruit): { x: number; y: number } {
    return {
      x: (fruit1.x + fruit2.x) / 2,
      y: (fruit1.y + fruit2.y) / 2,
    };
  }

  getMergeVelocity(fruit1: Fruit, fruit2: Fruit): { vx: number; vy: number } {
    return {
      vx: (fruit1.vx + fruit2.vx) / 2,
      vy: (fruit1.vy + fruit2.vy) / 2,
    };
  }
}
