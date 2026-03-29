import { FruitData } from './types';

export class Fruit {
  static readonly COLORS: Record<number, string> = {
    1: '#FF6B6B',
    2: '#4ECDC4',
    3: '#FFE66D',
    4: '#A8E6CF',
    5: '#FF8B94',
    6: '#B8B8FF',
    7: '#FFDAC1',
    8: '#E2F0CB',
    9: '#C7CEEA',
    10: '#FF9AA2',
    11: '#2E8B57',
  };

  static readonly RADIUS_MAP: Record<number, number> = {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 22,
    7: 24,
    8: 26,
    9: 28,
    10: 30,
    11: 35,
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
