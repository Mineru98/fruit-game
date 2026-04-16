import * as CANNON from 'cannon-es';
import { Fruit } from './fruit';
import { PhysicsConfig } from './types';

export class CannonPhysics {
  private world: CANNON.World;
  private fruitBodies: Map<string, CANNON.Body> = new Map();
  private config: PhysicsConfig;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number, config?: Partial<PhysicsConfig>) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.config = {
      gravity: 9.8,
      friction: 0.3,
      restitution: 0.6,
      damping: 0.3,
      timeStep: 1 / 60,
      ...config,
    };

    this.world = new CANNON.World();
    this.world.gravity.set(0, this.config.gravity, 0);
    this.world.defaultContactMaterial.friction = this.config.friction;
    this.world.defaultContactMaterial.restitution = this.config.restitution;
  }

  addFruit(fruit: Fruit): void {
    if (this.fruitBodies.has(fruit.id)) return;

    const shape = new CANNON.Sphere(fruit.radius / 100); // Scale to physics units
    const body = new CANNON.Body({
      mass: 1,
      shape,
      linearDamping: this.config.damping,
      angularDamping: this.config.damping,
    });

    body.position.set(fruit.x / 100, fruit.y / 100, 0);
    body.velocity.set(fruit.vx / 100, fruit.vy / 100, 0);

    this.world.addBody(body);
    this.fruitBodies.set(fruit.id, body);
  }

  removeFruit(fruit: Fruit): void {
    const body = this.fruitBodies.get(fruit.id);
    if (body) {
      this.world.removeBody(body);
      this.fruitBodies.delete(fruit.id);
    }
  }

  step(fruits: Fruit[]): void {
    // Update physics bodies from fruits
    for (const fruit of fruits) {
      const body = this.fruitBodies.get(fruit.id);
      if (body) {
        body.position.set(fruit.x / 100, fruit.y / 100, 0);
        body.velocity.set(fruit.vx / 100, fruit.vy / 100, 0);
      }
    }

    // Step physics world
    this.world.step(this.config.timeStep);

    // Update fruits from physics bodies
    for (const fruit of fruits) {
      const body = this.fruitBodies.get(fruit.id);
      if (body) {
        fruit.x = body.position.x * 100;
        fruit.y = body.position.y * 100;
        fruit.vx = body.velocity.x * 100;
        fruit.vy = body.velocity.y * 100;

        // Apply boundary constraints
        this.applyBoundaryConstraints(fruit);
      }
    }
  }

  private applyBoundaryConstraints(fruit: Fruit): void {
    const margin = fruit.radius;

    if (fruit.x - margin < 20) {
      fruit.x = 20 + margin;
      fruit.vx *= -0.75;
    }
    if (fruit.x + margin > this.canvasWidth - 20) {
      fruit.x = this.canvasWidth - 20 - margin;
      fruit.vx *= -0.75;
    }
    if (fruit.y + margin > this.canvasHeight) {
      fruit.y = this.canvasHeight - margin;
      fruit.vy *= -0.75;
    }
  }

  getContactPairs(): [Fruit, Fruit][] {
    const pairs: [Fruit, Fruit][] = [];
    const fruitArray = Array.from(this.fruitBodies.keys());

    for (let i = 0; i < fruitArray.length; i++) {
      for (let j = i + 1; j < fruitArray.length; j++) {
        const body1 = this.fruitBodies.get(fruitArray[i]);
        const body2 = this.fruitBodies.get(fruitArray[j]);

        if (body1 && body2) {
          const dx = body2.position.x - body1.position.x;
          const dy = body2.position.y - body1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Simple sphere collision detection
          const minDist = (body1.shapes[0] as CANNON.Sphere).radius + (body2.shapes[0] as CANNON.Sphere).radius;
          if (distance < minDist * 1.1) {
            const fruit1 = Array.from(this.fruitBodies.entries()).find((e) => e[1] === body1)?.[0];
            const fruit2 = Array.from(this.fruitBodies.entries()).find((e) => e[1] === body2)?.[0];
            if (fruit1 && fruit2) {
              pairs.push([fruit1 as any, fruit2 as any]);
            }
          }
        }
      }
    }

    return pairs;
  }

  reset(): void {
    this.fruitBodies.clear();
    const bodiesToRemove = [...this.world.bodies];
    for (const body of bodiesToRemove) {
      this.world.removeBody(body);
    }
  }
}
