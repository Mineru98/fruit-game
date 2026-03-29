// Types for Fruit Game Engine

export interface FruitData {
  id: string;
  level: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isActive: boolean;
  createdAt: number;
}

export interface GameStateData {
  fruits: FruitData[];
  score: number;
  isGameOver: boolean;
  nextFruitLevel: number;
  frameCount: number;
}

export interface PhysicsConfig {
  gravity: number;
  friction: number;
  restitution: number;
  damping: number;
  timeStep: number;
}

export interface CollisionPair {
  fruit1: FruitData;
  fruit2: FruitData;
}
