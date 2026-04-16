import { FruitData } from './types';

export class Fruit {
  static readonly RADIUS_MAP: Record<number, number> = {
    1: 12,
    2: 15,
    3: 18,
    4: 22,
    5: 26,
    6: 31,
    7: 36,
    8: 42,
    9: 48,
    10: 55,
    11: 65,
  };

  id: string;
  level: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isActive: boolean;
  createdAt: number;

  constructor(id: string, level: number, x: number, y: number) {
    this.id = id;
    this.level = level;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = Fruit.getRadius(level);
    this.isActive = true;
    this.createdAt = Date.now();
  }

  static getRadius(level: number): number {
    return this.RADIUS_MAP[level] || 12;
  }

  static getScore(level: number): number {
    return Math.pow(2, level) * 10;
  }

  static getNextLevel(level: number): number | null {
    const nextLevel = level + 1;
    return nextLevel <= 11 ? nextLevel : null;
  }

  toData(): FruitData {
    return {
      id: this.id,
      level: this.level,
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      radius: this.radius,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }

  static fromData(data: FruitData): Fruit {
    const fruit = new Fruit(data.id, data.level, data.x, data.y);
    fruit.vx = data.vx;
    fruit.vy = data.vy;
    fruit.isActive = data.isActive;
    fruit.createdAt = data.createdAt;
    return fruit;
  }
}
